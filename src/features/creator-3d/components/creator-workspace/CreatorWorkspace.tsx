'use client'

import { Canvas } from '@react-three/fiber'
import { useRef, useCallback, useState, useEffect } from 'react'
import { CreatorToolbar } from '@/features/creator-3d/components/creator-workspace/CreatorToolbar'
import { SceneContent } from '@/features/creator-3d/components/creator-workspace/SceneContent'
import SceneTopRight from '@/features/creator-3d/components/creator-workspace/SceneTopRight'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { ComponentTemplate } from '@/features/assembly/types/assembly.types'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  addInstance,
  removeInstance,
  setDraggingTemplate,
  setSelectedId
} from '@/features/creator-3d/slice/creatorSceneSlice'
import { syncRedo, syncUndo } from '@/features/creator-3d/slice/createSceneThunk'
import { removeTargetFromAllActions } from '@/features/creator-3d/slice/workspaceTreeSlice'

interface CreatorWorkspaceProps {
  onObjectSelect: (objectId: string | null) => void
  onObjectUpdate: (objectId: string, updates: Partial<AssemblyInstance>) => void
  onObjectAdd: (template: ComponentTemplate, position: { x: number; y: number; z: number }) => void
}

export function CreatorWorkspace({ onObjectSelect, onObjectUpdate, onObjectAdd }: CreatorWorkspaceProps) {
  const selectedId = useAppSelector((s) => s.creatorScene.selectedId)
  const instances = useAppSelector((s) => s.creatorScene.instances)
  const clipboardRef = useRef<AssemblyInstance | null>(null)
  const dragSource = useAppSelector((s) => s.creatorScene.draggingTemplate)
  const dispatch = useAppDispatch()

  const [isDragOver, setIsDragOver] = useState(false)
  const transformControlsRef = useRef<any>(null)
  const orbitControlsRef = useRef<any>(null)

  const handleDragEnd = () => {
    dispatch(setDraggingTemplate(null))
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (!dragSource) return

      const position = { x: 0, y: 0, z: 0 }
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌨️ Ctrl + Z → Undo (synced)
      // if (e.ctrlKey && e.key.toLowerCase() === 'z') {
      //   e.preventDefault()
      //   dispatch(syncUndo())
      //   return
      // }

      // ⌨️ Ctrl + Y → Redo (synced)
      // if (e.ctrlKey && e.key.toLowerCase() === 'y') {
      //   e.preventDefault()
      //   dispatch(syncRedo())
      //   return
      // }

      // ⌨️ Ctrl + C → Copy
      // if (e.ctrlKey && e.key.toLowerCase() === 'c' && selectedId) {
      //   e.preventDefault()
      //   const copied = instances.find((i) => i.id === selectedId)
      //   clipboardRef.current = copied ? JSON.parse(JSON.stringify(copied)) : null
      //   console.log('📋 Copied object:', clipboardRef.current?.id)
      //   return
      // }

      // ⌨️ Ctrl + V → Paste
      // if (e.ctrlKey && e.key.toLowerCase() === 'v' && clipboardRef.current) {
      //   e.preventDefault()
      //   const base = clipboardRef.current
      //   const newCopy: AssemblyInstance = {
      //     ...base,
      //     id: `${base.id}_copy_${Date.now()}`,
      //     transform: {
      //       ...base.transform,
      //       position: {
      //         x: base.transform.position.x + 1,
      //         y: base.transform.position.y,
      //         z: base.transform.position.z + 1
      //       }
      //     }
      //   }
      //   dispatch(addInstance(newCopy))
      //   dispatch(setSelectedId(newCopy.id))
      //   console.log('📎 Pasted object:', newCopy.id)
      //   return
      // }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault()
        dispatch(removeInstance(selectedId))
        dispatch(removeTargetFromAllActions(selectedId))

        console.log('🗑️ Deleted object:', selectedId)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, selectedId, instances])

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
      <CreatorToolbar />
      <SceneTopRight />
    </div>
  )
}
