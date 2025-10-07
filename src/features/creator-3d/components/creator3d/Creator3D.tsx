'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { ComponentPalette } from '../component-palette/ComponentPalette'
import { ObjectInspector } from '../right-sidebar/ObjectInspector'
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
import WorkspaceTree from '@/features/creator-3d/components/right-sidebar/WorkspaceTree'
import {
  removeTargetFromAllActions,
  resetActions,
  updateConnectorArms
} from '@/features/creator-3d/slice/workspaceTreeSlice'
import WorkspacePanel from '@/features/creator-3d/components/right-sidebar/CreatorRightPanel'

export function Creator3D() {
  const dispatch = useAppDispatch()
  const instances = useAppSelector((s) => s.creatorScene.instances)
  const addObject = useAddObject()
  const selectedObject = useSelectedObject()
  const exportAssemblyFn = useExportAssembly()
  const [showExportDialog, setShowExportDialog] = useState(false)

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

  // Handle export
  const handleExport = useCallback(() => {
    setShowExportDialog(true)
  }, [])

  // Handle clear scene
  const handleClearScene = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire scene? This action cannot be undone.')) {
      dispatch(clearScene())
      dispatch(resetActions())
    }
  }, [dispatch])

  return (
    <div className='relative flex w-full bg-gray-100'>
      {/* Component Palette */}
      <div className='w-64 bg-white'>
        <ComponentPalette onAddComponent={handleAddComponent} />
      </div>

      {/* Main Workspace */}
      <div className='relative w-[60%]'>
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
      <div className='my-2 mr-2 w-85 gap-4'>
        <WorkspacePanel />
      </div>

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
