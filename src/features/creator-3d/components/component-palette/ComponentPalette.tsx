'use client'

import { useEffect, useState } from 'react'
import { ComponentCard } from '@/features/creator-3d/components/component-palette/ComponentCard'
import { ComponentTemplate, Connector, Material, Straw } from '@/features/assembly/types/assembly.types'
import { useGLTF } from '@react-three/drei'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setDraggingTemplate } from '@/features/creator-3d/slice/creatorSceneSlice'
import { useTranslations } from 'next-intl'

interface ComponentPaletteProps {
  onAddComponent: (template: ComponentTemplate) => void
}

async function loadMaterialByRef(materialRef?: string): Promise<Material> {
  // Fallback tối thiểu nếu thiếu materialRef hoặc lỗi fetch
  const fallback: Material = {
    id: 'default_plastic',
    name: 'Default Plastic',
    type: 'plastic',
    properties: {
      color: '#ffffff',
      flexibility: 0.1,
      opacity: 1,
      roughness: 1,
      metalness: 0
    }
  }

  if (!materialRef) return fallback

  const materialPath = `/components/templates/MaterialLibrary/${materialRef}.json`
  try {
    const res = await fetch(materialPath)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const m = await res.json()

    return {
      id: m.id ?? materialRef,
      name: m.name,
      type: m.type ?? 'plastic',
      properties: {
        color: m.properties?.color ?? '#000000',
        flexibility: m.properties?.flexibility,
        opacity: m.properties?.opacity ?? 1,
        roughness: m.properties?.roughness ?? 1,
        metalness: m.properties?.metalness ?? 0,
        transmission: m.properties?.transmission ?? 0,
        ior: m.properties?.ior ?? 1.5,
        thickness: m.properties?.thickness ?? 0.1
      },
      physics: m.physics
    }
  } catch (e) {
    console.warn(`[material] Failed to load ${materialPath}`, e)
    return fallback
  }
}

export async function loadComponentTemplate(jsonPath: string): Promise<ComponentTemplate> {
  const res = await fetch(jsonPath)
  if (!res.ok) throw new Error(`Failed to load template: ${jsonPath}`)
  const data = await res.json()
  const loadedMaterial = await loadMaterialByRef(data.materialRef)

  const baseTransform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  }

  // const baseMaterial = {
  //   type: data.materialRef?.includes('plastic') ? 'plastic' : 'metal',
  //   properties: {
  //     color: data.materialRef === 'plastic_green' ? '#c1e500' : '#fff51d',
  //     flexibility: 0.1,
  //     opacity: 1,
  //     roughness: 1,
  //     metalness: 0
  //   }
  // }

  let defaultProperties: Straw | Connector

  if (data.category === 'straw') {
    defaultProperties = {
      id: data.id,
      name: data.name,
      transform: baseTransform,
      material: loadedMaterial,
      geometry: data.baseGeometry,
      physics: data.physics,
      endpoints: data.endpoints
    } as Straw
  } else if (data.category === 'connector') {
    defaultProperties = {
      id: data.id,
      name: data.name,
      transform: baseTransform,
      material: loadedMaterial,
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
      constraints: data.constraints ?? {
        maxConnections: data.ports ? data.ports.length : 1,
        allowedAngles: []
      },
      modelUrl: data.modelUrl ?? data.baseGeometry?.modelPath ?? `/models/${data.id}.glb`
    } as Connector

    if (data.modelUrl || data.baseGeometry?.modelPath) {
      const url = data.modelUrl ?? data.baseGeometry.modelPath
      useGLTF.preload(url)
      ;(defaultProperties as Connector).modelUrl = url
    }
  } else {
    throw new Error(`Unknown component category: ${data.category}`)
  }

  return {
    id: data.id,
    name: data.name,
    shortName: data.shortName || data.name,
    type: data.category === 'straw' ? 'straw' : 'connector',
    category: data.category,
    description: data.description || '',
    previewImageUrl: data.imagePreviewUrl || undefined,
    defaultProperties,
    source: jsonPath
  }
}

export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const t3d = useTranslations('creator3D.left_panel')
  const [templates, setTemplates] = useState<ComponentTemplate[]>([])
  const dispatch = useAppDispatch()
  const draggingTemplate = useAppSelector((s) => s.creatorScene.draggingTemplate)

  useEffect(() => {
    async function loadTemplates() {
      try {
        // STRAWS
        const straw_blue = await loadComponentTemplate('/components/templates/StrawTypes/blue_19_0.json')
        const straw_green = await loadComponentTemplate('/components/templates/StrawTypes/green_16_2.json')
        const straw_pink = await loadComponentTemplate('/components/templates/StrawTypes/pink_8_9.json')
        const straw_orange = await loadComponentTemplate('/components/templates/StrawTypes/orange_6_3.json')
        const straw_yellow = await loadComponentTemplate('/components/templates/StrawTypes/yellow_3_8.json')

        // CONNECTORS
        const connector_1leg_red = await loadComponentTemplate('/components/templates/ConnectorTypes/1leg.json')
        const connector_2leg_blue = await loadComponentTemplate('/components/templates/ConnectorTypes/2legs.json')
        const connector_3leg_red = await loadComponentTemplate('/components/templates/ConnectorTypes/3legs.json')
        const connector_5leg_red = await loadComponentTemplate('/components/templates/ConnectorTypes/5legs.json')

        const templateMap: Record<string, ComponentTemplate> = {
          // Straws
          [straw_blue.id]: straw_blue,
          [straw_green.id]: straw_green,
          [straw_pink.id]: straw_pink,
          [straw_orange.id]: straw_orange,
          [straw_yellow.id]: straw_yellow,

          // Connectors
          [connector_1leg_red.id]: connector_1leg_red,
          [connector_2leg_blue.id]: connector_2leg_blue,
          [connector_3leg_red.id]: connector_3leg_red,
          [connector_5leg_red.id]: connector_5leg_red
        }

        setTemplates(Object.values(templateMap))
      } catch (err) {
        console.error('Failed to load templates', err)
      }
    }
    loadTemplates()
  }, [])

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    dispatch(setDraggingTemplate(template))

    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', template.id)

    const dragImage = new window.Image()
    dragImage.src = template.previewImageUrl || ''
    e.dataTransfer.setDragImage(dragImage, 25, 25)
  }

  const handleDoubleClick = (template: ComponentTemplate) => {
    if (template.category === 'connector') {
      const connectorTemplate = template.defaultProperties as Connector
      if (!connectorTemplate.modelUrl && !connectorTemplate.geometry?.modelPath) {
        console.warn(`[handleDoubleClick] Connector ${template.id} chưa có modelUrl`)
        return
      }
    }
    onAddComponent(template)
  }
  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='border-b border-gray-200 p-4'>
        <h2 className='font-semibold text-gray-900'>{t3d('title')}</h2>
        <p className='mt-1 text-xs text-gray-500'>{t3d('subtitle')}</p>
      </div>

      {/* Component List chiếm hết phần còn lại */}
      <div className='flex-1 overflow-y-auto p-4'>
        <div>
          <p className='font-semibold text-gray-900'>{t3d('straw')}</p>
          <div className='grid grid-cols-2 gap-4'>
            {templates
              .filter((template) => template.category === 'straw')
              .map((template) => (
                <ComponentCard
                  key={template.id}
                  template={template}
                  isDragging={draggingTemplate?.id === template.id}
                  onDragStart={(e) => handleDragStart(e, template)}
                  onDoubleClick={() => handleDoubleClick(template)}
                />
              ))}
          </div>
        </div>

        <div className='mt-6'>
          <p className='font-semibold text-gray-900'>{t3d('connector')}</p>
          <div className='grid grid-cols-2 gap-4'>
            {templates
              .filter((template) => template.category === 'connector')
              .map((template) => (
                <ComponentCard
                  key={template.id}
                  template={template}
                  isDragging={draggingTemplate?.id === template.id}
                  onDragStart={(e) => handleDragStart(e, template)}
                  onDoubleClick={() => handleDoubleClick(template)}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Instructions nằm cuối, cao theo nội dung */}
      <div className='border-t border-gray-200 bg-gray-50 p-4'>
        <div className='space-y-1 text-xs text-gray-600'>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-blue-500'></div>
            <span>{t3d('drag_guide')}</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-green-500'></div>
            <span>{t3d('double_click_guide')}</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-purple-500'></div>
            <span>{t3d('select_guide')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
