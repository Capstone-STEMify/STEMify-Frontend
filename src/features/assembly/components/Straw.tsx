import { forwardRef, useMemo } from 'react'
import { Euler, Group, Quaternion, Vector3 } from 'three'
import { Straw as StrawType } from '../types/assembly.types'
import { a, type SpringValue } from '@react-spring/three'

interface StrawProps {
  straw: StrawType
  fade?: SpringValue<number>
}

export const Straw = forwardRef<Group, StrawProps>(function Straw({ straw, fade }, ref) {
  const { geometry, material, transform, endpoints } = straw

  const { pos, rot, len } = useMemo(() => {
    const start = endpoints?.start?.localPosition || { x: -geometry.length / 2, y: 0, z: 0 }
    const end = endpoints?.end?.localPosition || { x: geometry.length / 2, y: 0, z: 0 }

    const A_local = new Vector3(start.x, start.y, start.z)
    const B_local = new Vector3(end.x, end.y, end.z)

    // local → world: scale → rotate → translate
    const scl = new Vector3(transform.scale?.x ?? 1, transform.scale?.y ?? 1, transform.scale?.z ?? 1)
    const rotEuler = new Euler(transform.rotation.x, transform.rotation.y, transform.rotation.z, 'XYZ')
    const trn = new Vector3(transform.position.x, transform.position.y, transform.position.z)

    const A = A_local.clone().multiply(scl).applyEuler(rotEuler).add(trn)
    const B = B_local.clone().multiply(scl).applyEuler(rotEuler).add(trn)

    const mid = A.clone().add(B).multiplyScalar(0.5)
    const lengthWorld = A.distanceTo(B)
    const dir = B.clone().sub(A).normalize()

    const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir)
    const eul = new Euler().setFromQuaternion(quat, 'XYZ')

    return { pos: mid, rot: eul, len: lengthWorld }
  }, [
    geometry.length,
    endpoints?.start?.localPosition,
    endpoints?.end?.localPosition,
    transform.position,
    transform.rotation,
    transform.scale
  ])

  const color = material?.properties?.color || '#cccccc'
  const opacity = material?.properties?.opacity ?? 1
  const roughness = material?.properties?.roughness ?? 0.5
  const metalness = material?.properties?.metalness ?? 0
  const transmission = material?.properties?.transmission ?? 0
  const ior = material?.properties?.ior ?? 1.4
  const thickness = material?.properties?.thickness ?? 0.05

  return (
    <group ref={ref} position={[pos.x, pos.y, pos.z]} rotation={[rot.x, rot.y, rot.z]} scale={[1, 1, 1]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[geometry.diameter / 2, geometry.diameter / 2, len, 64]} />
        <meshPhysicalMaterial
          key={straw.id}
          color={color}
          opacity={opacity}
          roughness={roughness}
          metalness={metalness}
          transmission={transmission}
          ior={ior}
          thickness={thickness}
          transparent={opacity < 1 || transmission > 0}
          emissive={color}
          emissiveIntensity={0.3}
          clearcoat={1}
        />
      </mesh>
    </group>
  )
})
