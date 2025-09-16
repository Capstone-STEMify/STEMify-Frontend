'use client'

import { Canvas } from '@react-three/fiber'
import { useRef, useCallback, useState } from 'react'
import { CreatorToolbar } from '@/features/creator-3d/components/creator-workspace/CreatorToolbar'
import { SceneContent } from '@/features/creator-3d/components/creator-workspace/SceneContent'
import SceneTopRight from '@/features/creator-3d/components/creator-workspace/SceneTopRight'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { ComponentTemplate } from '@/features/assembly/types/assembly.types'

interface CreatorWorkspaceProps {
  objects: AssemblyInstance[]
  selectedObjectId: string | null
  transformMode: 'translate' | 'rotate' | 'scale'
  showGrid: boolean
  showAxes: boolean
  snapToGrid: boolean
  gridSize: number
  dragSource: ComponentTemplate | null
  onObjectSelect: (objectId: string | null) => void
  onObjectUpdate: (objectId: string, updates: Partial<AssemblyInstance>) => void
  onObjectAdd: (template: ComponentTemplate, position: { x: number; y: number; z: number }) => void
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
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (!dragSource) return

      // Hiện tại: đặt tại origin (0,0,0).
      // Sau này có thể raycast để lấy vị trí thực trong 3D.
      const position = { x: 0, y: 0, z: 0 }

      // category trong AssemblyInstance là 'straw' | 'connector'
      const category = dragSource.category as 'straw' | 'connector'

      onObjectAdd(dragSource, position)
      onDragEnd()
    },
    [dragSource, onObjectAdd, onDragEnd]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  return (
    <div
      className={`relative h-screen flex-1 ${isDragOver ? 'bg-blue-50' : 'bg-gray-100'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drop Zone Overlay */}
      {isDragOver && dragSource && (
        <div className='bg-opacity-10 absolute inset-0 z-10 flex items-center justify-center border-4 border-dashed border-blue-400 bg-blue-500'>
          <div className='rounded-lg bg-white p-6 text-center shadow-lg'>
            <div className='mb-2 text-2xl'>📦</div>
            <p className='font-medium text-gray-900'>Drop to add {dragSource.name}</p>
            <p className='text-sm text-gray-600'>Will be placed at scene origin</p>
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
      <SceneTopRight />
    </div>
  )
}
