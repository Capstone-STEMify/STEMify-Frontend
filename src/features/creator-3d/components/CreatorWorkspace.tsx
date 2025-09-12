'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls } from '@react-three/drei'
import { AxesHelper as ThreeAxesHelper } from 'three'
import { Straw } from '@/features/assembly/components/Straw'
import { Connector3D } from '@/features/assembly/components/Connector'
import { useRef, useCallback, useState, useEffect } from 'react'
import * as THREE from 'three'
import { SceneObject, ComponentTemplate } from '../types/creator.types'

interface CreatorWorkspaceProps {
  objects: SceneObject[]
  selectedObjectId: string | null
  transformMode: 'translate' | 'rotate' | 'scale'
  showGrid: boolean
  showAxes: boolean
  snapToGrid: boolean
  gridSize: number
  dragSource: ComponentTemplate | null
  onObjectSelect: (objectId: string | null) => void
  onObjectUpdate: (objectId: string, updates: Partial<SceneObject>) => void
  onObjectAdd: (type: ComponentTemplate['type'], position: { x: number; y: number; z: number }) => void
  onDragEnd: () => void
  onTransformModeChange: (mode: 'translate' | 'rotate' | 'scale') => void
  onToggleGrid: () => void
  onToggleAxes: () => void
  onToggleSnap: () => void
}

export function CreatorWorkspace({
  objects,
  selectedObjectId,
  transformMode,
  showGrid,
  showAxes,
  snapToGrid,
  gridSize,
  dragSource,
  onObjectSelect,
  onObjectUpdate,
  onObjectAdd,
  onDragEnd,
  onTransformModeChange,
  onToggleGrid,
  onToggleAxes,
  onToggleSnap
}: CreatorWorkspaceProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const transformControlsRef = useRef<any>(null)
  const orbitControlsRef = useRef<any>(null)

  // Handle drop from palette
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (!dragSource) return

    // Calculate drop position (for now, place at origin)
    // In a more advanced version, we could raycast to get the exact 3D position
    const position = { x: 0, y: 0, z: 0 }
    
    onObjectAdd(dragSource.type, position)
    onDragEnd()
  }, [dragSource, onObjectAdd, onDragEnd])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  return (
    <div 
      className={`flex-1 relative ${isDragOver ? 'bg-blue-50' : 'bg-gray-100'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drop Zone Overlay */}
      {isDragOver && dragSource && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-500 bg-opacity-10 border-4 border-blue-400 border-dashed">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="text-2xl mb-2">📦</div>
            <p className="font-medium text-gray-900">Drop to add {dragSource.name}</p>
            <p className="text-sm text-gray-600">Will be placed at scene origin</p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [30, 20, 30],
          fov: 60
        }}
        gl={{ 
          antialias: true,
          alpha: false 
        }}
      >
        <SceneContent
          objects={objects}
          selectedObjectId={selectedObjectId}
          transformMode={transformMode}
          showGrid={showGrid}
          showAxes={showAxes}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
          transformControlsRef={transformControlsRef}
          orbitControlsRef={orbitControlsRef}
          onObjectSelect={onObjectSelect}
          onObjectUpdate={onObjectUpdate}
        />
      </Canvas>

      {/* Toolbar */}
      <CreatorToolbar
        transformMode={transformMode}
        showGrid={showGrid}
        showAxes={showAxes}
        snapToGrid={snapToGrid}
        onTransformModeChange={onTransformModeChange}
        onToggleGrid={onToggleGrid}
        onToggleAxes={onToggleAxes}
        onToggleSnap={onToggleSnap}
      />
    </div>
  )
}

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

function SceneContent({
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
  const handleObjectClick = useCallback((objectId: string) => {
    onObjectSelect(objectId)
  }, [onObjectSelect])

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
      <color attach="background" args={['#f5f5f5']} />
      <ambientLight color="#404040" intensity={0.5} />
      <directionalLight
        color="#FFFFFF"
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
          color="#888888"
          sectionColor="#444444"
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

interface SceneObjectComponentProps {
  object: SceneObject
  isSelected: boolean
  onSelect: () => void
  onRef: (ref: THREE.Object3D | null) => void
}

function SceneObjectComponent({ object, isSelected, onSelect, onRef }: SceneObjectComponentProps) {
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

  const handleClick = useCallback((e: any) => {
    e.stopPropagation()
    onSelect()
  }, [onSelect])

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
          <meshBasicMaterial
            color="#00ff00"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Render actual component */}
      {object.type === 'straw_green' ? (
        <Straw
          straw={{
            id: object.id,
            name: object.name,
            geometry: { type: 'cylinder', radius: 0.3, height: 11.2 },
            material: { color: '#22c55e' },
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
          fade={1}
        />
      ) : (
        <Connector3D
          connector={{
            id: object.id,
            name: object.name,
            type: '3leg',
            geometry: { type: 'custom' },
            material: { color: '#dc2626' },
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

interface CreatorToolbarProps {
  transformMode: 'translate' | 'rotate' | 'scale'
  showGrid: boolean
  showAxes: boolean
  snapToGrid: boolean
  onTransformModeChange: (mode: 'translate' | 'rotate' | 'scale') => void
  onToggleGrid: () => void
  onToggleAxes: () => void
  onToggleSnap: () => void
}

function CreatorToolbar({
  transformMode,
  showGrid,
  showAxes,
  snapToGrid,
  onTransformModeChange,
  onToggleGrid,
  onToggleAxes,
  onToggleSnap
}: CreatorToolbarProps) {
  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
      <div className="flex items-center gap-2">
        {/* Transform Mode */}
        <div className="flex bg-gray-100 rounded-md p-1">
          <button
            className={`px-3 py-1 text-xs rounded ${transformMode === 'translate' ? 'bg-white shadow' : ''}`}
            onClick={() => onTransformModeChange('translate')}
          >
            Move
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${transformMode === 'rotate' ? 'bg-white shadow' : ''}`}
            onClick={() => onTransformModeChange('rotate')}
          >
            Rotate
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${transformMode === 'scale' ? 'bg-white shadow' : ''}`}
            onClick={() => onTransformModeChange('scale')}
          >
            Scale
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* View Options */}
        <button
          className={`px-2 py-1 text-xs rounded ${showGrid ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
          onClick={onToggleGrid}
        >
          Grid
        </button>
        <button
          className={`px-2 py-1 text-xs rounded ${showAxes ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
          onClick={onToggleAxes}
        >
          Axes
        </button>
        <button
          className={`px-2 py-1 text-xs rounded ${snapToGrid ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
          onClick={onToggleSnap}
        >
          Snap
        </button>
      </div>
    </div>
  )
}
