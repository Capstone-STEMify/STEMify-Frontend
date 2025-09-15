import { SceneObject } from '@/features/creator-3d/types/creator.types'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Straw } from '@/features/assembly/components/Straw'
import { Connector3D } from '@/features/assembly/components/Connector'

interface SceneObjectComponentProps {
  object: SceneObject
  isSelected: boolean
  onSelect: () => void
  onRef: (ref: THREE.Object3D | null) => void
}

export function SceneObjectComponent({ object, isSelected, onSelect, onRef }: SceneObjectComponentProps) {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    onRef(groupRef.current)
    return () => onRef(null)
  }, [onRef])

  // Update position and rotation when object changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(object.position.x, object.position.y, object.position.z)
      groupRef.current.rotation.set(object.rotation.x, object.rotation.y, object.rotation.z)
      groupRef.current.scale.set(object.scale.x, object.scale.y, object.scale.z)
    }
  }, [object.position, object.rotation, object.scale])

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation()
      onSelect()
    },
    [onSelect]
  )

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[12, 12, 12]} />
          <meshBasicMaterial color='#00ff00' wireframe transparent opacity={0.3} />
        </mesh>
      )}

      {/* Render actual component */}
      {object.type === 'straw_green' ? (
        <Straw
          straw={{
            id: object.id,
            name: object.name,
            geometry: { diameter: 1.6, length: 11.2, wallThickness: 0.1 },
            material: { color: '#22c55e', opacity: 1, flexibility: 0.1, metalness: 0, roughness: 1, type: 'plastic' },
            transform: {
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 }
            },
            endpoints: {
              start: {
                id: `${object.id}_start`,
                localPosition: { x: -5.6, y: 0, z: 0 },
                connectionId: null,
                isAvailable: true
              },
              end: {
                id: `${object.id}_end`,
                localPosition: { x: 5.6, y: 0, z: 0 },
                connectionId: null,
                isAvailable: true
              }
            },
            physics: { mass: 0.3, friction: 0.4, elasticity: 0.2 }
          }}
          fade={undefined}
        />
      ) : (
        <Connector3D
          modelUrl='/models/connector_3legs.glb'
          armPose={undefined}
          connector={{
            id: object.id,
            name: object.name,
            type: 'cross',
            geometry: { portDiameter: 1.6, shape: 'cylindrical', size: { x: 4, y: 4, z: 4 } },
            material: {
              color: '#dc2626',
              type: 'plastic',
              flexibility: 0,
              opacity: 1,
              roughness: 1,
              metalness: 0
            },
            transform: {
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 }
            },
            ports: [
              {
                id: `${object.id}_port_0`,
                localPosition: { x: 0, y: 0, z: 2 },
                orientation: { x: 0, y: 0, z: 1 },
                connectionId: null,
                isAvailable: true,
                portIndex: 0
              },
              {
                id: `${object.id}_port_1`,
                localPosition: { x: 1.73, y: 0, z: -1 },
                orientation: { x: 0.866, y: 0, z: -0.5 },
                connectionId: null,
                isAvailable: true,
                portIndex: 1
              },
              {
                id: `${object.id}_port_2`,
                localPosition: { x: -1.73, y: 0, z: -1 },
                orientation: { x: -0.866, y: 0, z: -0.5 },
                connectionId: null,
                isAvailable: true,
                portIndex: 2
              }
            ],
            constraints: { maxConnections: 3, allowedAngles: [] }
          }}
          animate={false}
          showDebug={false}
        />
      )}
    </group>
  )
}
