import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import {
  Assembly,
  ComponentTemplate,
  Connector,
  ExportedAssembly,
  Straw,
  Transform
} from '@/features/assembly/types/assembly.types'
import { addInstance, setSelectedId } from '@/features/creator-3d/slice/creatorSceneSlice'
import { addTargetToAction } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { RootState } from '@/libs/redux/store'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

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
  let arms: Record<string, { x: number; y: number; z: number }> | undefined = undefined

  if (template.type === 'straw') {
    const strawTemplate = template.defaultProperties as Straw
    const length = strawTemplate.geometry.length

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
    const numArms = connectorTemplate.numArms ?? 3

    arms = {}
    for (let i = 0; i < numArms; i++) {
      arms[`arm_${i + 1}`] = { x: 0, y: 0, z: 0 }
    }
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
      constraints: connectorTemplate.constraints ?? { maxConnections: 3, allowedAngles: [] },
      modelUrl: connectorTemplate.modelUrl ?? `/models/connector_3legs.glb`,
      numArms
    } as Connector
  }

  return {
    id,
    templateId: template.id,
    category: template.type,
    data,
    arms,
    transform: baseTransform,
    isVisible: true,
    distanceToCamera: 0
  }
}

// =============== ADD OBJECT ===============
export function useAddObject() {
  const dispatch = useAppDispatch()
  const selectedActionId = useAppSelector((s) => s.workspaceTree.selectedActionId)
  const actions = useAppSelector((s) => s.workspaceTree.actions)
  const instances = useAppSelector((s) => s.creatorScene.instances)

  const counters = useRef<{ [key: string]: number }>({
    straw: 0,
    connector: 0
  })

  // 🔄 Sync counters với instances hiện có (chạy mỗi khi instances thay đổi)
  useEffect(() => {
    const maxCounters: { [key: string]: number } = {
      straw: 0,
      connector: 0
    }

    instances.forEach((instance) => {
      // Parse ID format: "straw_5" hoặc "connector_3"
      const match = instance.id.match(/^(straw|connector)_(\d+)$/)
      if (match) {
        const [, prefix, numStr] = match
        const num = parseInt(numStr, 10)
        if (!isNaN(num)) {
          maxCounters[prefix] = Math.max(maxCounters[prefix] || 0, num)
        }
      }
    })

    // Cập nhật counters để ID tiếp theo luôn lớn hơn max hiện tại
    counters.current = maxCounters
  }, [instances])

  const generateId = useCallback((prefix: string) => {
    counters.current[prefix] = (counters.current[prefix] ?? 0) + 1
    return `${prefix}_${counters.current[prefix]}`
  }, [])

  return (template: ComponentTemplate, position: { x: number; y: number; z: number }) => {
    // Validation
    if (!selectedActionId) {
      toast.error('⚠️ Please select an Action in Workspace Tree before adding a component.')
      return null
    }

    const act = actions.find((a) => a.id === selectedActionId)
    if (!act) {
      toast.error('⚠️ Please select an Action in Workspace Tree before adding a component.')
      return null
    }

    if (act.type === 'transform_arm' && template.type !== 'connector') {
      toast.error('⚠️ Transform Arm Action chỉ chấp nhận Connector.')
      return null
    }

    // Create instance
    const instance = createInstanceFromTemplate(template, position, generateId)

    // Dispatch actions
    dispatch(addInstance(instance))
    dispatch(setSelectedId(instance.id))
    dispatch(addTargetToAction({ actionId: selectedActionId, targetId: instance.id }))

    return instance.id
  }
}
// ===========================================

export function useSelectedObject() {
  return useAppSelector((state) => {
    const { selectedId, instances } = state.creatorScene
    return instances.find((i) => i.id === selectedId) || null
  })
}

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

export function exportAssembly(
  state: RootState,
  metadata: { title: string; description: string; author: string }
): ExportedAssembly {
  const instances = state.creatorScene.instances
  const now = new Date().toISOString()
  const actions = state.workspaceTree.actions
  const activities = state.workspaceTree.activities
  // Straws
  const straws = instances
    .filter((i) => i.category === 'straw')
    .reduce<Record<string, any[]>>((acc, item) => {
      const templateId = item.templateId
      if (!acc[templateId]) acc[templateId] = []
      acc[templateId].push({
        id: item.id,
        transform: {
          position: item.transform.position,
          rotation: item.transform.rotation,
          scale: item.transform.scale ?? { x: 1, y: 1, z: 1 }
        }
      })
      return acc
    }, {})

  const strawInstances = Object.entries(straws).map(([templateId, instanceList]) => ({
    templateId,
    instances: instanceList
  }))

  const connectors = instances
    .filter((i) => i.category === 'connector')
    .reduce<Record<string, any[]>>((acc, item) => {
      console.log({ item })
      const templateId = item.templateId
      if (!acc[templateId]) acc[templateId] = []
      acc[templateId].push({
        id: item.id,
        transform: {
          position: item.transform.position,
          rotation: item.transform.rotation,
          scale: item.transform.scale ?? { x: 1, y: 1, z: 1 }
        },
        arms: item.arms
      })
      return acc
    }, {})

  const connectorInstances = Object.entries(connectors).map(([templateId, instanceList]) => ({
    templateId,
    instances: instanceList
  }))

  const exportedActions = actions.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    targets: a.targets,
    duration: a.duration,
    ...(a.type === 'highlight' && { animation: a.animation }),
    ...(a.type === 'transform_arm' && {
      connectorArmTransforms: a.connectorArmTransforms,
      interpolation: a.interpolation,
      instantAppear: a.instantAppear
    }),
    ...(a.type === 'rotate_highlight' && { rotationSpeed: a.rotationSpeed })
  }))

  const exportedActivities = activities.map((activity) => ({
    id: activity.id,
    name: activity.name,
    description: activity.description,
    difficulty: activity.difficulty,
    estimatedTime: activity.estimatedTime,
    steps: activity.steps.map((step) => ({
      ...step, // title, description, expectedResult, hints
      actionId: step.actionId // đảm bảo liên kết action
    }))
  }))

  return {
    metadata: {
      ...metadata,
      version: '2.0',
      created: now,
      lastModified: now
    },
    templates: {
      materials: [
        { id: 'plastic_green', source: '/components/templates/MaterialLibrary/plastic_green.json' },
        { id: 'plastic_red', source: '/components/templates/MaterialLibrary/plastic_red.json' },
        { id: 'plastic_blue', source: '/components/templates/MaterialLibrary/plastic_blue.json' },
        { id: 'plastic_yellow', source: '/components/templates/MaterialLibrary/plastic_yellow.json' },
        { id: 'plastic_orange', source: '/components/templates/MaterialLibrary/plastic_orange.json' },
        { id: 'plastic_pink', source: '/components/templates/MaterialLibrary/plastic_pink.json' }
      ],
      components: [
        { id: 'blue_19_0', source: '/components/templates/StrawTypes/blue_19_0.json' },
        { id: 'green_16_2', source: '/components/templates/StrawTypes/green_16_2.json' },
        { id: 'pink_8_9', source: '/components/templates/StrawTypes/pink_8_9.json' },
        { id: 'orange_6_3', source: '/components/templates/StrawTypes/orange_6_3.json' },
        { id: 'yellow_3_8', source: '/components/templates/StrawTypes/yellow_3_8.json' },
        { id: '1leg', source: '/components/templates/ConnectorTypes/1leg.json' },
        { id: '2leg', source: '/components/templates/ConnectorTypes/2legs.json' },
        { id: '3leg', source: '/components/templates/ConnectorTypes/3legs.json' },
        { id: '5leg', source: '/components/templates/ConnectorTypes/5legs.json' }
      ]
    },
    instances: {
      straws: strawInstances,
      connectors: connectorInstances
    },
    actions: exportedActions,
    activities: exportedActivities,
    scene: INITIAL_SCENE
  }
}

export function useExportAssembly() {
  const creatorScene = useAppSelector((s) => s.creatorScene)
  const workspaceTree = useAppSelector((s) => s.workspaceTree)
  return (metadata: { title: string; description: string; author: string }) => {
    return exportAssembly({ creatorScene, workspaceTree } as RootState, metadata)
  }
}
