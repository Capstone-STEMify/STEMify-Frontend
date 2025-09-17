'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Strawbees2ModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export function Strawbees2Model({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: Strawbees2ModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [armN, setArmN] = useState<THREE.Object3D | null>(null)
  const [armS, setArmS] = useState<THREE.Object3D | null>(null)
  const [armE, setArmE] = useState<THREE.Object3D | null>(null)
  const [armW, setArmW] = useState<THREE.Object3D | null>(null)

  // Animation states
  const [foldAngleN, setFoldAngleN] = useState(0)
  const [foldAngleS, setFoldAngleS] = useState(0)
  const [foldAngleE, setFoldAngleE] = useState(0)
  const [foldAngleW, setFoldAngleW] = useState(0)

  // Load the model using useGLTF and clone it for local manipulation
  const gltf = useGLTF('/models/connector_2legs.glb') as any
  const clonedScene = useMemo(() => {
    const root = gltf?.scene ? gltf.scene.clone(true) : null
    if (root) {
      // Apply initial transform
      root.scale.setScalar(scale)
      root.position.set(...position)
      root.rotation.set(...rotation)
    }
    return root as THREE.Group | null
  }, [gltf, position, rotation, scale])

  // Initialize model and find arm references once scene is ready
  useEffect(() => {
    if (!clonedScene) return
    const armN_obj = clonedScene.getObjectByName('Arm_N')
    const armE_obj = clonedScene.getObjectByName('Arm_E')
    const armS_obj = clonedScene.getObjectByName('Arm_S')
    const armW_obj = clonedScene.getObjectByName('Arm_W')

    if (armN_obj) setArmN(armN_obj)
    if (armS_obj) setArmS(armS_obj)
    if (armE_obj) setArmE(armE_obj)
    if (armW_obj) setArmW(armW_obj)

    setModel(clonedScene)
  }, [clonedScene])

  // Helper function to set hinge rotation with limits
  const setHinge = (
    obj: THREE.Object3D | null,
    deg: number,
    options: {
      min?: number
      max?: number
      axis?: 'x' | 'y' | 'z'
    } = {}
  ) => {
    if (!obj) return

    const { min = -60, max = 60, axis = 'y' } = options
    const clampedDeg = THREE.MathUtils.clamp(deg, min, max)
    const radians = THREE.MathUtils.degToRad(clampedDeg)

    if (axis === 'x') obj.rotation.x = radians
    else if (axis === 'y') obj.rotation.y = radians
    else if (axis === 'z') obj.rotation.z = radians
  }

  // Apply rotations to arms
  useEffect(() => {
    setHinge(armN, foldAngleN, { min: -60, max: 60, axis: 'y' })
    setHinge(armS, foldAngleS, { min: -60, max: 60, axis: 'y' })
    setHinge(armE, foldAngleE, { min: -60, max: 60, axis: 'y' })
    setHinge(armW, foldAngleW, { min: -60, max: 60, axis: 'y' })
  }, [foldAngleN, foldAngleS, foldAngleE, foldAngleW, armN, armS, armE, armW])

  // Animation loop for smooth folding
  useFrame((state) => {
    if (groupRef.current) {
      // Add some subtle rotation to the entire model
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  // Demo folding animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Fold arm N up and down
      setFoldAngleN((prev) => (prev === 30 ? -20 : 30))
      // Fold arm S in opposite direction
      setFoldAngleS((prev) => (prev === -20 ? 30 : -20))
      // Keep E and W at 0 for now
      setFoldAngleE(0)
      setFoldAngleW(0)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!model) {
    return null
  }

  return (
    <group ref={groupRef}>
      <primitive object={model} />

      {/* Add some helper text or indicators */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color='red' />
      </mesh>
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/connector_2legs.glb')
