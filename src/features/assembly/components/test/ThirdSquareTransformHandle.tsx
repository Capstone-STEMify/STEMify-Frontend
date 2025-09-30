import { useAppSelector } from '@/hooks/redux-hooks'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
export function ThirdSquareTransformHandle({
  componentCenter,
  currentTranslation,
  currentRotation,
  transformMode,
  transformControlsRef
}: {
  componentCenter: { x: number; y: number; z: number }
  currentTranslation: { x: number; y: number; z: number }
  currentRotation: { x: number; y: number; z: number }
  transformMode: 'translate' | 'rotate'
  transformControlsRef: React.RefObject<any>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const isShiftPressed = useAppSelector((state) => state.assembly.isShiftPressed)

  // Calculate target position
  const targetPos = useMemo(
    () =>
      new THREE.Vector3(
        componentCenter.x + currentTranslation.x,
        componentCenter.y + currentTranslation.y,
        componentCenter.z + currentTranslation.z
      ),
    [componentCenter, currentTranslation]
  )

  // Calculate target rotation
  const targetRot = useMemo(
    () => new THREE.Euler(currentRotation.x, currentRotation.y, currentRotation.z, 'XYZ'),
    [currentRotation]
  )

  // Update mesh position and rotation every frame when not being transformed
  useFrame(() => {
    if (meshRef.current) {
      // Only update when not actively being transformed
      const isBeingTransformed = transformControlsRef.current?.dragging
      if (!isBeingTransformed) {
        meshRef.current.position.copy(targetPos)
        meshRef.current.rotation.copy(targetRot)
      }
    }
  })

  // Attach transform controls when available
  useEffect(() => {
    if (transformControlsRef.current && meshRef.current) {
      console.log('🔗 Attaching TransformControls to ThirdSquareHandle mesh')
      transformControlsRef.current.attach(meshRef.current)
    }
  }, [transformControlsRef])

  // Different visual based on transform mode
  const handleColor = isShiftPressed ? (transformMode === 'translate' ? '#22c55e' : '#a855f7') : '#9ca3af'

  const handleOpacity = isShiftPressed ? 0.8 : 0.4

  return (
    <mesh
      ref={meshRef}
      position={[targetPos.x, targetPos.y, targetPos.z]}
      rotation={[targetRot.x, targetRot.y, targetRot.z]}
    >
      {transformMode === 'translate' ? <sphereGeometry args={[0.6, 16, 16]} /> : <boxGeometry args={[1.2, 1.2, 1.2]} />}
      <meshStandardMaterial color={handleColor} opacity={handleOpacity} transparent />
    </mesh>
  )
}
