'use client'

import { useEffect, useState } from 'react'
import { ComponentCard } from '@/features/creator-3d/components/component-palette/ComponentCard'
import { ComponentTemplate } from '@/features/assembly/types/assembly.types'

interface ComponentPaletteProps {
  onDragStart: (template: ComponentTemplate) => void
  onAddComponent: (template: ComponentTemplate) => void
}

export async function loadComponentTemplate(jsonPath: string): Promise<ComponentTemplate> {
  const res = await fetch(jsonPath)
  if (!res.ok) {
    throw new Error(`Failed to load template: ${jsonPath}`)
  }
  const data = await res.json()

  const template: ComponentTemplate = {
    id: data.id,
    name: data.name,
    type: data.category === 'straw' ? 'straw' : 'connector',
    category: data.category,
    description: data.description || '',
    previewImageUrl: `/images/components/${data.id}.png`,
    defaultProperties: {
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      material: {
        type: data.materialRef?.includes('plastic') ? 'plastic' : 'metal',
        color: data.materialRef === 'plastic_green' ? '#c1e500' : '#fff51d',
        flexibility: 0.1,
        opacity: 1,
        roughness: 1,
        metalness: 0
      },
      geometry: data.baseGeometry,
      physics: data.physics
    },
    source: jsonPath
  }

  return template
}

export function ComponentPalette({ onDragStart, onAddComponent }: ComponentPaletteProps) {
  const [templates, setTemplates] = useState<ComponentTemplate[]>([])
  const [draggingTemplate, setDraggingTemplate] = useState<ComponentTemplate | null>(null)

  useEffect(() => {
    async function loadTemplates() {
      try {
        const straw_green = await loadComponentTemplate('/components/templates/StrawTypes/green_11_2.json')
        const straw_yellow = await loadComponentTemplate('/components/templates/StrawTypes/yellow_3_8.json')
        const connector = await loadComponentTemplate('/components/templates/ConnectorTypes/3legs.json')

        setTemplates([straw_green, straw_yellow, connector])
      } catch (err) {
        console.error('Failed to load templates', err)
      }
    }
    loadTemplates()
  }, [])

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    setDraggingTemplate(template)
    onDragStart(template)

    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', template.id)

    const dragImage = new window.Image()
    dragImage.src = template.previewImageUrl || ''
    e.dataTransfer.setDragImage(dragImage, 25, 25)
  }

  const handleDragEnd = () => {
    setDraggingTemplate(null)
  }

  const handleDoubleClick = (template: ComponentTemplate) => {
    onAddComponent(template)
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
          {templates.map((template) => (
            <ComponentCard
              key={template.id}
              template={template}
              isDragging={draggingTemplate?.id === template.id}
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
