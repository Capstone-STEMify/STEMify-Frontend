'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { ComponentPalette } from '../component-palette/ComponentPalette'
import { SceneActions } from '@/features/creator-3d/components/creator3d/SceneActions'
import { SceneStats } from '@/features/creator-3d/components/creator3d/SceneStats'
import { ExportDialog } from '@/features/creator-3d/components/creator3d/ExportDialog'
import { ComponentTemplate } from '@/features/assembly/types/assembly.types'
import { CreatorWorkspace } from '@/features/creator-3d/components/creator-workspace/CreatorWorkspace'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { clearScene, setInstances, setSelectedId, updateInstance } from '@/features/creator-3d/slice/creatorSceneSlice'
import { useAddObject, useExportAssembly, useSelectedObject } from '@/features/creator-3d/hooks/creator-3d-helper'
import {
  addAction,
  addActivity,
  addStepToActivity,
  addTargetToAction,
  clearAction,
  removeTargetFromAllActions,
  resetActions,
  updateConnectorArms
} from '@/features/creator-3d/slice/workspaceTreeSlice'
import WorkspacePanel from '@/features/creator-3d/components/right-sidebar/CreatorRightPanel'
import { supabase } from '@/libs/supabase/client'
import { toast } from 'sonner'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
  useCreateEmulatorMutation,
  useGetEmulatorByIdQuery,
  useUpdateEmulatorMutation
} from '@/features/emulator/api/emulatorApi'
import { ApiSuccessResponse } from '@/types/baseModel'
import { Emulator } from '@/features/emulator/types/emulator.type'
import { useGLTF } from '@react-three/drei'
type Creator3DProps = {
  emulatorData: ApiSuccessResponse<Emulator> | undefined
}

export default function Creator3D({ emulatorData }: Creator3DProps) {
  const { workspaceId } = useParams() as { workspaceId: string }
  const t3d = useTranslations('creator3D.main_content')
  const dispatch = useAppDispatch()
  const instances = useAppSelector((s) => s.creatorScene.instances)
  const addObject = useAddObject()
  const selectedObject = useSelectedObject()
  const exportAssemblyFn = useExportAssembly()
  const actions = useAppSelector((s) => s.workspaceTree.actions)

  const [updateEmulator, { isLoading: isUpdating }] = useUpdateEmulatorMutation()
  const prevInstanceIds = useRef<string[]>([])

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

  useEffect(() => {
    const currentIds = instances.map((i) => i.id)
    const deletedIds = prevInstanceIds.current.filter((id) => !currentIds.includes(id))

    if (deletedIds.length > 0) {
      deletedIds.forEach((id) => {
        dispatch(removeTargetFromAllActions(id))
      })
    }

    prevInstanceIds.current = currentIds
  }, [instances, dispatch])

  const handleSaveAssembly = useCallback(async () => {
    if (!workspaceId) {
      toast.error('⚠️ Không có workspaceId — không thể lưu.')
      return
    }

    try {
      if (emulatorData) {
        const existing = emulatorData.data

        const exportData = exportAssemblyFn({
          title: `Assembly ${workspaceId}`,
          description: 'Exported from workspace',
          author: 'STEMify User'
        })

        const response = await updateEmulator({
          emulationId: existing.emulationId,
          body: {
            name: `Emulator for ${existing.name}`,
            description: `Emulator created for assembly ${existing.name}`,
            visibility: 'private',
            definition_json: JSON.stringify(exportData),
            status: existing.status
          }
        }).unwrap()
        toast.success('✅ Lưu dữ liệu thành công.')
      }

      // console.log('Emulator creation response:', response)
    } catch (err) {
      console.error(err)
      toast.error('Lỗi không xác định khi lưu dữ liệu.')
    }
  }, [workspaceId, exportAssemblyFn])

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
        dispatch(clearScene())
        dispatch(clearAction())

        if (!emulatorData) {
          toast.warning('Đang tải emulator...')
          return
        }

        const existing = emulatorData.data
        const data = existing.definitionJson ? JSON.parse(existing.definitionJson) : null
        if (!data) throw new Error('Dữ liệu assembly không hợp lệ')

        const allInstances: AssemblyInstance[] = []

        // ================================
        // 🔹 Helper: Load Template by ID
        // ================================
        const loadTemplateById = async (templateId: string) => {
          const template = data.templates.components.find((t: any) => t.id === templateId || t._id === templateId)
          if (!template) throw new Error(`Không tìm thấy templateId: ${templateId}`)
          const res = await fetch(template.source)
          if (!res.ok) throw new Error(`Không tải được file template: ${template.source}`)
          return await res.json()
        }

        // 🔹 Helper: Resolve material from materialRef
        const resolveMaterial = async (materialRef: string) => {
          const matDef = data.templates.materials.find((m: any) => m.id === materialRef)
          if (!matDef) return null
          const res = await fetch(matDef.source)
          if (!res.ok) return null
          return await res.json()
        }

        // ================================
        // 1️⃣ Restore Straws
        // ================================
        if (Array.isArray(data.instances.straws)) {
          for (const group of data.instances.straws) {
            const templateData = await loadTemplateById(group.templateId)

            // lấy geometry & materialRef từ file JSON template
            const baseGeo = templateData.baseGeometry
            const endpoints = templateData.endpointTemplate || {
              start: { localPosition: { x: -baseGeo.length / 2, y: 0, z: 0 } },
              end: { localPosition: { x: baseGeo.length / 2, y: 0, z: 0 } }
            }

            const matData = await resolveMaterial(templateData.materialRef)

            for (const inst of group.instances) {
              allInstances.push({
                id: inst.id,
                templateId: group.templateId,
                category: 'straw',
                transform: inst.transform,
                isVisible: true,
                distanceToCamera: 0,
                data: {
                  id: inst.id,
                  name: templateData.name,
                  transform: inst.transform,
                  geometry: baseGeo,
                  endpoints,
                  material: matData || {
                    type: 'plastic',
                    properties: {
                      color: '#00aaff',
                      flexibility: 50,
                      opacity: 1,
                      roughness: 0.4,
                      metalness: 0
                    }
                  },
                  physics: templateData.physics
                },
                arms: undefined
              })
            }
          }
        }

        // ================================
        // 2️⃣ Restore Connectors
        // ================================
        if (Array.isArray(data.instances.connectors)) {
          for (const group of data.instances.connectors) {
            const templateData = await loadTemplateById(group.templateId)
            const matData = await resolveMaterial(templateData.materialRef)

            for (const inst of group.instances) {
              allInstances.push({
                id: inst.id,
                templateId: group.templateId,
                category: 'connector',
                transform: inst.transform,
                isVisible: true,
                distanceToCamera: 0,
                data: {
                  id: inst.id,
                  name: templateData.name,
                  transform: inst.transform,
                  material: matData || {
                    type: 'plastic',
                    properties: {
                      color: '#ff4444',
                      flexibility: 50,
                      opacity: 1,
                      roughness: 0.5,
                      metalness: 0
                    }
                  },
                  geometry: templateData.baseGeometry || {
                    size: { x: 2, y: 2, z: 2 },
                    portDiameter: 0.8,
                    shape: 'cylindrical'
                  },
                  ports: templateData.ports || [
                    {
                      id: `${inst.id}_port_0`,
                      localPosition: { x: 0, y: 0, z: 1 },
                      orientation: { x: 0, y: 0, z: 1 },
                      connectionId: null,
                      isAvailable: true,
                      portIndex: 0
                    }
                  ],
                  constraints: templateData.constraints || { maxConnections: 3, allowedAngles: [] },
                  modelUrl: templateData.baseGeometry.modelPath
                },
                arms: {}
              })
            }
          }
        }

        // ================================
        // ✅ Cập nhật Redux Scene
        // ================================
        dispatch(setInstances(allInstances))

        // ================================
        // 🔹 Restore Actions
        // ================================
        dispatch(clearAction())
        if (Array.isArray(data.actions)) {
          for (const act of data.actions) {
            dispatch(addAction({ id: act.id, name: act.name, type: act.type }))
            if (Array.isArray(act.targets)) {
              act.targets.forEach((targetId: string) => dispatch(addTargetToAction({ actionId: act.id, targetId })))
            }
            if (act.type === 'transform_arm' && act.connectorArmTransforms) {
              Object.entries(act.connectorArmTransforms).forEach(([connectorId, arms]) => {
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
        }

        // ================================
        // 🔹 Restore Activities + Steps
        // ================================
        if (Array.isArray(data.activities)) {
          for (const activity of data.activities) {
            // ✅ 1️⃣ Thêm activity trước (nếu chưa có)
            dispatch(
              addActivity({
                id: activity.id,
                name: activity.name,
                steps: [],
                difficulty: activity.difficulty ?? 'medium',
                description: activity.description ?? '',
                estimatedTime: activity.estimatedTime ?? 10
              })
            )

            // ✅ 2️⃣ Thêm các step của activity
            if (Array.isArray(activity.steps)) {
              for (const step of activity.steps) {
                dispatch(addStepToActivity({ activityId: activity.id, step }))

                // ✅ 3️⃣ Nếu step có actions thì xử lý tiếp
                if (Array.isArray(step.actions)) {
                  for (const act of step.actions) {
                    // Thêm action
                    dispatch(addAction({ id: act.id, name: act.name, type: act.type }))

                    // Gắn các target
                    if (Array.isArray(act.targets)) {
                      act.targets.forEach((targetId: string) =>
                        dispatch(addTargetToAction({ actionId: act.id, targetId }))
                      )
                    }

                    // Restore arms nếu có
                    if (act.type === 'transform_arm' && act.connectorArmTransforms) {
                      Object.entries(act.connectorArmTransforms).forEach(([connectorId, arms]) => {
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
                }
              }
            }
          }
        }

        toast.success(t3d('export_success'))
      } catch (err: any) {
        toast.error(err.message || t3d('export_error'))
      }
    },
    [dispatch, emulatorData]
  )

  useEffect(() => {
    if (workspaceId) {
      handleImportAssembly(workspaceId)
    }
  }, [workspaceId, handleImportAssembly])

  return (
    <div className='relative flex h-full w-full overflow-hidden bg-gray-100'>
      {/* Component Palette */}
      <div className='h-full w-64 flex-shrink-0 border-r bg-white'>
        <ComponentPalette onAddComponent={handleAddComponent} />
      </div>

      {/* Main Workspace */}
      <div className='relative flex h-full flex-1 flex-col'>
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
        <SceneActions onSave={handleSaveAssembly} onClear={handleClearScene} hasObjects={instances.length > 0} />
      </div>

      {/* Object Inspector */}
      <div className='h-full w-80 flex-shrink-0 bg-white'>
        <WorkspacePanel />
      </div>
    </div>
  )
}
