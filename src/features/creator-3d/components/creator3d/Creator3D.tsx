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
  setInstances,
  setSelectedId,
  updateInstance
} from '@/features/creator-3d/slice/creatorSceneSlice'
import { useAddObject, useExportAssembly, useSelectedObject } from '@/features/creator-3d/hooks/creator-3d-helper'
import WorkspaceTree from '@/features/creator-3d/components/right-sidebar/WorkspaceTree'
import {
  addAction,
  addTargetToAction,
  clearAction,
  removeTargetFromAllActions,
  resetActions,
  updateConnectorArms
} from '@/features/creator-3d/slice/workspaceTreeSlice'
import WorkspacePanel from '@/features/creator-3d/components/right-sidebar/CreatorRightPanel'
import { supabase } from '@/libs/supabase/client'
import { toast } from 'sonner'
import { AssemblyInstance, useAssembly } from '@/features/assembly/hooks/useAssemblyOptimized'

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

  const handleImportAssembly = useCallback(
    async (id: string) => {
      try {
        toast.info('⏳ Đang tải Assembly từ Supabase...')

        // 1️⃣ Fetch JSON từ Supabase API
        const res = await fetch(`/api/assemblies/${id}`)
        if (!res.ok) throw new Error('Không thể tải dữ liệu từ Supabase')

        const data = await res.json()
        if (!data) throw new Error('Dữ liệu assembly không hợp lệ')

        console.log('🧩 Imported Assembly JSON:', data)

        dispatch(clearScene())
        dispatch(clearAction())

        // ========== 🔹 Restore Instances ==========
        if (data.instances) {
          const allInstances: AssemblyInstance[] = []

          // 1️⃣ Lặp qua straws
          if (Array.isArray(data.instances.straws)) {
            data.instances.straws.forEach((group: any) => {
              group.instances.forEach((inst: any) => {
                allInstances.push({
                  id: inst.id,
                  templateId: group.templateId,
                  category: 'straw',
                  transform: inst.transform,
                  isVisible: true,
                  distanceToCamera: 0,
                  data: {
                    id: inst.id,
                    name: group.templateId,
                    transform: inst.transform,
                    material: {
                      type: 'plastic',
                      properties: {
                        color: '#00aaff',
                        flexibility: 50,
                        opacity: 1,
                        roughness: 0.4,
                        metalness: 0
                      }
                    },
                    geometry: { length: 16, diameter: 0.8, wallThickness: 0.1 },
                    endpoints: {
                      start: {
                        id: `${inst.id}_start`,
                        localPosition: { x: -8, y: 0, z: 0 },
                        connectionId: null,
                        isAvailable: true
                      },
                      end: {
                        id: `${inst.id}_end`,
                        localPosition: { x: 8, y: 0, z: 0 },
                        connectionId: null,
                        isAvailable: true
                      }
                    }
                  },
                  arms: undefined
                })
              })
            })
          }

          // 2️⃣ Lặp qua connectors
          if (Array.isArray(data.instances.connectors)) {
            data.instances.connectors.forEach((group: any) => {
              group.instances.forEach((inst: any) => {
                allInstances.push({
                  id: inst.id,
                  templateId: group.templateId,
                  category: 'connector',
                  transform: inst.transform,
                  isVisible: true,
                  distanceToCamera: 0,
                  data: {
                    id: inst.id,
                    name: group.templateId,
                    transform: inst.transform,
                    material: {
                      type: 'plastic',
                      properties: {
                        color: '#ff4444',
                        flexibility: 50,
                        opacity: 1,
                        roughness: 0.5,
                        metalness: 0
                      }
                    },
                    geometry: {
                      size: { x: 2, y: 2, z: 2 },
                      portDiameter: 0.8,
                      shape: 'cylindrical'
                    },
                    type: 'straight',
                    ports: [
                      {
                        id: `${inst.id}_port_0`,
                        localPosition: { x: 0, y: 0, z: 1 },
                        orientation: { x: 0, y: 0, z: 1 },
                        connectionId: null,
                        isAvailable: true,
                        portIndex: 0
                      }
                    ],
                    constraints: { maxConnections: 3, allowedAngles: [] },
                    numArms: 1,
                    modelUrl: `/models/connector_1leg.glb`
                  },
                  arms: {}
                })
              })
            })
          }

          console.log('🧱 Flattened Instances:', allInstances)
          dispatch(setInstances(allInstances))
        } else {
          console.warn('⚠ Không tìm thấy instances trong dữ liệu')
        }

        // Restore actions (workspace actions)
        if (Array.isArray(data.actions)) {
          for (const act of data.actions) {
            // Thêm action cơ bản
            dispatch(
              addAction({
                id: act.id,
                name: act.name,
                type: act.type
              })
            )

            if (Array.isArray(act.targets)) {
              for (const targetId of act.targets) {
                dispatch(
                  addTargetToAction({
                    actionId: act.id,
                    targetId
                  })
                )
              }
            }

            // Nếu có connectorArmTransforms (cho transform_arm)
            if (act.type === 'transform_arm' && act.connectorArmTransforms) {
              Object.entries(act.connectorArmTransforms).forEach(([connectorId, arms]) => {
                // Ensure arms is of the correct type
                dispatch(
                  updateConnectorArms({
                    actionId: act.id,
                    connectorId,
                    arms: arms as Record<string, { x: number; y: number; z: number }>
                  })
                )
              })
            }
          }
        } else {
          console.warn('⚠ Không tìm thấy actions trong dữ liệu')
        }

        toast.success('✅ Đã import thành công Assembly!')
      } catch (err: any) {
        console.error('❌ Import error:', err)
        toast.error(err.message || 'Lỗi khi load Assembly.')
      }
    },
    [dispatch]
  )

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
        <SceneActions
          onImport={() => {
            const id = prompt('Nhập ID Assembly muốn import:')
            if (id) handleImportAssembly(id)
          }}
          onClear={handleClearScene}
          onExport={handleExport}
          hasObjects={instances.length > 0}
        />
      </div>

      {/* Object Inspector */}
      <div className='my-2 mr-2 w-85 gap-4'>
        <WorkspacePanel />
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        // <ExportDialog
        //   onClose={() => setShowExportDialog(false)}
        //   onExport={(metadata) => {
        //     const exportData = exportAssemblyFn(metadata)

        //     const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        //     const url = URL.createObjectURL(blob)
        //     const a = document.createElement('a')
        //     a.href = url
        //     a.download = `${metadata.title.replace(/\s+/g, '_').toLowerCase()}_assembly.json`
        //     document.body.appendChild(a)
        //     a.click()
        //     document.body.removeChild(a)
        //     URL.revokeObjectURL(url)
        //     setShowExportDialog(false)
        //   }}
        // />
        <ExportDialog
          onClose={() => setShowExportDialog(false)}
          onExport={async (metadata) => {
            try {
              const exportData = exportAssemblyFn(metadata) // lấy JSON object từ state
              const { error } = await supabase.from('assembly_data').insert([
                {
                  name: metadata.title,
                  description: metadata.description,
                  author: metadata.author,
                  data: exportData
                }
              ])

              if (error) {
                console.error('Supabase insert error:', error)
                toast.error('❌ Lưu thất bại. Vui lòng thử lại.')
              } else {
                toast.success('✅ Đã lưu assembly vào Supabase!')
              }

              setShowExportDialog(false)
            } catch (err) {
              console.error(err)
              toast.error('Lỗi không xác định khi lưu dữ liệu.')
            }
          }}
        />
      )}
    </div>
  )
}
