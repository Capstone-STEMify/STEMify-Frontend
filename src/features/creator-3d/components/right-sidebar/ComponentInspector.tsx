'use client'

import { useSelectedObject } from '@/features/creator-3d/hooks/creator-3d-helper'
import { removeInstance, updateInstance } from '@/features/creator-3d/slice/creatorSceneSlice'
import { removeTargetFromAllActions, updateConnectorArms } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import { useState, useCallback, useEffect } from 'react'

function normalizePose(pose?: Partial<{ x: number; y: number; z: number }>): { x: number; y: number; z: number } {
  return {
    x: pose?.x ?? 0,
    y: pose?.y ?? 0,
    z: pose?.z ?? 0
  }
}

export function ComponentInspector() {
  const t3d = useTranslations('creator3D.right_panel')
  const [localValues, setLocalValues] = useState<{
    position: { x: string; y: string; z: string }
    rotation: { x: string; y: string; z: string }
    scale: { x: string; y: string; z: string }
    name: string
    arms?: Record<string, { x?: string; y?: string; z?: string }>
  } | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useAppDispatch()
  const { selectedActionId, actions } = useAppSelector((s) => s.workspaceTree)
  const selectedObject = useSelectedObject()

  const onObjectUpdate = useCallback(
    (objectId: string, updates: any) => {
      dispatch(updateInstance({ id: objectId, updates }))
    },
    [dispatch]
  )

  const onObjectDelete = useCallback(
    (objectId: string) => {
      dispatch(removeInstance(objectId))
      dispatch(removeTargetFromAllActions(objectId))
    },
    [dispatch]
  )

  useEffect(() => {
    if (!selectedObject) return
    const { position, rotation, scale } = selectedObject.transform

    setLocalValues({
      position: {
        x: position.x.toFixed(2),
        y: position.y.toFixed(2),
        z: position.z.toFixed(2)
      },
      rotation: {
        x: ((rotation.x * 180) / Math.PI).toFixed(1),
        y: ((rotation.y * 180) / Math.PI).toFixed(1),
        z: ((rotation.z * 180) / Math.PI).toFixed(1)
      },
      scale: {
        x: (scale?.x ?? 1).toFixed(2),
        y: (scale?.y ?? 1).toFixed(2),
        z: (scale?.z ?? 1).toFixed(2)
      },
      name: selectedObject.data?.name ?? selectedObject.id,
      arms: selectedObject.arms
        ? Object.fromEntries(
            Object.entries(selectedObject.arms).map(([armId, pose]) => {
              const converted: Record<string, string> = {}
              for (const axis of ['x', 'y', 'z'] as const) {
                if (pose[axis] !== undefined) {
                  converted[axis] = ((pose[axis]! * 180) / Math.PI).toFixed(1)
                }
              }
              return [armId, converted]
            })
          )
        : undefined
    })
  }, [selectedObject, isEditing])

  const updateArm = useCallback(
    (armId: string, axis: 'x' | 'y' | 'z', value: string) => {
      if (!selectedObject) return

      // Update UI local
      setLocalValues((prev) =>
        prev
          ? {
              ...prev,
              arms: {
                ...prev.arms,
                [armId]: { ...(prev.arms?.[armId] ?? {}), [axis]: value }
              }
            }
          : null
      )

      // Convert sang radian và update scene
      const rad = (parseFloat(value) * Math.PI) / 180
      if (!isNaN(rad)) {
        const prevArms = selectedObject.arms ?? {}
        const prevPose = normalizePose(prevArms[armId])

        const newArms: Record<string, { x: number; y: number; z: number }> = {
          ...Object.fromEntries(Object.entries(prevArms).map(([id, pose]) => [id, normalizePose(pose)])),
          [armId]: {
            x: axis === 'x' ? rad : prevPose.x,
            y: axis === 'y' ? rad : prevPose.y,
            z: axis === 'z' ? rad : prevPose.z
          }
        }

        // Update instance trong scene
        onObjectUpdate(selectedObject.id, { arms: newArms })

        // Update workspaceTree
        if (selectedActionId) {
          dispatch(
            updateConnectorArms({
              actionId: selectedActionId,
              connectorId: selectedObject.id,
              arms: newArms
            })
          )
        }
      }
    },
    [selectedObject, onObjectUpdate]
  )

  // --- Update helpers ---
  const updatePosition = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      if (!selectedObject) return
      setIsEditing(true)
      // Cập nhật local UI
      setLocalValues((prev) => (prev ? { ...prev, position: { ...prev.position, [axis]: value } } : null))
      setTimeout(() => setIsEditing(false), 300)
      // Cập nhật scene ngay lập tức
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        onObjectUpdate(selectedObject.id, {
          transform: {
            ...structuredClone(selectedObject.transform),
            position: {
              ...selectedObject.transform.position,
              [axis]: numValue
            }
          }
        })
      }
    },
    [selectedObject, onObjectUpdate]
  )

  const updateRotation = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      if (!selectedObject) return
      setLocalValues((prev) => (prev ? { ...prev, rotation: { ...prev.rotation, [axis]: value } } : null))
      const numValue = (parseFloat(value) * Math.PI) / 180
      if (!isNaN(numValue)) {
        onObjectUpdate(selectedObject.id, {
          transform: {
            ...selectedObject.transform,
            rotation: { ...selectedObject.transform.rotation, [axis]: numValue }
          }
        })
      }
    },
    [selectedObject, onObjectUpdate]
  )

  const updateScale = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      if (!selectedObject) return
      setLocalValues((prev) => (prev ? { ...prev, scale: { ...prev.scale, [axis]: value } } : null))
      const numValue = parseFloat(value)
      if (!isNaN(numValue) && numValue > 0) {
        onObjectUpdate(selectedObject.id, {
          transform: {
            ...selectedObject.transform,
            scale: {
              ...(selectedObject.transform.scale ?? { x: 1, y: 1, z: 1 }),
              [axis]: numValue
            }
          }
        })
      }
    },
    [selectedObject, onObjectUpdate]
  )

  const updateName = useCallback(
    (name: string) => {
      if (!selectedObject) return
      setLocalValues((prev) => (prev ? { ...prev, name } : null))
      onObjectUpdate(selectedObject.id, {
        data: { ...selectedObject.data, name }
      })
    },
    [selectedObject, onObjectUpdate]
  )

  const handleDelete = useCallback(() => {
    if (!selectedObject) return
    if (confirm(`Delete "${selectedObject.data?.name ?? selectedObject.id}"?`)) {
      onObjectDelete(selectedObject.id)
    }
  }, [selectedObject, onObjectDelete])

  const resetTransform = useCallback(() => {
    if (!selectedObject) return
    onObjectUpdate(selectedObject.id, {
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    })
  }, [selectedObject, onObjectUpdate])

  if (!selectedObject || !localValues) {
    return (
      <div className='flex h-full w-80 flex-col border-gray-200 bg-white'>
        <div className='border-b border-gray-200 p-4'>
          <h2 className='font-semibold text-gray-900'>{t3d('properties')}</h2>
        </div>
        <div className='flex flex-1 items-center justify-center p-8'>
          <p className='text-sm text-gray-500'>{t3d('select_object_or_action')}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className='font-semibold text-gray-900'>{selectedObject.data?.name ?? selectedObject.id}</h2>

      <div className='flex-1 space-y-3 overflow-y-auto'>
        <div>
          <label className='text-sm font-medium'>{t3d('component_properties.name')}</label>
          <input
            type='text'
            value={localValues.name}
            onChange={(e) => updateName(e.target.value)}
            className='w-full rounded border px-2 py-1 text-sm'
          />
        </div>

        {/* Position */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>{t3d('component_properties.position')}</label>
          <div className='grid grid-cols-3 gap-2'>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>X</label>
              <input
                type='number'
                step='0.1'
                value={localValues.position.x}
                onChange={(e) => updatePosition('x', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>Y</label>
              <input
                type='number'
                step='0.1'
                value={localValues.position.y}
                onChange={(e) => updatePosition('y', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>Z</label>
              <input
                type='number'
                step='0.1'
                value={localValues.position.z}
                onChange={(e) => updatePosition('z', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>{t3d('component_properties.rotation')}</label>
          <div className='grid grid-cols-3 gap-2'>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>X</label>
              <input
                type='number'
                step='1'
                value={localValues.rotation.x}
                onChange={(e) => updateRotation('x', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>Y</label>
              <input
                type='number'
                step='1'
                value={localValues.rotation.y}
                onChange={(e) => updateRotation('y', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>Z</label>
              <input
                type='number'
                step='1'
                value={localValues.rotation.z}
                onChange={(e) => updateRotation('z', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
          </div>
        </div>

        {/* Scale */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>{t3d('component_properties.scale')}</label>
          <div className='grid grid-cols-3 gap-2'>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>X</label>
              <input
                type='number'
                step='0.1'
                min='0.1'
                value={localValues.scale.x}
                onChange={(e) => updateScale('x', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>Y</label>
              <input
                type='number'
                step='0.1'
                min='0.1'
                value={localValues.scale.y}
                onChange={(e) => updateScale('y', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs text-gray-500'>Z</label>
              <input
                type='number'
                step='0.1'
                min='0.1'
                value={localValues.scale.z}
                onChange={(e) => updateScale('z', e.target.value)}
                className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
              />
            </div>
          </div>
        </div>

        {/* Arms (for connector only) */}
        {selectedObject.category === 'connector' && localValues?.arms && (
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              {t3d('component_properties.connector_arm')}
            </label>
            {Object.entries(localValues.arms).map(([armId, axes]) => (
              <div key={armId} className='mb-4'>
                <div className='mb-1 text-xs font-semibold text-gray-500'>{armId}</div>
                <div className='grid grid-cols-3 gap-2'>
                  {(['x', 'y', 'z'] as const).map((axis) => (
                    <div key={axis}>
                      <label className='mb-1 block text-xs text-gray-400 uppercase'>{axis}</label>
                      <input
                        type='number'
                        step='1'
                        value={axes[axis] ?? ''}
                        onChange={(e) => updateArm(armId, axis, e.target.value)}
                        className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none'
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Object Info */}
        <div className='rounded-lg bg-gray-50 p-3'>
          <h3 className='mb-2 text-sm font-medium text-gray-700'>{t3d('component_properties.object_info')}</h3>
          <div className='space-y-1 text-xs text-gray-600'>
            <div>
              {t3d('component_properties.id')}: <span className='font-mono'>{selectedObject.id}</span>
            </div>
            <div>
              {t3d('component_properties.category')}: <span className='font-mono'>{selectedObject.category}</span>
            </div>
            <div>
              {t3d('component_properties.template')}: <span className='font-mono'>{selectedObject.templateId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-2 border-t p-4'>
        <button onClick={resetTransform} className='w-full rounded border px-3 py-2 text-sm'>
          {t3d('component_properties.reset_transform')}
        </button>
        <button onClick={handleDelete} className='w-full rounded bg-red-600 px-3 py-2 text-sm text-white'>
          {t3d('component_properties.delete')}
        </button>
      </div>
    </div>
  )
}
