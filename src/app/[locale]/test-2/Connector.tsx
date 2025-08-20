import { forwardRef, useMemo } from 'react'
import { Group, Vector3, Quaternion, Euler } from 'three'
import { a } from '@react-spring/three'
import { Connector } from './type'

interface Props {
  connector: Connector
  fade?: any
}

export const Connector3D = forwardRef<Group, Props>(({ connector, fade }, ref) => {
  const { diameter, material, transform, ports } = connector

  const portMeshes = useMemo(() => {
    return ports.map((port) => {
      const localPos = new Vector3(...port.localPosition)
      const localDir = new Vector3(...port.direction).normalize()

      const portLength = 1.5
      const end = localPos.clone().add(localDir.clone().multiplyScalar(portLength))
      const mid = localPos.clone().add(end).multiplyScalar(0.5)

      const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), localDir)
      const rotEuler = new Euler().setFromQuaternion(quaternion)

      return {
        id: port.id,
        pos: mid,
        rot: rotEuler,
        len: portLength
      }
    })
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

      {/* render các port dưới dạng cylinder */}
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

Connector3D.displayName = 'Connector3D'
