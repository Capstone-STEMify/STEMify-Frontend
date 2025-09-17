'use client'
import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Strawbees2Direct() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/connector_2legs.glb')
  const [hub, setHub] = useState<THREE.Object3D | null>(null)
  const [arm1, setArm1] = useState<THREE.Object3D | null>(null)
  const [arm2, setArm2] = useState<THREE.Object3D | null>(null)

  // Animation state
  const [currentAngle1, setCurrentAngle1] = useState(0)
  const [currentAngle2, setCurrentAngle2] = useState(0)

  // Setup model exactly as in your reference code
  useEffect(() => {
    const root = scene

    // Find the objects by name as in your reference code
    const hub_obj = root.getObjectByName('Hub')
    const arm1_obj = root.getObjectByName('Arm_1')
    const arm2_obj = root.getObjectByName('Arm_2')

    if (hub_obj) setHub(hub_obj)
    if (arm1_obj) setArm1(arm1_obj)
    if (arm2_obj) setArm2(arm2_obj)

    // Log the scene structure for debugging
    console.log('Strawbees2 model loaded:', root)
    root.traverse((child: THREE.Object3D) => {
      console.log('Child:', child.name, child.type, child.position)
    })
  }, [scene])

  // Hàm xoay có clamp (exactly as in your reference)
  const setHinge = (
    obj: THREE.Object3D | null,
    deg: number,
    axis: 'x' | 'y' | 'z' = 'x',
    min: number = -60,
    max: number = 60
  ) => {
    if (!obj) return

    const r = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(deg, min, max))
    obj.rotation[axis] = r
  }

  // Animation loop
  useFrame((state) => {
    // Animate arm1 - xoay lên xuống theo trục X
    if (arm1) {
      const angle1 = Math.sin(state.clock.elapsedTime * 2) * 30 // -30 to +30 degrees
      setHinge(arm1, angle1, 'z') // Thay đổi từ 'y' sang 'x'
      setCurrentAngle1(angle1)
    }

    // Animate arm2 - xoay lên xuống theo trục X, ngược pha
    if (arm2) {
      const angle2 = Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 20 // -20 to +20 degrees, opposite phase
      setHinge(arm2, angle2, 'z') // Thay đổi từ 'y' sang 'x'
      setCurrentAngle2(angle2)
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />

      {/* Add axes helpers to see pivot points (as in your reference code) */}
      {hub && <primitive object={new THREE.AxesHelper(2)} />}
      {arm1 && <primitive object={new THREE.AxesHelper(2)} />}
      {arm2 && <primitive object={new THREE.AxesHelper(2)} />}

      {/* Visual indicators for the arms */}
      {arm1 && (
        <mesh position={arm1.getWorldPosition(new THREE.Vector3())}>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshBasicMaterial color='red' />
        </mesh>
      )}
      {arm2 && (
        <mesh position={arm2.getWorldPosition(new THREE.Vector3())}>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshBasicMaterial color='blue' />
        </mesh>
      )}

      {/* Status display */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color='green' />
      </mesh>
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/connector_2legs.glb')
