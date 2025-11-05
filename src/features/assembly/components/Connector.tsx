import { forwardRef, useMemo, useRef, useEffect, useCallback } from 'react'
import { Group } from 'three'
import { Connector } from '../types/assembly.types'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  connector: Connector
  fade?: any
  animate?: boolean
  modelUrl: string
  modelScale?: [number, number, number] | number
  rotationOffset?: [number, number, number]
  showDebug?: boolean
  armPose?: Record<string, { x?: number; y?: number; z?: number }>
}

export const Connector3D = forwardRef<Group, Props>(
  (
    {
      connector,
      fade,
      animate = false,
      modelUrl,
      modelScale = [0.05, 0.05, 0.05],
      rotationOffset = [0, 0, 0],
      showDebug = false,
      armPose
    },
    ref
  ) => {
    const { transform } = connector
    const gltf = useGLTF(modelUrl)
    const scene = useMemo(() => gltf.scene?.clone() ?? null, [gltf])

    const componentId = useRef<string>(`connector-${Math.random().toString(36).substr(2, 9)}`)
    const frameCount = useRef<number>(0)
    const lastErrorTime = useRef<number>(0)
    const errorCount = useRef<number>(0)
    const isInitialized = useRef<boolean>(false)

    const hubRef = useRef<THREE.Object3D | null>(null)
    const armsRef = useRef<Record<string, THREE.Object3D>>({})

    const setHinge = useCallback(
      (
        obj: THREE.Object3D | null,
        rad: number,
        axis: 'x' | 'y' | 'z' = 'z',
        min: number = -Math.PI / 2,
        max: number = Math.PI / 2
      ) => {
        if (!obj) return
        try {
          const r = THREE.MathUtils.clamp(rad, min, max)
          obj.rotation[axis] = r
        } catch (error) {
          console.error(`[${componentId.current}] Error in setHinge`, error)
          errorCount.current++
          lastErrorTime.current = Date.now()
        }
      },
      []
    )

    useEffect(() => {
      if (!scene || isInitialized.current) return

      try {
        isInitialized.current = true

        // Tìm Hub
        hubRef.current = scene.getObjectByName('Hub') || null

        // Tìm tất cả các Arm_*
        const foundArms: Record<string, THREE.Object3D> = {}
        scene.traverse((obj) => {
          if (obj.name.toLowerCase().startsWith('arm_')) {
            foundArms[obj.name.toLowerCase()] = obj
          }
        })

        armsRef.current = foundArms
      } catch (error) {
        console.error(`[${componentId.current}] Error in model setup:`, error)
        errorCount.current++
        lastErrorTime.current = Date.now()
      }
    }, [scene])

    useEffect(() => {
      if (!isInitialized.current || !armsRef.current) return

      Object.entries(armsRef.current).forEach(([armName, armObj]) => {
        const pose = armPose?.[armName]
        if (!pose) return

        for (const axis of ['x', 'y', 'z'] as const) {
          if (pose[axis] !== undefined) {
            try {
              setHinge(armObj, pose[axis]!, axis)
            } catch (err) {
              console.warn(`[${componentId.current}] Failed to apply pose for ${armName}.${axis}:`, err)
            }
          }
        }
      })
    }, [armPose, setHinge])

    useFrame((state) => {
      try {
        frameCount.current++

        if (frameCount.current % 300 === 0) {
          const fps = 1 / state.clock.getDelta()
          if (fps < 30) {
            console.warn(`[${componentId.current}] Low FPS:`, Math.round(fps))
          }
        }

        if (animate && isInitialized.current) {
          const t = state.clock.elapsedTime
          let i = 0
          for (const [name, obj] of Object.entries(armsRef.current)) {
            const angle = Math.sin(t * 2 + i) * (20 + i * 5) * (Math.PI / 180)
            setHinge(obj, angle, 'z')
            i++
          }
        }
      } catch (error) {
        console.error(`[${componentId.current}] Error in frame`, error)
        errorCount.current++
        lastErrorTime.current = Date.now()
      }
    })

    const transformGroup = useMemo(
      () => ({
        position: [transform.position.x, transform.position.y, transform.position.z] as [number, number, number],
        rotation: [transform.rotation.x, transform.rotation.y, transform.rotation.z] as [number, number, number],
        scale: [transform.scale.x, transform.scale.y, transform.scale.z] as [number, number, number]
      }),
      [transform.position, transform.rotation, transform.scale]
    )

    if (!modelUrl) {
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='red' />
        </mesh>
      )
    }

    return (
      <group
        ref={ref}
        position={transformGroup.position}
        rotation={transformGroup.rotation}
        scale={transformGroup.scale}
      >
        <group
          rotation={rotationOffset}
          scale={Array.isArray(modelScale) ? modelScale : [modelScale, modelScale, modelScale]}
        >
          {scene && <primitive object={scene} />}

          {showDebug && hubRef.current && <primitive object={new THREE.AxesHelper(2)} />}
          {showDebug &&
            Object.values(armsRef.current).map((arm, idx) => (
              <mesh key={arm.uuid} position={arm.getWorldPosition(new THREE.Vector3())}>
                <sphereGeometry args={[0.15, 8, 6]} />
                <meshBasicMaterial color={idx % 2 === 0 ? 'red' : 'blue'} />
              </mesh>
            ))}
        </group>
      </group>
    )
  }
)

Connector3D.displayName = 'Connector3D'
useGLTF.preload('/models/connector_1leg.glb')
useGLTF.preload('/models/connector_2legs.glb')
useGLTF.preload('/models/connector_3legs.glb')
useGLTF.preload('/models/connector_5legs.glb')
