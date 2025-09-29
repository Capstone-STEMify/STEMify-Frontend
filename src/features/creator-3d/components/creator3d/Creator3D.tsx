'use client'

import { useState, useCallback, useMemo } from 'react'
import { ComponentPalette } from '../component-palette/ComponentPalette'
import { ObjectInspector } from '../ObjectInspector'
import { useIsMobile } from '@/hooks/use-mobile'
import { SceneActions } from '@/features/creator-3d/components/creator3d/SceneActions'
import { SceneStats } from '@/features/creator-3d/components/creator3d/SceneStats'
import { ExportDialog } from '@/features/creator-3d/components/creator3d/ExportDialog'
import { ComponentTemplate } from '@/features/assembly/types/assembly.types'
import { CreatorWorkspace } from '@/features/creator-3d/components/creator-workspace/CreatorWorkspace'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  clearScene,
  removeInstance,
  setSelectedId,
  updateInstance
} from '@/features/creator-3d/slice/creatorSceneSlice'
import { useAddObject, useExportAssembly, useSelectedObject } from '@/features/creator-3d/hooks/creator-3d-helper'

export function Creator3D() {
  const dispatch = useAppDispatch()
  const instances = useAppSelector((s) => s.creatorScene.instances)
  const addObject = useAddObject()
  const selectedObject = useSelectedObject()
  const exportAssemblyFn = useExportAssembly()
  const [showExportDialog, setShowExportDialog] = useState(false)
  const isMobile = useIsMobile()

  // Sidebar visibility (collapse on mobile by default)
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(true)
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(true)

  // Ensure initial state respects mobile once mounted
  useMemo(() => {
    if (isMobile) {
      setShowLeftSidebar(false)
      setShowRightSidebar(false)
    }
    return undefined
  }, [isMobile])

  // Handle drag start from palette

  // Handle adding component from palette
  const handleAddComponent = useCallback(
    (template: ComponentTemplate) => {
      addObject(template, { x: 0, y: 0, z: 0 })
    },
    [addObject]
  )

  // Handle adding component from workspace drop
  const handleWorkspaceAdd = useCallback(
    (template: ComponentTemplate, position: { x: number; y: number; z: number }) => {
      addObject(template, position)
    },
    [addObject]
  )

  // Handle object selection
  const handleObjectSelect = useCallback(
    (objectId: string | null) => {
      dispatch(setSelectedId(objectId))
    },
    [dispatch]
  )

  // Handle object updates
  const handleObjectUpdate = useCallback(
    (objectId: string, updates: any) => {
      dispatch(updateInstance({ id: objectId, updates }))
    },
    [dispatch]
  )

  // Handle object deletion
  const handleObjectDelete = useCallback(
    (objectId: string) => {
      dispatch(removeInstance(objectId))
    },
    [dispatch]
  )

  // Handle export
  const handleExport = useCallback(() => {
    setShowExportDialog(true)
  }, [])

  // Handle clear scene
  const handleClearScene = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire scene? This action cannot be undone.')) {
      dispatch(clearScene())
    }
  }, [dispatch])

  return (
    <div className='relative flex w-full bg-gray-100'>
      {/* Component Palette */}
      {showLeftSidebar && <ComponentPalette onAddComponent={handleAddComponent} />}

      {/* Main Workspace */}
      <div className='relative flex-1'>
        <CreatorWorkspace
          onObjectSelect={handleObjectSelect}
          onObjectUpdate={handleObjectUpdate}
          onObjectAdd={handleWorkspaceAdd}
        />

        {/* Scene Stats */}
        <SceneStats
          objectCount={instances.length}
          strawCount={instances.filter((inst) => inst.category === 'straw').length}
          connectorCount={instances.filter((inst) => inst.category === 'connector').length}
          selectedObject={selectedObject}
        />

        {/* Action Buttons */}
        <SceneActions onClear={handleClearScene} onExport={handleExport} hasObjects={instances.length > 0} />
      </div>

      {/* Object Inspector */}
      {showRightSidebar && (
        <ObjectInspector
          key={selectedObject?.id}
          selectedObject={selectedObject}
          onObjectUpdate={handleObjectUpdate}
          onObjectDelete={handleObjectDelete}
        />
      )}

      {/* Sidebar Toggles */}
      <button
        onClick={() => setShowLeftSidebar((s) => !s)}
        className='absolute top-1/2 left-2 z-40 -translate-y-1/2 rounded-md border bg-white px-2 py-1 text-xs shadow'
        aria-label='Toggle components panel'
      >
        {showLeftSidebar ? '⟨' : '⟩'}
      </button>
      <button
        onClick={() => setShowRightSidebar((s) => !s)}
        className='absolute top-1/2 right-2 z-40 -translate-y-1/2 rounded-md border bg-white px-2 py-1 text-xs shadow'
        aria-label='Toggle properties panel'
      >
        {showRightSidebar ? '⟩' : '⟨'}
      </button>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          onClose={() => setShowExportDialog(false)}
          onExport={(metadata) => {
            const exportData = exportAssemblyFn(metadata)

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${metadata.title.replace(/\s+/g, '_').toLowerCase()}_assembly.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            setShowExportDialog(false)
          }}
        />
      )}
    </div>
  )
}
