import { SceneObject } from '@/features/creator-3d/types/creator.types'
import { useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SceneObjectComponent } from '@/features/creator-3d/components/creator-workspace/SceneObjectComponent'
import { AxesHelper as ThreeAxesHelper } from 'three'
import { OrbitControls, Grid, TransformControls } from '@react-three/drei'
import { useAppSelector } from '@/hooks/redux-hooks'

interface SceneContentProps {
  objects: SceneObject[]
  selectedObjectId: string | null
  transformMode: 'translate' | 'rotate' | 'scale'
  showGrid: boolean
  showAxes: boolean
  snapToGrid: boolean
  gridSize: number
  transformControlsRef: React.RefObject<any>
  orbitControlsRef: React.RefObject<any>
  onObjectSelect: (objectId: string | null) => void
  onObjectUpdate: (objectId: string, updates: Partial<SceneObject>) => void
}

export function SceneContent({
  objects,
  selectedObjectId,
  transformMode,
  showGrid,
  showAxes,
  snapToGrid,
  gridSize,
  transformControlsRef,
  orbitControlsRef,
  onObjectSelect,
  onObjectUpdate
}: SceneContentProps) {
  const { scene } = useThree()
  const objectRefs = useRef<Record<string, THREE.Object3D>>({})
  const cameraStatus = useAppSelector((state) => state.strawLab.cameraStatus)

  // Update transform controls target when selection changes
  useEffect(() => {
    if (transformControlsRef.current && selectedObjectId) {
      const targetObject = objectRefs.current[selectedObjectId]
      if (targetObject) {
        transformControlsRef.current.attach(targetObject)
      }
    } else if (transformControlsRef.current) {
      transformControlsRef.current.detach()
    }
  }, [selectedObjectId])

  // Handle object click selection
  const handleObjectClick = useCallback(
    (objectId: string) => {
      onObjectSelect(objectId)
    },
    [onObjectSelect]
  )

  // Handle transform changes
  const handleTransformChange = useCallback(() => {
    if (!selectedObjectId || !transformControlsRef.current) return

    const targetObject = objectRefs.current[selectedObjectId]
    if (!targetObject) return

    const position = {
      x: targetObject.position.x,
      y: targetObject.position.y,
      z: targetObject.position.z
    }

    const rotation = {
      x: targetObject.rotation.x,
      y: targetObject.rotation.y,
      z: targetObject.rotation.z
    }

    // Apply grid snapping if enabled
    if (snapToGrid) {
      position.x = Math.round(position.x / gridSize) * gridSize
      position.y = Math.round(position.y / gridSize) * gridSize
      position.z = Math.round(position.z / gridSize) * gridSize

      targetObject.position.set(position.x, position.y, position.z)
    }

    onObjectUpdate(selectedObjectId, { position, rotation })
  }, [selectedObjectId, snapToGrid, gridSize, onObjectUpdate])

  return (
    <>
      {/* Environment */}
      <color attach='background' args={['#f5f5f5']} />
      <ambientLight color='#404040' intensity={0.5} />
      <directionalLight
        color='#FFFFFF'
        intensity={1.2}
        position={[10, 15, 8]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Controls */}
      <OrbitControls
        ref={orbitControlsRef}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.05}
        enabled={cameraStatus}
      />

      <TransformControls
        ref={transformControlsRef}
        mode={transformMode}
        onObjectChange={handleTransformChange}
        showX={true}
        showY={true}
        showZ={true}
      />

      {/* Grid */}
      {showGrid && (
        <Grid
          args={[100, 100, 10]}
          position={[0, 0, 0]}
          cellSize={gridSize}
          sectionSize={gridSize * 10}
          cellColor='#888888'
          sectionColor='#444444'
        />
      )}

      {/* Axes */}
      {showAxes && <primitive object={new ThreeAxesHelper(10)} />}

      {/* Scene Objects */}
      {objects.map((obj) => (
        <SceneObjectComponent
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedObjectId}
          onSelect={() => handleObjectClick(obj.id)}
          onRef={(ref) => {
            if (ref) {
              objectRefs.current[obj.id] = ref
            } else {
              delete objectRefs.current[obj.id]
            }
          }}
        />
      ))}
    </>
  )
}
