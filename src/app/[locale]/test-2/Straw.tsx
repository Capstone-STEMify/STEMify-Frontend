import { forwardRef, useMemo } from 'react'
import { Euler, Group, Quaternion, Vector3 } from 'three'
import { Straw as StrawType } from './type'
import { a, type SpringValue } from '@react-spring/three'

interface StrawProps {
  straw: StrawType
  fade?: SpringValue<number>
}
export const Straw = forwardRef<Group, StrawProps>(function Straw({ straw, fade }, ref) {
  const { geometry, material, transform, endpoints } = straw

  const { pos, rot, len } = useMemo(() => {
    if (!endpoints || endpoints.length < 2) {
      return {
        pos: new Vector3(transform.position.x, transform.position.y, transform.position.z),
        rot: new Euler(transform.rotation.x, transform.rotation.y, transform.rotation.z, 'XYZ'),
        len: geometry.length
      }
    }

    const A_local = new Vector3(
      endpoints[0].localPosition.x,
      endpoints[0].localPosition.y,
      endpoints[0].localPosition.z
    )
    const B_local = new Vector3(
      endpoints[1].localPosition.x,
      endpoints[1].localPosition.y,
      endpoints[1].localPosition.z
    )

    // local → world: scale → rotate → translate
    const scl = new Vector3(transform.scale.x, transform.scale.y, transform.scale.z)
    const rotEuler = new Euler(transform.rotation.x, transform.rotation.y, transform.rotation.z, 'XYZ')
    const trn = new Vector3(transform.position.x, transform.position.y, transform.position.z)

    const A = A_local.clone().multiply(scl).applyEuler(rotEuler).add(trn)
    const B = B_local.clone().multiply(scl).applyEuler(rotEuler).add(trn)

    const mid = A.clone().add(B).multiplyScalar(0.5)
    const len = A.distanceTo(B)
    const dir = B.clone().sub(A).normalize()

    const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir)
    const eul = new Euler().setFromQuaternion(quat, 'XYZ')

    return { pos: mid, rot: eul, len }
  }, [geometry.length, endpoints, transform])

  return (
    <group ref={ref} position={[pos.x, pos.y, pos.z]} rotation={[rot.x, rot.y, rot.z]} scale={[1, 1, 1]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[geometry.diameter / 2, geometry.diameter / 2, len, 64]} />
        <meshPhysicalMaterial
          color={material.color}
          transparent={material.opacity < 1}
          opacity={material.opacity}
          roughness={material.roughness}
          metalness={material.metalness}
          emissive={material.color}
          emissiveIntensity={0.2}
          clearcoat={1}
        />
      </mesh>
    </group>
  )
})
