'use client'

import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { useState, useCallback, useEffect } from 'react'

interface ObjectInspectorProps {
  selectedObject: AssemblyInstance | null
  onObjectUpdate: (objectId: string, updates: Partial<AssemblyInstance>) => void
  onObjectDelete: (objectId: string) => void
}

export function ObjectInspector({ selectedObject, onObjectUpdate, onObjectDelete }: ObjectInspectorProps) {
  const [localValues, setLocalValues] = useState<{
    position: { x: string; y: string; z: string }
    rotation: { x: string; y: string; z: string }
    scale: { x: string; y: string; z: string }
    name: string
  } | null>(null)

  // Cập nhật local state khi chọn object mới
  useEffect(() => {
    if (selectedObject) {
      const pos = selectedObject.transform.position
      const rot = selectedObject.transform.rotation
      const scl = selectedObject.transform.scale ?? { x: 1, y: 1, z: 1 }

      setLocalValues({
        position: {
          x: pos.x.toFixed(2),
          y: pos.y.toFixed(2),
          z: pos.z.toFixed(2)
        },
        rotation: {
          x: ((rot.x * 180) / Math.PI).toFixed(1),
          y: ((rot.y * 180) / Math.PI).toFixed(1),
          z: ((rot.z * 180) / Math.PI).toFixed(1)
        },
        scale: {
          x: scl.x.toFixed(2),
          y: scl.y.toFixed(2),
          z: scl.z.toFixed(2)
        },
        name: selectedObject.data?.name ?? selectedObject.id
      })
    } else {
      setLocalValues(null)
    }
  }, [selectedObject])

  // --- Update helpers ---
  const updatePosition = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      if (!selectedObject) return
      setLocalValues((prev) => (prev ? { ...prev, position: { ...prev.position, [axis]: value } } : null))
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        onObjectUpdate(selectedObject.id, {
          transform: {
            ...selectedObject.transform,
            position: { ...selectedObject.transform.position, [axis]: numValue }
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
      <div className='flex w-80 flex-col border-l border-gray-200 bg-white'>
        <div className='border-b border-gray-200 p-4'>
          <h2 className='font-semibold text-gray-900'>Properties</h2>
        </div>
        <div className='flex flex-1 items-center justify-center p-8'>
          <p className='text-sm text-gray-500'>Select an object to edit properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex w-80 flex-col border-l border-gray-200 bg-white'>
      <div className='border-b border-gray-200 p-4'>
        <h2 className='font-semibold text-gray-900'>Properties</h2>
        <span className='text-sm text-gray-600'>
          {selectedObject.category === 'connector' ? '🔴 Connector' : '🟢 Straw'}
        </span>
      </div>

      <div className='flex-1 space-y-6 overflow-y-auto p-4'>
        {/* Name */}
        <div>
          <label className='text-sm font-medium'>Name</label>
          <input
            type='text'
            value={localValues.name}
            onChange={(e) => updateName(e.target.value)}
            className='w-full rounded border px-2 py-1 text-sm'
          />
        </div>

        {/* Position */}
        {/* tương tự Rotation + Scale, giữ nguyên như code trước */}
      </div>

      <div className='space-y-2 border-t p-4'>
        <button onClick={resetTransform} className='w-full rounded border px-3 py-2 text-sm'>
          Reset Transform
        </button>
        <button onClick={handleDelete} className='w-full rounded bg-red-600 px-3 py-2 text-sm text-white'>
          Delete
        </button>
      </div>
    </div>
  )
}
