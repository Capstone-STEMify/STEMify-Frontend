'use client'

import { useState, useCallback, useMemo } from 'react'
import { CreatorScene, SceneObject, ComponentType, CreatorState, AssemblyExport } from '../types/creator.types'

const INITIAL_SCENE: CreatorScene = {
  objects: [],
  selectedObjectId: null,
  camera: {
    position: { x: 30, y: 20, z: 30 },
    target: { x: 0, y: 0, z: 0 },
    fov: 60
  },
  environment: {
    background: '#f5f5f5',
    lighting: {
      ambient: '#404040',
      directional: {
        color: '#FFFFFF',
        intensity: 1.2,
        position: { x: 10, y: 15, z: 8 }
      }
    }
  }
}

const INITIAL_STATE: CreatorState = {
  scene: INITIAL_SCENE,
  isDragging: false,
  dragSource: null,
  transformMode: 'translate',
  snapToGrid: true,
  gridSize: 1,
  showGrid: true,
  showAxes: true
}

export function useCreatorScene() {
  const [state, setState] = useState<CreatorState>(INITIAL_STATE)

  // Generate unique ID for new objects
  const generateObjectId = useCallback(
    (type: ComponentType): string => {
      const timestamp = Date.now()
      const count = state.scene.objects.filter((obj) => obj.type === type).length + 1
      return `${type}_${count}_${timestamp}`
    },
    [state.scene.objects]
  )

  // Add object to scene
  const addObject = useCallback(
    (type: ComponentType, position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }) => {
      const newObject: SceneObject = {
        id: generateObjectId(type),
        type,
        name: `${type} ${state.scene.objects.length + 1}`,
        position,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        templateId: type === 'connector_3leg' ? '3leg_red' : 'green_11_2',
        created: Date.now()
      }

      setState((prev) => ({
        ...prev,
        scene: {
          ...prev.scene,
          objects: [...prev.scene.objects, newObject],
          selectedObjectId: newObject.id
        }
      }))

      return newObject.id
    },
    [generateObjectId, state.scene.objects.length]
  )

  // Remove object from scene
  const removeObject = useCallback((objectId: string) => {
    setState((prev) => ({
      ...prev,
      scene: {
        ...prev.scene,
        objects: prev.scene.objects.filter((obj) => obj.id !== objectId),
        selectedObjectId: prev.scene.selectedObjectId === objectId ? null : prev.scene.selectedObjectId
      }
    }))
  }, [])

  // Update object properties
  const updateObject = useCallback((objectId: string, updates: Partial<SceneObject>) => {
    setState((prev) => ({
      ...prev,
      scene: {
        ...prev.scene,
        objects: prev.scene.objects.map((obj) => (obj.id === objectId ? { ...obj, ...updates } : obj))
      }
    }))
  }, [])

  // Select object
  const selectObject = useCallback((objectId: string | null) => {
    setState((prev) => ({
      ...prev,
      scene: {
        ...prev.scene,
        selectedObjectId: objectId
      }
    }))
  }, [])

  // Update transform mode
  const setTransformMode = useCallback((mode: 'translate' | 'rotate' | 'scale') => {
    setState((prev) => ({ ...prev, transformMode: mode }))
  }, [])

  // Toggle grid
  const toggleGrid = useCallback(() => {
    setState((prev) => ({ ...prev, showGrid: !prev.showGrid }))
  }, [])

  // Toggle axes
  const toggleAxes = useCallback(() => {
    setState((prev) => ({ ...prev, showAxes: !prev.showAxes }))
  }, [])

  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setState((prev) => ({ ...prev, snapToGrid: !prev.snapToGrid }))
  }, [])

  // Set grid size
  const setGridSize = useCallback((size: number) => {
    setState((prev) => ({ ...prev, gridSize: size }))
  }, [])

  // Clear scene
  const clearScene = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scene: {
        ...prev.scene,
        objects: [],
        selectedObjectId: null
      }
    }))
  }, [])

  // Get selected object
  const selectedObject = useMemo(() => {
    return state.scene.objects.find((obj) => obj.id === state.scene.selectedObjectId) || null
  }, [state.scene.objects, state.scene.selectedObjectId])

  // Export scene to assembly JSON
  const exportAssembly = useCallback(
    (metadata: { title: string; description: string; author: string }): AssemblyExport => {
      const now = new Date().toISOString()

      // Group objects by type
      const strawInstances = state.scene.objects
        .filter((obj) => obj.type === 'straw_green')
        .map((obj) => ({
          id: obj.id,
          transform: {
            position: obj.position,
            rotation: obj.rotation
          }
        }))

      const connectorInstances = state.scene.objects
        .filter((obj) => obj.type === 'connector_3leg')
        .map((obj) => ({
          id: obj.id,
          transform: {
            position: obj.position,
            rotation: obj.rotation
          }
        }))

      // Create basic actions for showing objects
      const actions = [
        {
          id: 'action_show_all',
          name: 'Show All Components',
          description: 'Highlights all components in the scene',
          actionType: 'highlight' as const,
          targetObjects: state.scene.objects.map((obj) => obj.id),
          duration: 2.0,
          animation: {
            type: 'appear' as const,
            params: {
              colorHighlight: '#FFD700',
              pulseEffect: true
            }
          }
        }
      ]

      // Create basic activity
      const activities = [
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
      ]

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
            { id: 'plastic_green', source: '/components/templates/MaterialLibrary/plastic_green.json' },
            { id: 'plastic_red', source: '/components/templates/MaterialLibrary/plastic_red.json' }
          ],
          components: [
            { id: 'green_11_2', source: '/components/templates/StrawTypes/green_11_2.json' },
            { id: '3leg_red', source: '/components/templates/ConnectorTypes/3leg_red.json' }
          ]
        },
        instances: {
          straws:
            strawInstances.length > 0
              ? [
                  {
                    templateId: 'green_11_2',
                    instances: strawInstances
                  }
                ]
              : [],
          connectors:
            connectorInstances.length > 0
              ? [
                  {
                    templateId: '3leg_red',
                    instances: connectorInstances
                  }
                ]
              : []
        },
        actions,
        activities,
        scene: {
          environment: {
            ...state.scene.environment,
            camera: state.scene.camera
          }
        }
      }
    },
    [state.scene]
  )

  return {
    // State
    state,
    selectedObject,

    // Actions
    addObject,
    removeObject,
    updateObject,
    selectObject,
    setTransformMode,
    toggleGrid,
    toggleAxes,
    toggleSnapToGrid,
    setGridSize,
    clearScene,
    exportAssembly
  }
}
