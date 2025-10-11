import { useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SceneObjectComponent } from '@/features/creator-3d/components/creator-workspace/SceneObjectComponent'
import { AxesHelper as ThreeAxesHelper } from 'three'
import { OrbitControls, Grid, TransformControls } from '@react-three/drei'
import { useAppSelector } from '@/hooks/redux-hooks'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import debounce from 'lodash/debounce'

interface SceneContentProps {
  transformControlsRef: React.RefObject<any>
  orbitControlsRef: React.RefObject<any>
  onObjectSelect: (objectId: string | null) => void
  onObjectUpdate: (objectId: string, updates: Partial<AssemblyInstance>) => void
  onDropObject: (position: { x: number; y: number; z: number }) => void
}

export function SceneContent({
  transformControlsRef,
  orbitControlsRef,
  onObjectSelect,
  onObjectUpdate,
  onDropObject
}: SceneContentProps) {
  const objectRefs = useRef<Record<string, THREE.Object3D>>({})
  const cameraStatus = useAppSelector((state) => state.strawLab.cameraStatus)
  const selectedObjectId = useAppSelector((state) => state.creatorScene.selectedId)
  const snapToGrid = useAppSelector((state) => state.creatorScene.snapToGrid)
  const gridSize = useAppSelector((state) => state.creatorScene.gridSize)
  const showGrid = useAppSelector((state) => state.creatorScene.showGrid)
  const showAxes = useAppSelector((state) => state.creatorScene.showAxes)
  const transformMode = useAppSelector((state) => state.creatorScene.transformMode)
  const objects = useAppSelector((state) => state.creatorScene.instances)
  const { camera, gl } = useThree()
  const handleDrop = useCallback(
    (e: DragEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(ndc, camera)

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const point = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, point)

      if (point) {
        onDropObject({ x: point.x, y: point.y, z: point.z })
      }
    },
    [camera, gl, onDropObject]
  )

  useEffect(() => {
    const transform = transformControlsRef.current
    const targetObject = selectedObjectId ? objectRefs.current[selectedObjectId] : null

    if (!targetObject || !targetObject.parent) {
      transform?.detach()
      return
    }

    transform.attach(targetObject)
  }, [selectedObjectId, objects])

  // Handle object click selection
  const handleObjectClick = useCallback(
    (objectId: string) => {
      onObjectSelect(objectId)
    },
    [onObjectSelect]
  )
  const debouncedUpdate = useRef(
    debounce((id, updates) => {
      onObjectUpdate(id, updates)
    }, 100)
  ).current

  // Handle transform changes
  const handleTransformChange = useCallback(() => {
    if (!selectedObjectId || !transformControlsRef.current) return
    const targetObject = objectRefs.current[selectedObjectId]
    if (!targetObject || !targetObject.parent) return

    const newPos = {
      x: targetObject.position.x,
      y: targetObject.position.y,
      z: targetObject.position.z
    }
    const newRot = {
      x: targetObject.rotation.x,
      y: targetObject.rotation.y,
      z: targetObject.rotation.z
    }

    // Lấy object cũ từ store (instances)
    const current = objects.find((o) => o.id === selectedObjectId)
    if (!current) return

    // Chỉ dispatch khi khác
    if (
      current.transform.position.x !== newPos.x ||
      current.transform.position.y !== newPos.y ||
      current.transform.position.z !== newPos.z ||
      current.transform.rotation.x !== newRot.x ||
      current.transform.rotation.y !== newRot.y ||
      current.transform.rotation.z !== newRot.z
    ) {
      debouncedUpdate(selectedObjectId, {
        transform: {
          position: {
            x: targetObject.position.x,
            y: targetObject.position.y,
            z: targetObject.position.z
          },
          rotation: {
            x: targetObject.rotation.x,
            y: targetObject.rotation.y,
            z: targetObject.rotation.z
          },
          scale: {
            x: targetObject.scale.x,
            y: targetObject.scale.y,
            z: targetObject.scale.z
          }
        }
      })
    }
  }, [selectedObjectId, objects, onObjectUpdate])

  useEffect(() => {
    const dom = gl.domElement
    dom.addEventListener('drop', handleDrop)
    dom.addEventListener('dragover', (e) => e.preventDefault())

    return () => {
      dom.removeEventListener('drop', handleDrop)
    }
  }, [handleDrop, gl])

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
        onMouseUp={handleTransformChange}
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
      {objects.map((inst) => (
        <SceneObjectComponent
          key={inst.id}
          object={inst}
          isSelected={inst.id === selectedObjectId}
          onSelect={() => handleObjectClick(inst.id)}
          onRef={(ref) => {
            if (ref) {
              objectRefs.current[inst.id] = ref
            } else {
              delete objectRefs.current[inst.id]
            }
          }}
        />
      ))}
    </>
  )
}
