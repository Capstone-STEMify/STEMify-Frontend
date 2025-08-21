import { forwardRef, useMemo } from 'react'
import { Euler, Group, Quaternion, Vector3 } from 'three'
import { Straw as StrawType } from '../types/assembly.type'
import { a, type SpringValue } from '@react-spring/three'

interface StrawProps {
  straw: StrawType
  fade?: SpringValue<number>
}
export const Straw = forwardRef<Group, StrawProps>(function Straw({ straw, fade }, ref) {
  const { geometry, color, transform, endpoints } = straw

  const { pos, rot, len } = useMemo(() => {
    if (!endpoints || endpoints.length < 2) {
      return {
        pos: new Vector3(transform.position[0], transform.position[1], transform.position[2]),
        rot: new Euler(transform.rotation[0], transform.rotation[1], transform.rotation[2], 'XYZ'),
        len: geometry.length
      }
    }

    const A_local = new Vector3(
      endpoints[0].localPosition[0],
      endpoints[0].localPosition[1],
      endpoints[0].localPosition[2]
    )
    const B_local = new Vector3(
      endpoints[1].localPosition[0],
      endpoints[1].localPosition[1],
      endpoints[1].localPosition[2]
    )

    // local → world: scale → rotate → translate
    const scl = new Vector3(transform.scale[0], transform.scale[1], transform.scale[2])
    const rotEuler = new Euler(transform.rotation[0], transform.rotation[1], transform.rotation[2], 'XYZ')
    const trn = new Vector3(transform.position[0], transform.position[1], transform.position[2])

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
        <meshPhysicalMaterial color={color} roughness={0.3} emissive={color} emissiveIntensity={0.2} clearcoat={1} />
      </mesh>
    </group>
  )
})
