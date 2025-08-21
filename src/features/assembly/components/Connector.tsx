import { forwardRef, useMemo } from 'react'
import { Group, Vector3, Quaternion, Euler } from 'three'
import { Connector } from '../types/assembly.type'

interface Props {
  connector: Connector
  fade?: any
}

export const Connector3D = forwardRef<Group, Props>(({ connector, fade }, ref) => {
  const { diameter, color, transform, ports } = connector

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
      position={[transform.position[0], transform.position[1], transform.position[2]]}
      rotation={[transform.rotation[0], transform.rotation[1], transform.rotation[2]]}
      scale={[transform.scale[0], transform.scale[1], transform.scale[2]]}
    >
      {/* connector hình cầu */}
      <mesh>
        <sphereGeometry args={[diameter / 2, 32, 32]} />
        <meshPhysicalMaterial color={color} clearcoat={1} />
      </mesh>

      {/* render các port dưới dạng cylinder */}
      {portMeshes.map(
        (p) =>
          p && (
            <group key={p.id} position={p.pos.toArray()} rotation={p.rot.toArray()}>
              <mesh>
                <cylinderGeometry args={[diameter / 6, diameter / 6, p.len, 32]} />
                <meshPhysicalMaterial color={color} />
              </mesh>
            </group>
          )
      )}
    </group>
  )
})

Connector3D.displayName = 'Connector3D'
