'use client'

import { useEffect, useState } from 'react'
import { ComponentCard } from '@/features/creator-3d/components/component-palette/ComponentCard'
import { ComponentTemplate, Connector, Straw } from '@/features/assembly/types/assembly.types'

interface ComponentPaletteProps {
  onDragStart: (template: ComponentTemplate) => void
  onAddComponent: (template: ComponentTemplate) => void
}

// Function to load a component template from a JSON file
// Will be replaced with real data fetching logic later
export async function loadComponentTemplate(jsonPath: string): Promise<ComponentTemplate> {
  const res = await fetch(jsonPath)
  if (!res.ok) throw new Error(`Failed to load template: ${jsonPath}`)
  const data = await res.json()

  const baseTransform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  }

  const baseMaterial = {
    type: data.materialRef?.includes('plastic') ? 'plastic' : 'metal',
    color: data.materialRef === 'plastic_green' ? '#c1e500' : '#fff51d',
    flexibility: 0.1,
    opacity: 1,
    roughness: 1,
    metalness: 0
  }

  let defaultProperties: Straw | Connector

  if (data.category === 'straw') {
    defaultProperties = {
      id: data.id,
      name: data.name,
      transform: baseTransform,
      material: baseMaterial,
      geometry: data.baseGeometry,
      physics: data.physics,
      endpoints: data.endpoints
    } as Straw
  } else if (data.category === 'connector') {
    defaultProperties = {
      id: data.id,
      name: data.name,
      transform: baseTransform,
      material: baseMaterial,
      geometry: data.baseGeometry,
      type: data.type ?? 'connector',
      ports: data.ports ?? [
        {
          id: `${data.id}_port_0`,
          localPosition: { x: 0, y: 0, z: 2 },
          orientation: { x: 0, y: 0, z: 1 },
          connectionId: null,
          isAvailable: true,
          portIndex: 0
        }
      ],
      constraints: data.constraints ?? { maxConnections: 3, allowedAngles: [] },
      modelUrl: data.modelUrl ?? `/models/connector_3legs.glb`
    } as Connector
  } else {
    throw new Error(`Unknown component category: ${data.category}`)
  }

  return {
    id: data.id,
    name: data.name,
    type: data.category === 'straw' ? 'straw' : 'connector',
    category: data.category,
    description: data.description || '',
    previewImageUrl: data.imagePreviewUrl || undefined,
    defaultProperties,
    source: jsonPath
  }
}

export function ComponentPalette({ onDragStart, onAddComponent }: ComponentPaletteProps) {
  const [templates, setTemplates] = useState<ComponentTemplate[]>([])
  const [draggingTemplate, setDraggingTemplate] = useState<ComponentTemplate | null>(null)

  // TODO: Replace with real data fetching logic

  useEffect(() => {
    async function loadTemplates() {
      try {
        const straw_green = await loadComponentTemplate('/components/templates/StrawTypes/green_11_2.json')
        const straw_yellow = await loadComponentTemplate('/components/templates/StrawTypes/yellow_3_8.json')
        const connector = await loadComponentTemplate('/components/templates/ConnectorTypes/3legs.json')
        console.log('Loaded templates:', { straw_green, straw_yellow, connector })

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

  const handleDoubleClick = async (template: ComponentTemplate) => {
    console.log('[ComponentPalette] Double-clicked', template)
    if (template.category === 'connector' && !(template.defaultProperties as any).modelUrl) {
      console.warn(`[handleDoubleClick] Connector ${template.id} chưa có modelUrl, load lại...`)
      return
    }
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
