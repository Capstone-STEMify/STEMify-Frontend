'use client'

import { useState } from 'react'
import { ComponentTemplate, ComponentType } from '../types/creator.types'
import Image from 'next/image'

interface ComponentPaletteProps {
  onDragStart: (template: ComponentTemplate) => void
  onAddComponent: (type: ComponentType) => void
}

const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    id: '3leg_red',
    type: 'connector_3leg',
    name: '3-Leg Connector',
    description: 'Red 3-way connector for joining straws',
    icon: '/images/components/connector_3_leg.png',
    defaultProps: {
      scale: { x: 1, y: 1, z: 1 }
    },
    source: '/components/templates/ConnectorTypes/3leg_red.json'
  },
  {
    id: 'green_11_2',
    type: 'straw_green',
    name: 'Green Straw',
    description: 'Green straw segment for building structures',
    icon: '/images/components/straw_green.png',
    defaultProps: {
      scale: { x: 1, y: 1, z: 1 }
    },
    source: '/components/templates/StrawTypes/green_11_2.json'
  }
]

export function ComponentPalette({ onDragStart, onAddComponent }: ComponentPaletteProps) {
  const [draggedTemplate, setDraggedTemplate] = useState<ComponentTemplate | null>(null)

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    setDraggedTemplate(template)
    onDragStart(template)
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', template.id)
    
    // Create drag image
    const dragImage = new Image()
    dragImage.src = template.icon
    e.dataTransfer.setDragImage(dragImage, 25, 25)
  }

  const handleDragEnd = () => {
    setDraggedTemplate(null)
  }

  const handleDoubleClick = (template: ComponentTemplate) => {
    onAddComponent(template.type)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Components</h2>
        <p className="text-xs text-gray-500 mt-1">Drag to add, double-click to place</p>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {COMPONENT_TEMPLATES.map((template) => (
            <ComponentCard
              key={template.id}
              template={template}
              isDragging={draggedTemplate?.id === template.id}
              onDragStart={(e) => handleDragStart(e, template)}
              onDragEnd={handleDragEnd}
              onDoubleClick={() => handleDoubleClick(template)}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Drag to add to scene</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Double-click to place at origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Select & use gizmo to transform</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ComponentCardProps {
  template: ComponentTemplate
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDoubleClick: () => void
}

function ComponentCard({ 
  template, 
  isDragging, 
  onDragStart, 
  onDragEnd, 
  onDoubleClick 
}: ComponentCardProps) {
  return (
    <div
      className={`
        relative p-3 border rounded-lg cursor-pointer transition-all duration-200
        ${isDragging 
          ? 'border-blue-300 bg-blue-50 shadow-lg scale-105' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={onDoubleClick}
    >
      {/* Component Icon */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
          <Image
            src={template.icon}
            alt={template.name}
            width={40}
            height={40}
            className="object-contain"
            fallback={
              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {template.type === 'connector_3leg' ? '⚡' : '📏'}
                </span>
              </div>
            }
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-gray-900 truncate">
            {template.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>

      {/* Type Badge */}
      <div className="absolute top-2 right-2">
        <span className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${template.type === 'connector_3leg' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
          }
        `}>
          {template.type === 'connector_3leg' ? 'Connector' : 'Straw'}
        </span>
      </div>

      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg border-2 border-blue-400 border-dashed" />
      )}
    </div>
  )
}

