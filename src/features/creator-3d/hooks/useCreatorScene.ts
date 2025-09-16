'use client'

import { useState, useCallback, useMemo } from 'react'
import { Assembly, ComponentTemplate, Straw, Connector, Transform } from '@/features/assembly/types/assembly.types'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'

const INITIAL_SCENE: Assembly['scene'] = {
  environment: {
    background: '#f5f5f5',
    lighting: {
      ambient: '#404040',
      directional: {
        color: '#FFFFFF',
        intensity: 1.2,
        position: { x: 10, y: 15, z: 8 }
      }
    },
    camera: {
      position: { x: 30, y: 20, z: 30 },
      target: { x: 0, y: 0, z: 0 },
      fov: 60,
      controls: 'orbit'
    }
  },
  workspace: {
    bounds: {
      min: { x: -100, y: -100, z: -100 },
      max: { x: 100, y: 100, z: 100 }
    },
    grid: {
      visible: true,
      size: 1,
      divisions: 100
    }
  }
}

export function createInstanceFromTemplate(
  template: ComponentTemplate,
  position: { x: number; y: number; z: number },
  generateId: (prefix: string) => string
): AssemblyInstance {
  const id = generateId(template.type)

  const baseTransform: Transform = {
    position,
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  }
  let data: Straw | Connector

  // Clone default properties từ template
  // const data: Straw | Connector = {
  //   id,
  //   name: template.name,
  //   transform: baseTransform,
  //   material: template.defaultProperties.material,
  //   geometry: template.defaultProperties.geometry,
  //   ...(template.type === 'straw'
  //     ? {
  //         endpoints: {
  //           start: { id: `${id}_start`, localPosition: { x: -template.defaultProperties., y: 0, z: 0 }, connectionId: null, isAvailable: true },
  //           end: { id: `${id}_end`, localPosition: { x: 5.6, y: 0, z: 0 }, connectionId: null, isAvailable: true }
  //         }
  //       }
  //     : {
  //         type: 'cross',
  //         ports: [
  //           {
  //             id: `${id}_port_0`,
  //             localPosition: { x: 0, y: 0, z: 2 },
  //             orientation: { x: 0, y: 0, z: 1 },
  //             connectionId: null,
  //             isAvailable: true,
  //             portIndex: 0
  //           }
  //         ],
  //         constraints: { maxConnections: 3, allowedAngles: [] }
  //       })
  // } as Straw | Connector

  if (template.type === 'straw') {
    const strawTemplate = template.defaultProperties as Straw
    const length = strawTemplate.geometry.length
    console.log('Creating straw of length', length)

    data = {
      id,
      name: template.name,
      transform: baseTransform,
      material: strawTemplate.material,
      geometry: strawTemplate.geometry,
      endpoints: {
        start: {
          id: `${id}_start`,
          localPosition: { x: -length / 2, y: 0, z: 0 },
          connectionId: null,
          isAvailable: true
        },
        end: {
          id: `${id}_end`,
          localPosition: { x: length / 2, y: 0, z: 0 },
          connectionId: null,
          isAvailable: true
        }
      },
      physics: strawTemplate.physics
    }
  } else {
    const connectorTemplate = template.defaultProperties as Connector

    data = {
      id,
      name: template.name,
      transform: baseTransform,
      material: connectorTemplate.material,
      geometry: connectorTemplate.geometry,
      type: connectorTemplate.type,
      ports: [
        {
          id: `${id}_port_0`,
          localPosition: { x: 0, y: 0, z: 2 },
          orientation: { x: 0, y: 0, z: 1 },
          connectionId: null,
          isAvailable: true,
          portIndex: 0
        }
      ],
      constraints: { maxConnections: 3, allowedAngles: [] }
    }
  }

  return {
    id,
    templateId: template.id,
    category: template.type,
    data,
    transform: baseTransform,
    isVisible: true,
    distanceToCamera: 0
  }
}

export function useCreatorScene() {
  const [instances, setInstances] = useState<AssemblyInstance[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate')
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(1)

  // Generate unique ID
  const generateId = useCallback((prefix: string) => {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  }, [])

  // Add object
  const addObject = useCallback(
    (template: ComponentTemplate, position: { x: number; y: number; z: number }) => {
      const newInstance = createInstanceFromTemplate(template, position, generateId)
      setInstances((prev) => [...prev, newInstance])
      setSelectedId(newInstance.id)
      return newInstance.id
    },
    [generateId]
  )

  const removeObject = useCallback((id: string) => {
    setInstances((prev) => prev.filter((inst) => inst.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
  }, [])

  const updateObject = useCallback((id: string, updates: Partial<AssemblyInstance>) => {
    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === id
          ? {
              ...inst,
              ...updates,
              transform: {
                ...inst.transform,
                ...(updates.transform || {})
              }
            }
          : inst
      )
    )
  }, [])

  const selectObject = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const clearScene = useCallback(() => {
    setInstances([])
    setSelectedId(null)
  }, [])

  const selectedObject = useMemo(() => {
    return instances.find((inst) => inst.id === selectedId) || null
  }, [instances, selectedId])

  // Export ra Assembly chuẩn
  const exportAssembly = useCallback(
    (metadata: { title: string; description: string; author: string }): any => {
      const now = new Date().toISOString()

      // Lấy danh sách straws và nhóm theo templateId
      const straws = instances
        .filter((i) => i.category === 'straw')
        .reduce<Record<string, any[]>>((acc, item) => {
          const templateId = item.templateId
          if (!acc[templateId]) acc[templateId] = []
          acc[templateId].push({
            id: item.id,
            transform: {
              position: item.transform.position,
              rotation: item.transform.rotation
            }
          })
          return acc
        }, {})

      const strawInstances = Object.entries(straws).map(([templateId, instanceList]) => ({
        templateId,
        instances: instanceList
      }))

      // Tương tự nếu có connectors
      const connectors = instances
        .filter((i) => i.category === 'connector')
        .reduce<Record<string, any[]>>((acc, item) => {
          const templateId = item.templateId
          if (!acc[templateId]) acc[templateId] = []
          acc[templateId].push({
            id: item.id,
            transform: {
              position: item.transform.position,
              rotation: item.transform.rotation
            }
          })
          return acc
        }, {})

      const connectorInstances = Object.entries(connectors).map(([templateId, instanceList]) => ({
        templateId,
        instances: instanceList
      }))

      return {
        metadata: {
          version: '2.0',
          created: now,
          lastModified: now,
          author: metadata.author,
          description: metadata.description,
          title: metadata.title
        },
        templates: {
          materials: [
            {
              id: 'plastic_green',
              source: '/components/templates/MaterialLibrary/plastic_green.json'
            },
            {
              id: 'plastic_red',
              source: '/components/templates/MaterialLibrary/plastic_red.json'
            }
          ],
          components: [
            {
              id: 'green_11_2',
              source: '/components/templates/StrawTypes/green_11_2.json'
            },
            {
              id: 'yellow_3_8',
              source: '/components/templates/StrawTypes/yellow_3_8.json'
            },
            {
              id: '3leg_red',
              source: '/components/templates/ConnectorTypes/3leg_red.json'
            }
          ]
        },
        instances: {
          straws: strawInstances,
          connectors: connectorInstances
        },
        actions: [
          {
            id: 'action_show_all',
            name: 'Show All Components',
            description: 'Highlights all components in the scene',
            actionType: 'highlight',
            targets: instances.map((i) => i.id),
            duration: 2,
            type: 'highlight',
            animation: {
              params: {
                colorHighlight: '#FFD700',
                pulseEffect: true
              }
            }
          }
        ],
        activities: [
          {
            id: 'custom_assembly',
            name: metadata.title,
            description: metadata.description,
            difficulty: 'beginner',
            estimatedTime: 600,
            steps: [
              {
                actionId: 'action_show_all',
                title: 'Observe Components',
                description: 'Study the arrangement of straws and connectors',
                expectedResult: 'All components are visible and highlighted',
                hints: [
                  'Notice the positioning of each component',
                  'Observe the relationships between straws and connectors'
                ]
              }
            ]
          }
        ],
        scene: INITIAL_SCENE
      }
    },
    [instances]
  )

  return {
    state: {
      instances,
      selectedId,
      transformMode,
      showGrid,
      showAxes,
      snapToGrid,
      gridSize
    },
    selectedObject,
    addObject,
    removeObject,
    updateObject,
    selectObject,
    setTransformMode,
    toggleGrid: () => setShowGrid((prev) => !prev),
    toggleAxes: () => setShowAxes((prev) => !prev),
    toggleSnapToGrid: () => setSnapToGrid((prev) => !prev),
    setGridSize,
    clearScene,
    exportAssembly
  }
}
