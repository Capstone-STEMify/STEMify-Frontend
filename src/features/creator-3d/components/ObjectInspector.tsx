'use client'

import { useState, useCallback, useEffect } from 'react'
import { SceneObject } from '../types/creator.types'

interface ObjectInspectorProps {
  selectedObject: SceneObject | null
  onObjectUpdate: (objectId: string, updates: Partial<SceneObject>) => void
  onObjectDelete: (objectId: string) => void
}

export function ObjectInspector({ 
  selectedObject, 
  onObjectUpdate, 
  onObjectDelete 
}: ObjectInspectorProps) {
  const [localValues, setLocalValues] = useState<{
    position: { x: string; y: string; z: string }
    rotation: { x: string; y: string; z: string }
    scale: { x: string; y: string; z: string }
    name: string
  } | null>(null)

  // Update local values when selected object changes
  useEffect(() => {
    if (selectedObject) {
      setLocalValues({
        position: {
          x: selectedObject.position.x.toFixed(2),
          y: selectedObject.position.y.toFixed(2),
          z: selectedObject.position.z.toFixed(2)
        },
        rotation: {
          x: (selectedObject.rotation.x * 180 / Math.PI).toFixed(1),
          y: (selectedObject.rotation.y * 180 / Math.PI).toFixed(1),
          z: (selectedObject.rotation.z * 180 / Math.PI).toFixed(1)
        },
        scale: {
          x: selectedObject.scale.x.toFixed(2),
          y: selectedObject.scale.y.toFixed(2),
          z: selectedObject.scale.z.toFixed(2)
        },
        name: selectedObject.name
      })
    } else {
      setLocalValues(null)
    }
  }, [selectedObject])

  const updatePosition = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    if (!selectedObject) return
    
    setLocalValues(prev => prev ? {
      ...prev,
      position: { ...prev.position, [axis]: value }
    } : null)

    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      onObjectUpdate(selectedObject.id, {
        position: {
          ...selectedObject.position,
          [axis]: numValue
        }
      })
    }
  }, [selectedObject, onObjectUpdate])

  const updateRotation = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    if (!selectedObject) return
    
    setLocalValues(prev => prev ? {
      ...prev,
      rotation: { ...prev.rotation, [axis]: value }
    } : null)

    const numValue = parseFloat(value) * Math.PI / 180 // Convert degrees to radians
    if (!isNaN(numValue)) {
      onObjectUpdate(selectedObject.id, {
        rotation: {
          ...selectedObject.rotation,
          [axis]: numValue
        }
      })
    }
  }, [selectedObject, onObjectUpdate])

  const updateScale = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    if (!selectedObject) return
    
    setLocalValues(prev => prev ? {
      ...prev,
      scale: { ...prev.scale, [axis]: value }
    } : null)

    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      onObjectUpdate(selectedObject.id, {
        scale: {
          ...selectedObject.scale,
          [axis]: numValue
        }
      })
    }
  }, [selectedObject, onObjectUpdate])

  const updateName = useCallback((name: string) => {
    if (!selectedObject) return
    
    setLocalValues(prev => prev ? { ...prev, name } : null)
    onObjectUpdate(selectedObject.id, { name })
  }, [selectedObject, onObjectUpdate])

  const handleDelete = useCallback(() => {
    if (!selectedObject) return
    
    if (confirm(`Are you sure you want to delete "${selectedObject.name}"?`)) {
      onObjectDelete(selectedObject.id)
    }
  }, [selectedObject, onObjectDelete])

  const resetTransform = useCallback(() => {
    if (!selectedObject) return
    
    onObjectUpdate(selectedObject.id, {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    })
  }, [selectedObject, onObjectUpdate])

  if (!selectedObject || !localValues) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm">Select an object to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Properties</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-3 h-3 rounded-full ${
            selectedObject.type === 'connector_3leg' ? 'bg-red-500' : 'bg-green-500'
          }`} />
          <span className="text-sm text-gray-600">
            {selectedObject.type === 'connector_3leg' ? 'Connector' : 'Straw'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={localValues.name}
              onChange={(e) => updateName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input
                  type="number"
                  step="0.1"
                  value={localValues.position.x}
                  onChange={(e) => updatePosition('x', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={localValues.position.y}
                  onChange={(e) => updatePosition('y', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Z</label>
                <input
                  type="number"
                  step="0.1"
                  value={localValues.position.z}
                  onChange={(e) => updatePosition('z', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation (degrees)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input
                  type="number"
                  step="1"
                  value={localValues.rotation.x}
                  onChange={(e) => updateRotation('x', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input
                  type="number"
                  step="1"
                  value={localValues.rotation.y}
                  onChange={(e) => updateRotation('y', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Z</label>
                <input
                  type="number"
                  step="1"
                  value={localValues.rotation.z}
                  onChange={(e) => updateRotation('z', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Scale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={localValues.scale.x}
                  onChange={(e) => updateScale('x', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={localValues.scale.y}
                  onChange={(e) => updateScale('y', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Z</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={localValues.scale.z}
                  onChange={(e) => updateScale('z', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Object Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Object Info</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>ID: <span className="font-mono">{selectedObject.id}</span></div>
              <div>Type: <span className="font-mono">{selectedObject.type}</span></div>
              <div>Template: <span className="font-mono">{selectedObject.templateId}</span></div>
              <div>Created: {new Date(selectedObject.created).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={resetTransform}
          className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset Transform
        </button>
        <button
          onClick={handleDelete}
          className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete Object
        </button>
      </div>
    </div>
  )
}
