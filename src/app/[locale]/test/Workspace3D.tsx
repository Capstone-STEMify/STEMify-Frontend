import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls, Html } from '@react-three/drei'
import { useRef, useState, useEffect, useCallback, Suspense, useMemo } from 'react'
import { ConnectorModel } from './ConnectorModel'
import * as THREE from 'three'
import { type Straw } from 'app/[locale]/test/component.type'
import data from './data.json'

function Straw(straw: Straw) {
  const { geometry, material, transform } = straw

  return (
    <group
      position={[transform.position.x, transform.position.y, transform.position.z]}
      rotation={[transform.rotation.x, transform.rotation.y, transform.rotation.z]}
      scale={[transform.scale.x, transform.scale.y, transform.scale.z]}
    >
      <mesh position={[0, geometry.length / 2, 0]}>
        <cylinderGeometry args={[geometry.diameter / 2, geometry.diameter / 2, geometry.length, 64]} />
        <meshPhysicalMaterial
          color={material.color}
          transparent={material.opacity < 1}
          opacity={material.opacity}
          roughness={material.roughness}
          metalness={material.metalness}
          clearcoat={1}
        />
      </mesh>
    </group>
  )
}

// type ComponentType = {
//   type: 'straw' | 'connector'
//   length?: number
//   color?: string
// }

export default function Workspace3D() {
  const { straws, connectors, actions, activities, joints, scene } = data
  const [cameraLocked, setCameraLocked] = useState(false)
  const groupRefs = useRef<(THREE.Group | null)[]>([])
  const orbitRef = useRef<any>(null)
  const transformRef = useRef<any>(null)
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null)

  // useEffect(() => {
  //   while (groupRefs.current.length < components.length) {
  //     groupRefs.current.push(null)
  //   }
  // }, [components.length])

  // Khi gán TransformControls, tạm tắt OrbitControls
  useEffect(() => {
    const controls = transformRef.current
    if (!controls || !orbitRef.current) return

    const handleDraggingChange = (event: any) => {
      const isDragging = event.value
      orbitRef.current.enabled = !isDragging

      // Nếu thả chuột và có selectedObject → thực hiện SNAP
      if (!isDragging && selectedObject && selectedObject.parent) {
        const movingPos = new THREE.Vector3()
        selectedObject.getWorldPosition(movingPos)

        for (let i = 0; i < groupRefs.current.length; i++) {
          const target = groupRefs.current[i]
          if (!target || target === selectedObject) continue

          const targetPos = new THREE.Vector3()
          target.getWorldPosition(targetPos)

          const distance = movingPos.distanceTo(targetPos)
          console.log('📏 Distance to target:', distance)

          if (distance < 0.8) {
            const snapped = selectedObject.parent.worldToLocal(targetPos.clone())
            selectedObject.position.copy(snapped)
            console.log('✅ Snapped!')
            break
          }
        }
      }
    }

    controls.addEventListener('dragging-changed', handleDraggingChange)

    return () => {
      controls.removeEventListener('dragging-changed', handleDraggingChange)
    }
  }, [selectedObject])

  // Hàm click chọn component
  const handleSelect = useCallback((index: number) => {
    const obj = groupRefs.current[index]
    if (obj) {
      setSelectedObject(obj)
    }
  }, [])

  return (
    <div className='relative h-full w-full'>
      {/* Nút toggle lock camera */}
      <button
        onClick={() => setCameraLocked(!cameraLocked)}
        className='absolute top-4 right-4 z-10 rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-600'
      >
        {cameraLocked ? '🔒 Camera Locked' : '🔓 Camera Unlocked'}
      </button>

      {/* Canvas 3D */}
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[5, 10, 5]} />
        <OrbitControls ref={orbitRef} enabled={!cameraLocked} />
        <Grid
        // cellSize={0.5}
        // sectionSize={10}
        // sectionColor='rgba(100, 100, 100, 0.4)'
        // cellColor='rgba(180, 180, 180, 0.2)'
        // fadeDistance={40}
        // fadeStrength={1}
        // infiniteGrid
        />

        {/* {components.map((comp, index) => {
          const initialPosition: [number, number, number] = [index * 1.5, 0.5, 0]
          return (
            <group
              key={index}
              ref={(ref) => (groupRefs.current[index] = ref)}
              position={initialPosition}
              onClick={() => handleSelect(index)}
            >
              {<Straw {...comp} />}

              {<ConnectorModel connector={comp} />}
            </group>
          )
        })} */}

        {straws.map((straw, index) => (
          <Straw key={index} {...straw} />
        ))}

        {connectors.map((connector, index) => (
          <ConnectorModel key={index} connector={connector} />
        ))}

        {selectedObject && <TransformControls ref={transformRef} object={selectedObject} mode='translate' />}
      </Canvas>
    </div>
  )
}
