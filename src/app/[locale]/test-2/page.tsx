'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Straw } from 'app/[locale]/test-2/Straw'
import sceneData from '../test-2/straw-test.json'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { Group } from 'three'

// ✨ import react-spring
import { a, useTransition } from '@react-spring/three'

export default function App() {
  const { straws, scene } = sceneData
  const strawRefs = useRef<Record<string, React.Ref<Group>>>({})

  const getStrawRef = (key: string): React.Ref<Group> => (strawRefs.current[key] ??= createRef<Group>())

  const [step, setStep] = useState(0)
  const maxStep = straws.length
  const clampedStep = Math.min(Math.max(step, 0), maxStep)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, maxStep))
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [maxStep])

  const visibleStraws = useMemo(() => straws.slice(0, clampedStep), [straws, clampedStep])

  const transitions = useTransition(visibleStraws, {
    from: { s: 0.9, y: 0.2, o: 0 },
    enter: { s: 1.0, y: 0.0, o: 1 },
    leave: { s: 0.9, y: -0.2, o: 0 },
    trail: 100,
    config: (item, state, phase) => (phase === 'leave' ? { duration: 130 } : { tension: 170, friction: 20 })
  })

  {
    transitions((style, s, _, i) => {
      const refKey = `${s.id}-${i}`
      return (
        <a.group key={refKey} scale={style.s} position-y={style.y}>
          <Straw straw={s} ref={getStrawRef(refKey)} /* fade={style.o} */ />
        </a.group>
      )
    })
  }

  return (
    <div className='relative h-screen w-full'>
      {/* Controls */}
      <div className='absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow'>
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={clampedStep === 0}
          className='rounded-lg border px-3 py-1 disabled:opacity-50'
          title='Previous (←)'
        >
          Previous
        </button>
        <div className='px-2 text-sm tabular-nums'>
          {clampedStep} / {maxStep}
        </div>
        <button
          onClick={() => setStep((s) => Math.min(s + 1, maxStep))}
          disabled={clampedStep === maxStep}
          className='rounded-lg border px-3 py-1 disabled:opacity-50'
          title='Next (→)'
        >
          Next
        </button>
      </div>

      <Canvas camera={{ position: [0, 10, 30], fov: scene.environment.camera.fov }}>
        <ambientLight color={scene.environment.lighting.ambient} />
        <directionalLight
          color={scene.environment.lighting.directional.color}
          intensity={scene.environment.lighting.directional.intensity}
          position={[
            scene.environment.lighting.directional.position.x,
            scene.environment.lighting.directional.position.y,
            scene.environment.lighting.directional.position.z
          ]}
        />
        <OrbitControls />
        {scene.workspace.grid.visible && (
          <Grid args={[scene.workspace.grid.size, scene.workspace.grid.size, scene.workspace.grid.divisions]} />
        )}

        {/* Render với transitions */}
        {transitions((style, s, _, i) => {
          const refKey = `${s.id}-${i}`
          return (
            <a.group
              key={refKey}
              // animate scale & "nhảy" theo trục Y cục bộ
              scale={style.s}
              position-y={style.y}
            >
              {/* Truyền style.o làm fade nếu bạn đã sửa Straw nhận prop `fade` */}
              <Straw straw={s} ref={getStrawRef(refKey)} fade={style.o} />
            </a.group>
          )
        })}
      </Canvas>
    </div>
  )
}
