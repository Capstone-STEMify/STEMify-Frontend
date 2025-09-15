'use client'

import { useState, useCallback, useMemo } from 'react'
import { ComponentPalette } from '../component-palette/ComponentPalette'
import { ObjectInspector } from '../ObjectInspector'
import { useCreatorScene } from '../../hooks/useCreatorScene'
import { useIsMobile } from '@/hooks/use-mobile'
import { SceneActions } from '@/features/creator-3d/components/creator3d/SceneActions'
import { SceneStats } from '@/features/creator-3d/components/creator3d/SceneStats'
import { ExportDialog } from '@/features/creator-3d/components/creator3d/ExportDialog'
import { ComponentTemplate } from '@/features/assembly/types/assembly.types'
import { CreatorWorkspace } from '@/features/creator-3d/components/creator-workspace/CreatorWorkspace'

export function Creator3D() {
  const {
    state,
    selectedObject,
    addObject,
    removeObject,
    updateObject,
    selectObject,
    setTransformMode,
    toggleGrid,
    toggleAxes,
    toggleSnapToGrid,
    clearScene,
    exportAssembly
  } = useCreatorScene()

  const [dragSource, setDragSource] = useState<ComponentTemplate | null>(null)
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
  const handleDragStart = useCallback((template: ComponentTemplate) => {
    setDragSource(template)
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragSource(null)
  }, [])

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
      selectObject(objectId)
    },
    [selectObject]
  )

  // Handle object updates
  const handleObjectUpdate = useCallback(
    (objectId: string, updates: any) => {
      updateObject(objectId, updates)
    },
    [updateObject]
  )

  // Handle object deletion
  const handleObjectDelete = useCallback(
    (objectId: string) => {
      removeObject(objectId)
    },
    [removeObject]
  )

  // Handle export
  const handleExport = useCallback(() => {
    setShowExportDialog(true)
  }, [])

  // Handle clear scene
  const handleClearScene = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire scene? This action cannot be undone.')) {
      clearScene()
    }
  }, [clearScene])

  return (
    <div className='relative flex w-full bg-gray-100'>
      {/* Component Palette */}
      {showLeftSidebar && <ComponentPalette onDragStart={handleDragStart} onAddComponent={handleAddComponent} />}

      {/* Main Workspace */}
      <div className='relative flex-1'>
        <CreatorWorkspace
          objects={state.instances}
          selectedObjectId={state.selectedId}
          transformMode={state.transformMode}
          showGrid={state.showGrid}
          showAxes={state.showAxes}
          snapToGrid={state.snapToGrid}
          gridSize={state.gridSize}
          dragSource={dragSource}
          onObjectSelect={handleObjectSelect}
          onObjectUpdate={handleObjectUpdate}
          onObjectAdd={handleWorkspaceAdd}
          onDragEnd={handleDragEnd}
          onTransformModeChange={setTransformMode}
          onToggleGrid={toggleGrid}
          onToggleAxes={toggleAxes}
          onToggleSnap={toggleSnapToGrid}
        />

        {/* Scene Stats */}
        <SceneStats
          objectCount={state.instances.length}
          strawCount={state.instances.filter((inst) => inst.category === 'straw').length}
          connectorCount={state.instances.filter((inst) => inst.category === 'connector').length}
          selectedObject={selectedObject}
        />

        {/* Action Buttons */}
        <SceneActions onClear={handleClearScene} onExport={handleExport} hasObjects={state.instances.length > 0} />
      </div>

      {/* Object Inspector */}
      {showRightSidebar && (
        <ObjectInspector
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
            const exportData = exportAssembly(metadata)
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
