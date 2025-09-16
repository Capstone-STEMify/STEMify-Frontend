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
  console.log('ObjectInspector render', selectedObject?.transform)

  // Cập nhật local state khi chọn object mới
  // useEffect(() => {
  //   if (!selectedObject) return
  //   const { position, rotation, scale } = selectedObject.transform
  //   console.log('position', position)

  //   setLocalValues({
  //     position: {
  //       x: selectedObject.transform.position.x.toFixed(2),
  //       y: selectedObject.transform.position.y.toFixed(2),
  //       z: selectedObject.transform.position.z.toFixed(2)
  //     },
  //     rotation: {
  //       x: ((selectedObject.transform.rotation.x * 180) / Math.PI).toFixed(1),
  //       y: ((selectedObject.transform.rotation.y * 180) / Math.PI).toFixed(1),
  //       z: ((selectedObject.transform.rotation.z * 180) / Math.PI).toFixed(1)
  //     },
  //     scale: {
  //       x: (selectedObject.transform.scale?.x ?? 1).toFixed(2),
  //       y: (selectedObject.transform.scale?.y ?? 1).toFixed(2),
  //       z: (selectedObject.transform.scale?.z ?? 1).toFixed(2)
  //     },
  //     name: selectedObject.data?.name ?? selectedObject.id
  //   })
  // }, [selectedObject?.transform])

  // --- Update helpers ---
  const updatePosition = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      if (!selectedObject) return

      // Cập nhật local UI
      setLocalValues((prev) => (prev ? { ...prev, position: { ...prev.position, [axis]: value } } : null))

      // Cập nhật scene ngay lập tức
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        onObjectUpdate(selectedObject.id, {
          transform: {
            ...selectedObject.transform,
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
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Position</label>
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
          <label className='mb-2 block text-sm font-medium text-gray-700'>Rotation (degrees)</label>
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
          <label className='mb-2 block text-sm font-medium text-gray-700'>Scale</label>
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

        {/* Object Info */}
        <div className='rounded-lg bg-gray-50 p-3'>
          <h3 className='mb-2 text-sm font-medium text-gray-700'>Object Info</h3>
          <div className='space-y-1 text-xs text-gray-600'>
            <div>
              ID: <span className='font-mono'>{selectedObject.id}</span>
            </div>
            <div>
              Category: <span className='font-mono'>{selectedObject.category}</span>
            </div>
            <div>
              Template: <span className='font-mono'>{selectedObject.templateId}</span>
            </div>
          </div>
        </div>
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
