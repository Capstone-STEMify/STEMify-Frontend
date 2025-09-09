import { forwardRef, useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { Group } from 'three'
import { Connector } from '../types/assembly.types'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  connector: Connector
  fade?: any
  animate?: boolean
  modelUrl?: string
  modelScale?: [number, number, number] | number
  rotationOffset?: [number, number, number]
  showDebug?: boolean
  armPose?: { arm1?: number; arm2?: number }
}

export const Connector3D = forwardRef<Group, Props>(({ connector, fade, animate = false, modelUrl = '/models/Strawbees2.glb', modelScale = [0.05, 0.05, 0.05], rotationOffset = [0, 0, 0], showDebug = false, armPose }, ref) => {
  const { transform } = connector
  
  // Use existing ports from connector
  const effectivePorts = connector.ports || []
  const { scene } = useGLTF(modelUrl)
  
  // State cho animation - sử dụng useRef để tránh re-render
  const hubRef = useRef<THREE.Object3D | null>(null)
  const arm1Ref = useRef<THREE.Object3D | null>(null)
  const arm2Ref = useRef<THREE.Object3D | null>(null)
  const [currentAngle1, setCurrentAngle1] = useState(0)
  const [currentAngle2, setCurrentAngle2] = useState(0)
  
  // Debug state - sử dụng useRef để tránh re-render
  const componentId = useRef<string>(`connector-${Math.random().toString(36).substr(2, 9)}`)
  const frameCount = useRef<number>(0)
  const lastErrorTime = useRef<number>(0)
  const errorCount = useRef<number>(0)
  const isInitialized = useRef<boolean>(false)

  // Memoize scene clone để tránh tạo object mới mỗi lần
  const clonedScene = useMemo(() => {
    if (!scene) return null
    return scene.clone()
  }, [scene])

  // Debug: Log component lifecycle - chỉ log một lần
  useEffect(() => {
    const id = componentId.current
    const connectorId = connector.id
    const position = transform.position
    const scale = transform.scale
    
    // console.log(`[${id}] Connector3D mounted:`, {
    //   connectorId,
    //   position,
    //   scale,
    //   timestamp: Date.now()
    // })

    // return () => {
    //   console.log(`[${id}] Connector3D unmounting:`, {
    //     connectorId,
    //     frameCount: frameCount.current,
    //     errorCount: errorCount.current,
    //     timestamp: Date.now()
    //   })
    // }
  }, [connector.id, transform.position, transform.scale])

  // Setup model và tìm các object - chỉ chạy khi scene thay đổi
  useEffect(() => {
    if (!clonedScene || isInitialized.current) return
    
    try {
      console.log(`[${componentId.current}] Setting up model...`)
      
      // Tìm các object theo tên
      const hub_obj = clonedScene.getObjectByName('Hub')
      const arm1_obj = clonedScene.getObjectByName('Arm_1')
      const arm2_obj = clonedScene.getObjectByName('Arm_2')
      
      console.log(`[${componentId.current}] Found objects:`, {
        hub: !!hub_obj,
        arm1: !!arm1_obj,
        arm2: !!arm2_obj,
        totalChildren: clonedScene.children.length
      })
      
      // Lưu vào ref thay vì state
      hubRef.current = hub_obj || null
      arm1Ref.current = arm1_obj || null
      arm2Ref.current = arm2_obj || null
      
      isInitialized.current = true
      console.log(`[${componentId.current}] Model setup completed`)
      
    } catch (error) {
      console.error(`[${componentId.current}] Error in model setup:`, error)
      errorCount.current++
      lastErrorTime.current = Date.now()
    }
  }, [clonedScene])

  // Apply armPose when provided, with fallback to connector.data.arms default rotations
  useEffect(() => {
    if (!isInitialized.current) return
    
    // Apply arm1 pose or default
    if (arm1Ref.current) {
      const angle1 = armPose?.arm1 ?? 0
      try { setHinge(arm1Ref.current, angle1, 'z') } catch {}
    }
    
    // Apply arm2 pose or default  
    if (arm2Ref.current) {
      const angle2 = armPose?.arm2 ?? 0
      try { setHinge(arm2Ref.current, angle2, 'z') } catch {}
    }
  }, [armPose])

  // Hàm xoay có clamp với error handling - sử dụng useCallback
  // Giá trị đầu vào là radian, clamp từ -π/2 đến π/2 (tương đương -90° đến 90°)
  const setHinge = useCallback((obj: THREE.Object3D | null, rad: number, axis: 'x' | 'y' | 'z' = 'z', min: number = -Math.PI/2, max: number = Math.PI/2) => {
    if (!obj) return
    
    try {
      const r = THREE.MathUtils.clamp(rad, min, max)
      obj.rotation[axis] = r
    } catch (error) {
      console.error(`[${componentId.current}] Error in setHinge:`, error, {
        obj: obj.name,
        axis,
        rad,
        timestamp: Date.now()
      })
      errorCount.current++
      lastErrorTime.current = Date.now()
    }
  }, [])

  // Animation loop với error handling và performance monitoring
  useFrame((state) => {
    try {
      frameCount.current++
      
      // Performance check: Log if frame rate drops - giảm tần suất log
      if (frameCount.current % 300 === 0) { // Every 300 frames (5 seconds at 60fps)
        const fps = 1 / state.clock.getDelta()
        if (fps < 30) {
          console.warn(`[${componentId.current}] Low FPS detected:`, {
            fps: Math.round(fps),
            frameCount: frameCount.current,
            timestamp: Date.now()
          })
        }
      }
      
      // Optional simple hinge animation (disabled by default)
      if (animate && isInitialized.current) {
        if (arm1Ref.current) {
          const angle1 = Math.sin(state.clock.elapsedTime * 2) * 30
          setHinge(arm1Ref.current, angle1, 'z')
          setCurrentAngle1(angle1)
        }
        if (arm2Ref.current) {
          const angle2 = Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 20
          setHinge(arm2Ref.current, angle2, 'z')
          setCurrentAngle2(angle2)
        }
      }
    } catch (error) {
      console.error(`[${componentId.current}] Error in animation frame:`, error, {
        frameCount: frameCount.current,
        timestamp: Date.now(),
        arm1Exists: !!arm1Ref.current,
        arm2Exists: !!arm2Ref.current,
        isInitialized: isInitialized.current
      })
      errorCount.current++
      lastErrorTime.current = Date.now()
    }
  })

  // Debug: Monitor error frequency - giảm tần suất check
  useEffect(() => {
    if (errorCount.current > 0) {
      const timeSinceLastError = Date.now() - lastErrorTime.current
      console.warn(`[${componentId.current}] Error frequency:`, {
        errorCount: errorCount.current,
        timeSinceLastError: `${timeSinceLastError}ms`,
        connectorId: connector.id
      })
      
      // If too many errors in short time, log critical warning
      if (errorCount.current > 5 && timeSinceLastError < 10000) {
        console.error(`[${componentId.current}] CRITICAL: Too many errors detected!`, {
          errorCount: errorCount.current,
          timeSinceLastError,
          connectorId: connector.id,
          timestamp: Date.now()
        })
      }
    }
  }, [connector.id])

  // Debug: Log memory usage periodically - tăng interval để giảm overhead
  useEffect(() => {
    const memoryInterval = setInterval(() => {
      try {
        // Check if performance.memory is available (Chrome only)
        if ((performance as any).memory) {
          const memory = (performance as any).memory
          console.log(`[${componentId.current}] Memory usage:`, {
            usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
            totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
            jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB',
            connectorId: connector.id
          })
        }
      } catch (error) {
        // Memory API not available, skip silently
      }
    }, 30000) // Every 30 seconds thay vì 10 seconds

    return () => clearInterval(memoryInterval)
  }, [connector.id])

  // Memoize transform để tránh re-render không cần thiết
  const transformGroup = useMemo(() => ({
    position: [transform.position.x, transform.position.y, transform.position.z] as [number, number, number],
    rotation: [transform.rotation.x, transform.rotation.y, transform.rotation.z] as [number, number, number],
    scale: [transform.scale.x, transform.scale.y, transform.scale.z] as [number, number, number]
  }), [transform.position, transform.rotation, transform.scale])

  return (
    <group
      ref={ref}
      position={transformGroup.position}
      rotation={transformGroup.rotation}
      scale={transformGroup.scale}
    >
      {/* Model container with optional rotation offset and configurable scale */}
      <group rotation={rotationOffset} scale={Array.isArray(modelScale) ? modelScale : [modelScale, modelScale, modelScale]}>
        {clonedScene && <primitive object={clonedScene} />}
        {showDebug && hubRef.current && <primitive object={new THREE.AxesHelper(2)} />}
        {showDebug && arm1Ref.current && <primitive object={new THREE.AxesHelper(2)} />}
        {showDebug && arm2Ref.current && <primitive object={new THREE.AxesHelper(2)} />}
        {showDebug && arm1Ref.current && (
          <mesh position={arm1Ref.current.getWorldPosition(new THREE.Vector3())}>
            <sphereGeometry args={[0.15, 8, 6]} />
            <meshBasicMaterial color="red" />
          </mesh>
        )}
        {showDebug && arm2Ref.current && (
          <mesh position={arm2Ref.current.getWorldPosition(new THREE.Vector3())}>
            <sphereGeometry args={[0.15, 8, 6]} />
            <meshBasicMaterial color="blue" />
          </mesh>
        )}
      </group>
    </group>
  )
})

Connector3D.displayName = 'Connector3D'

// Preload the default model
useGLTF.preload('/models/Strawbees2.glb')
