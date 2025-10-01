'use client'

import React, { useEffect, useMemo, useRef, useState, useLayoutEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, useGLTF, useAnimations, OrbitControls, useProgress } from '@react-three/drei'
import { usePathname } from 'next/navigation'
import type { Group } from 'three'
import { Box3, Vector3 } from 'three'

type Assistant3DProps = {
  messages?: Record<string, string[]>
  enabled?: boolean
  debug?: boolean
  /** Tên file trong /public/models/, mặc định 'assistant.glb' */
  modelFile?: string
}

/** Lấy assetPrefix/basePath đúng (khi deploy dưới subpath/cdn) */
function resolveAssetUrl(path: string) {
  const prefix = (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.assetPrefix) || ''
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`
}

/** Overlay debug tiến trình tải và lỗi */
function LoaderOverlay({ url, notFound }: { url: string; notFound: boolean }) {
  const { progress, active, errors, item } = useProgress()
  if (notFound) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-sm">
        <div className="rounded-lg bg-white/95 p-3 shadow-lg">
          <div className="font-semibold mb-1">Không tìm thấy model</div>
          <div className="text-gray-700">Đặt file ở <code>public/models/assistant.glb</code></div>
          <div className="text-gray-700">URL thử tải: <code>{url}</code></div>
        </div>
      </div>
    )
  }
  if (!active && !errors?.length) return null
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-xs shadow">
        {errors?.length ? (
          <div className="text-red-600">
            Lỗi load
          </div>
        ) : (
          <div>
            Đang tải {Math.round(progress)}% {item ? <span className="text-gray-600">({item})</span> : null}
          </div>
        )}
      </div>
    </div>
  )
}

function AvatarModel({
  bubbleText,
  modelUrl,
  debug = false
}: {
  bubbleText?: string | null
  modelUrl: string
  debug?: boolean
}) {
  const root = useRef<Group>(null)
  // Dùng chữ ký cơ bản nhất để tương thích: chỉ truyền URL
  const { scene, animations } = useGLTF(modelUrl) as any
  const { actions } = useAnimations(animations, root)

  // Auto-fit: center XZ, chân ở y=0, scale về chiều cao mục tiêu
  useLayoutEffect(() => {
    if (!scene || !root.current) return
    if (!root.current.children.includes(scene)) root.current.add(scene)

    const box = new Box3().setFromObject(scene)
    const size = new Vector3()
    const center = new Vector3()
    box.getSize(size)
    box.getCenter(center)

    const minY = box.min.y
    scene.position.x += -center.x
    scene.position.z += -center.z
    scene.position.y += -minY

    const targetHeight = 1.6
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = maxDim > 0 ? targetHeight / maxDim : 1
    scene.scale.setScalar(s)
  }, [scene])

  // Play Idle nếu có
  useEffect(() => {
    const keys = actions ? Object.keys(actions) : []
    const idle = actions && (actions['Idle'] || (keys.length ? actions[keys[0]] : undefined))
    idle?.reset()?.fadeIn(0.3)?.play?.()
    return () => {
      idle?.fadeOut?.(0.3)
      idle?.stop?.()
    }
  }, [actions])

  // Tính vị trí bubble sau khi scale
  const bubbleY = (() => {
    if (!scene) return 1.2
    const b = new Box3().setFromObject(scene)
    return b.max.y + 0.12
  })()

  return (
    <group ref={root}>
      {debug && <axesHelper args={[0.5]} />}
      {bubbleText && (
        <Html position={[0, bubbleY, 0]} center transform occlude>
          <div
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              borderRadius: 16,
              padding: '10px 12px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
              maxWidth: 280,
              fontSize: 14,
              lineHeight: '18px'
            }}
          >
            {bubbleText}
          </div>
        </Html>
      )}
    </group>
  )
}

/** Đẩy message từ nơi khác trong app */
export function pushAssistantMessage(msg: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('assistant:push', { detail: msg }))
  }
}

export default function Assistant3D({
  messages = {},
  enabled = true,
  debug = false,
  modelFile = 'assistant.glb'
}: Assistant3DProps) {
  const pathname = usePathname()
  const [queue, setQueue] = useState<string[]>([])
  const [current, setCurrent] = useState<string | null>(null)
  const timerRef = useRef<number | undefined>(undefined)

  // URL tuyệt đối có tính đến assetPrefix/basePath
  const modelUrl = useMemo(() => resolveAssetUrl(`/models/${modelFile}`), [modelFile])

  // HEAD check để bắt 404 nhanh (nhiều khi do sai thư mục hoặc basePath)
  const [notFound, setNotFound] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch(modelUrl, { method: 'HEAD' })
      .then(r => !cancelled && setNotFound(!r.ok))
      .catch(() => !cancelled && setNotFound(true))
    return () => {
      cancelled = true
    }
  }, [modelUrl])

  const script = useMemo(() => {
    const entry = Object.entries(messages).find(([prefix]) => pathname?.startsWith(prefix))
    return entry ? entry[1] : []
  }, [pathname, messages])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      setQueue(q => [...q, detail])
    }
    window.addEventListener('assistant:push', handler as any)
    return () => window.removeEventListener('assistant:push', handler as any)
  }, [])

  useEffect(() => {
    if (script.length) setQueue(script)
  }, [script])

  useEffect(() => {
    if (!enabled) return
    if (!current && queue.length) {
      const [head, ...rest] = queue
      setCurrent(head)
      setQueue(rest)

      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
          const u = new SpeechSynthesisUtterance(head)
          u.rate = 1
          window.speechSynthesis.speak(u)
        }
      } catch { /* ignore */ }

      const ms = Math.max(2200, head.length * 70)
      timerRef.current = window.setTimeout(() => setCurrent(null), ms) as unknown as number
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [enabled, current, queue])

  if (!enabled) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-30"
      style={{ width: 320, height: 400, borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', position: 'fixed' }}
      aria-label="3D Assistant"
    >
      <Canvas camera={{ position: [0, 1, 3], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 4, 3]} intensity={1} />
        {/* Suspense để fallback rõ ràng khi model đang tải */}
        <Suspense fallback={null}>
          <AvatarModel bubbleText={current} modelUrl={modelUrl} debug={debug} />
        </Suspense>
        {debug && <OrbitControls enableZoom />}
      </Canvas>

      {/* Overlay hiển thị lỗi/tiến trình */}
      <LoaderOverlay url={modelUrl} notFound={notFound} />
    </div>
  )
}

// Preload model (sử dụng đúng URL đã resolve)
if (typeof window !== 'undefined') {
  useGLTF.preload(resolveAssetUrl('/models/assistant.glb'))
}
