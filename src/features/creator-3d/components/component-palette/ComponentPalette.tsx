'use client'

import { useState } from 'react'
import { ComponentTemplate, ComponentType } from '../../types/creator.types'
import Image from 'next/image'
import { ComponentCard } from '@/features/creator-3d/components/component-palette/ComponentCard'

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
    const dragImage = new window.Image()
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
    <div className='flex w-64 flex-col border-r border-gray-200 bg-white'>
      {/* Header */}
      <div className='border-b border-gray-200 p-4'>
        <h2 className='font-semibold text-gray-900'>Components</h2>
        <p className='mt-1 text-xs text-gray-500'>Drag to add, double-click to place</p>
      </div>

      {/* Component List */}
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='space-y-3'>
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
      <div className='border-t border-gray-200 bg-gray-50 p-4'>
        <div className='space-y-1 text-xs text-gray-600'>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-blue-500'></div>
            <span>Drag to add to scene</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-green-500'></div>
            <span>Double-click to place at origin</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-purple-500'></div>
            <span>Select & use gizmo to transform</span>
          </div>
        </div>
      </div>
    </div>
  )
}
