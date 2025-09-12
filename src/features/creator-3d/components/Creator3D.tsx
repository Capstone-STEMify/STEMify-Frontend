'use client'

import { useState, useCallback, useMemo } from 'react'
import { ComponentPalette } from './ComponentPalette'
import { CreatorWorkspace } from './CreatorWorkspace'
import { ObjectInspector } from './ObjectInspector'
import { useCreatorScene } from '../hooks/useCreatorScene'
import { ComponentTemplate, ComponentType } from '../types/creator.types'
import { useIsMobile } from '@/hooks/use-mobile'

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
    (type: ComponentType) => {
      addObject(type, { x: 0, y: 0, z: 0 })
    },
    [addObject]
  )

  // Handle adding component from workspace drop
  const handleWorkspaceAdd = useCallback(
    (type: ComponentType, position: { x: number; y: number; z: number }) => {
      addObject(type, position)
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
    <div className='relative flex h-screen w-full bg-gray-100'>
      {/* Component Palette */}
      {showLeftSidebar && <ComponentPalette onDragStart={handleDragStart} onAddComponent={handleAddComponent} />}

      {/* Main Workspace */}
      <div className='relative flex-1'>
        <CreatorWorkspace
          objects={state.scene.objects}
          selectedObjectId={state.scene.selectedObjectId}
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
          objectCount={state.scene.objects.length}
          strawCount={state.scene.objects.filter((obj) => obj.type === 'straw_green').length}
          connectorCount={state.scene.objects.filter((obj) => obj.type === 'connector_3leg').length}
          selectedObject={selectedObject}
        />

        {/* Action Buttons */}
        <SceneActions onClear={handleClearScene} onExport={handleExport} hasObjects={state.scene.objects.length > 0} />
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
            // Download JSON file
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

interface SceneStatsProps {
  objectCount: number
  strawCount: number
  connectorCount: number
  selectedObject: any
}

function SceneStats({ objectCount, strawCount, connectorCount, selectedObject }: SceneStatsProps) {
  return (
    <div className='absolute bottom-4 left-4 rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
      <div className='space-y-1 text-xs text-gray-600'>
        <div className='font-medium'>Scene Stats</div>
        <div>Objects: {objectCount}</div>
        <div className='flex gap-4'>
          <span> Straws: {strawCount}</span>
          <span> Connectors: {connectorCount}</span>
        </div>
        {selectedObject && (
          <div className='border-t border-gray-200 pt-1'>
            <div className='font-medium'>Selected: {selectedObject.name}</div>
          </div>
        )}
      </div>
    </div>
  )
}

interface SceneActionsProps {
  onClear: () => void
  onExport: () => void
  hasObjects: boolean
}

function SceneActions({ onClear, onExport, hasObjects }: SceneActionsProps) {
  return (
    <div className='absolute right-4 bottom-4 flex gap-2'>
      <button
        onClick={onClear}
        disabled={!hasObjects}
        className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Clear Scene
      </button>
      <button
        onClick={onExport}
        disabled={!hasObjects}
        className='rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Export Assembly
      </button>
    </div>
  )
}

interface ExportDialogProps {
  onClose: () => void
  onExport: (metadata: { title: string; description: string; author: string }) => void
}

function ExportDialog({ onClose, onExport }: ExportDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim() && author.trim()) {
      onExport({ title: title.trim(), description: description.trim(), author: author.trim() })
    }
  }

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='mx-4 w-full max-w-md rounded-lg bg-white shadow-xl'>
        <div className='p-6'>
          <h2 className='mb-4 text-lg font-semibold text-gray-900'>Export Assembly</h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='My Custom Assembly'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='A custom 3D assembly created for educational purposes...'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Author</label>
              <input
                type='text'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='Teacher Name'
                required
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
              >
                Export
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
