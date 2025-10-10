import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Straw } from '@/features/assembly/components/Straw'
import { Connector3D } from '@/features/assembly/components/Connector'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { Material } from '@/features/assembly/types/assembly.types'

interface SceneObjectComponentProps {
  object: AssemblyInstance
  isSelected: boolean
  onSelect: () => void
  onRef: (ref: THREE.Object3D | null) => void
}

export function SceneObjectComponent({ object, isSelected, onSelect, onRef }: SceneObjectComponentProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [boxSize, setBoxSize] = useState<[number, number, number]>([1, 1, 1])

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const size = new THREE.Vector3()
      box.getSize(size)
      setBoxSize([size.x, size.y, size.z])
    }
  }, [object])

  useEffect(() => {
    onRef(groupRef.current)
    return () => onRef(null)
  }, [onRef])

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation()
      onSelect()
    },
    [onSelect]
  )

  function normalizeMaterial(raw: any): Material {
    return {
      id: raw?.id,
      name: raw?.name,
      version: raw?.version,
      type: raw?.type || 'plastic',
      properties: {
        color: raw?.properties?.color || raw?.color || '#cccccc',
        flexibility: raw?.properties?.flexibility ?? raw?.flexibility ?? 0,
        opacity: raw?.properties?.opacity ?? raw?.opacity ?? 1,
        roughness: raw?.properties?.roughness ?? raw?.roughness ?? 0.5,
        metalness: raw?.properties?.metalness ?? raw?.metalness ?? 0,
        transmission: raw?.properties?.transmission ?? raw?.transmission ?? 0,
        ior: raw?.properties?.ior ?? raw?.ior ?? 1.4,
        thickness: raw?.properties?.thickness ?? raw?.thickness ?? 0.05
      },
      physics: raw?.physics,
      lod: raw?.lod,
      streaming: raw?.streaming
    }
  }

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      position={[object.transform.position.x, object.transform.position.y, object.transform.position.z]}
      rotation={[object.transform.rotation.x, object.transform.rotation.y, object.transform.rotation.z]}
      scale={[object.transform.scale?.x ?? 1, object.transform.scale?.y ?? 1, object.transform.scale?.z ?? 1]}
    >
      {/* Render actual component */}
      {object.category === 'straw' ? (
        <Straw
          straw={{
            id: object.id,
            name: object.data.name || object.templateId,
            geometry: object.data.baseGeometry || object.data.geometry,
            material: normalizeMaterial(object.data.material),
            transform: {
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 }
            },
            endpoints: {
              start: {
                id: `${object.id}_start`,
                localPosition: { x: object.data.endpoints.start.localPosition.x, y: 0, z: 0 },
                connectionId: null,
                isAvailable: true
              },
              end: {
                id: `${object.id}_end`,
                localPosition: { x: object.data.endpoints.end.localPosition.x, y: 0, z: 0 },
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
          armPose={object.arms}
          connector={{
            id: object.id,
            name: object.data.name || object.templateId,
            type: 'cross',
            geometry: { portDiameter: 1.6, shape: 'cylindrical', size: { x: 4, y: 4, z: 4 } },
            material: {
              type: 'plastic',
              properties: { color: '#dc2626', flexibility: 0, opacity: 1, roughness: 1, metalness: 0 }
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
          modelUrl={object.data?.modelUrl}
        />
      )}
    </group>
  )
}
