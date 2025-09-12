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

interface ComponentCardProps {
  template: ComponentTemplate
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDoubleClick: () => void
}

function ComponentCard({ template, isDragging, onDragStart, onDragEnd, onDoubleClick }: ComponentCardProps) {
  return (
    <div
      className={`relative cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
        isDragging
          ? 'scale-105 border-blue-300 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      } `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={onDoubleClick}
    >
      {/* Component Icon */}
      <div className='flex items-center gap-3'>
        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100'>
          <Image
            src={template.icon}
            alt={template.name}
            width={40}
            height={40}
            className='object-contain'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.src = ''
              target.style.display = 'none'
              const fallbackDiv = document.createElement('div')
              fallbackDiv.className = 'w-8 h-8 bg-gray-300 rounded flex items-center justify-center'
              const span = document.createElement('span')
              span.className = 'text-xs text-gray-600'
              span.textContent = template.type === 'connector_3leg' ? '⚡' : '📏'
              fallbackDiv.appendChild(span)
              target.parentElement?.appendChild(fallbackDiv)
            }}
          />
        </div>

        <div className='min-w-0 flex-1'>
          <h3 className='truncate text-sm font-medium text-gray-900'>{template.name}</h3>
          <p className='mt-1 line-clamp-2 text-xs text-gray-500'>{template.description}</p>
        </div>
      </div>

      {/* Type Badge */}
      <div className='absolute top-2 right-2'>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            template.type === 'connector_3leg' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          } `}
        >
          {template.type === 'connector_3leg' ? 'Connector' : 'Straw'}
        </span>
      </div>

      {/* Drag Overlay */}
      {isDragging && (
        <div className='bg-opacity-20 absolute inset-0 rounded-lg border-2 border-dashed border-blue-400 bg-blue-500' />
      )}
    </div>
  )
}
