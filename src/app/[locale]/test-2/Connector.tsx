import { forwardRef, useMemo } from 'react'
import { Group, Vector3, Euler, Quaternion } from 'three'
import { CylinderGeometry, SphereGeometry } from 'three'
import { useSpringValue, a } from '@react-spring/three'
import { Connector } from './type'

interface Props {
  connector: Connector
  fade?: any
}

export const Connector3D = forwardRef<Group, Props>(({ connector, fade }, ref) => {
  const { diameter, material, transform, ports } = connector

  // Tính thông tin cho mỗi port giống như Straw
  const portMeshes = useMemo(() => {
    return ports
      .map((port) => {
        if (!port.endpoints || port.endpoints.length < 2) return null

        const A_local = new Vector3(
          port.endpoints[0].localPosition.x,
          port.endpoints[0].localPosition.y,
          port.endpoints[0].localPosition.z
        )
        const B_local = new Vector3(
          port.endpoints[1].localPosition.x,
          port.endpoints[1].localPosition.y,
          port.endpoints[1].localPosition.z
        )

        const scl = new Vector3(port.transform.scale.x, port.transform.scale.y, port.transform.scale.z)
        const rotEuler = new Euler(
          port.transform.rotation.x,
          port.transform.rotation.y,
          port.transform.rotation.z,
          'XYZ'
        )
        const trn = new Vector3(port.transform.position.x, port.transform.position.y, port.transform.position.z)

        const A = A_local.clone().multiply(scl).applyEuler(rotEuler).add(trn)
        const B = B_local.clone().multiply(scl).applyEuler(rotEuler).add(trn)

        const mid = A.clone().add(B).multiplyScalar(0.5)
        const len = A.distanceTo(B)
        const dir = B.clone().sub(A).normalize()

        const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir)
        const eul = new Euler().setFromQuaternion(quat, 'XYZ')

        return { id: port.id, pos: mid, rot: eul, len }
      })
      .filter(Boolean)
  }, [ports])

  return (
    <group
      ref={ref}
      position={[transform.position.x, transform.position.y, transform.position.z]}
      rotation={[transform.rotation.x, transform.rotation.y, transform.rotation.z]}
      scale={[transform.scale.x, transform.scale.y, transform.scale.z]}
    >
      {/* connector hình cầu */}
      <mesh>
        <sphereGeometry args={[diameter / 2, 32, 32]} />
        <meshPhysicalMaterial
          color={material.color}
          transparent={material.opacity < 1}
          opacity={material.opacity}
          roughness={material.roughness}
          metalness={material.metalness}
          clearcoat={1}
        />
      </mesh>

      {/* render các port giống straw (dưới dạng cylinder) */}
      {portMeshes.map(
        (p) =>
          p && (
            <group key={p.id} position={p.pos.toArray()} rotation={p.rot.toArray()}>
              <mesh>
                <cylinderGeometry args={[diameter / 6, diameter / 6, p.len, 32]} />
                <meshPhysicalMaterial color={material.color} />
              </mesh>
            </group>
          )
      )}
    </group>
  )
})
