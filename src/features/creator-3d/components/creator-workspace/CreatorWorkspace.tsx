'use client'

import { Canvas } from '@react-three/fiber'
import { useRef, useCallback, useState } from 'react'
import { CreatorToolbar } from '@/features/creator-3d/components/creator-workspace/CreatorToolbar'
import { SceneContent } from '@/features/creator-3d/components/creator-workspace/SceneContent'
import SceneTopRight from '@/features/creator-3d/components/creator-workspace/SceneTopRight'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { ComponentTemplate } from '@/features/assembly/types/assembly.types'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setDraggingTemplate } from '@/features/creator-3d/slice/creatorSceneSlice'

interface CreatorWorkspaceProps {
  onObjectSelect: (objectId: string | null) => void
  onObjectUpdate: (objectId: string, updates: Partial<AssemblyInstance>) => void
  onObjectAdd: (template: ComponentTemplate, position: { x: number; y: number; z: number }) => void
}

export function CreatorWorkspace({ onObjectSelect, onObjectUpdate, onObjectAdd }: CreatorWorkspaceProps) {
  const dragSource = useAppSelector((s) => s.creatorScene.draggingTemplate)
  const dispatch = useAppDispatch()

  const [isDragOver, setIsDragOver] = useState(false)
  const transformControlsRef = useRef<any>(null)
  const orbitControlsRef = useRef<any>(null)
  const handleDragEnd = () => {
    dispatch(setDraggingTemplate(null))
  }
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
      handleDragEnd()
    },
    [dragSource, onObjectAdd, handleDragEnd]
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
      className={`relative h-full flex-1 overflow-hidden ${isDragOver ? 'bg-blue-50' : 'bg-gray-100'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className='absolute inset-0'>
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
            transformControlsRef={transformControlsRef}
            orbitControlsRef={orbitControlsRef}
            onObjectSelect={onObjectSelect}
            onObjectUpdate={onObjectUpdate}
            onDropObject={(pos) => {
              if (dragSource) {
                onObjectAdd(dragSource, pos)
                handleDragEnd()
              }
            }}
          />
        </Canvas>
      </div>
      {/* Toolbar */}
      <CreatorToolbar />
      <SceneTopRight />
    </div>
  )
}
