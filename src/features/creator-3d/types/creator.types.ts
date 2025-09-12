import * as THREE from 'three'

export type ComponentType = 'connector_3leg' | 'straw_green'

export interface SceneObject {
  id: string
  type: ComponentType
  name: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  templateId: string
  created: number
  selected?: boolean
}

export interface CreatorScene {
  objects: SceneObject[]
  selectedObjectId: string | null
  camera: {
    position: { x: number; y: number; z: number }
    target: { x: number; y: number; z: number }
    fov: number
  }
  environment: {
    background: string
    lighting: {
      ambient: string
      directional: {
        color: string
        intensity: number
        position: { x: number; y: number; z: number }
      }
    }
  }
}

export interface ComponentTemplate {
  id: string
  type: ComponentType
  name: string
  description: string
  icon: string
  defaultProps: {
    scale: { x: number; y: number; z: number }
    material?: any
    geometry?: any
  }
  source?: string // Template source path
}

export interface CreatorState {
  scene: CreatorScene
  isDragging: boolean
  dragSource: ComponentTemplate | null
  transformMode: 'translate' | 'rotate' | 'scale'
  snapToGrid: boolean
  gridSize: number
  showGrid: boolean
  showAxes: boolean
}

export interface AssemblyStep {
  id: string
  name: string
  description: string
  actionType: 'show' | 'connect' | 'transform' | 'highlight'
  targetObjects: string[]
  duration: number
  animation?: {
    type: 'appear' | 'move' | 'rotate' | 'fade'
    params: Record<string, any>
  }
}

export interface AssemblyExport {
  metadata: {
    version: string
    created: string
    lastModified: string
    author: string
    description: string
    title: string
  }
  templates: {
    materials: Array<{ id: string; source: string }>
    components: Array<{ id: string; source: string }>
  }
  instances: {
    straws: Array<{
      templateId: string
      instances: Array<{
        id: string
        transform: {
          position: { x: number; y: number; z: number }
          rotation: { x: number; y: number; z: number }
        }
      }>
    }>
    connectors: Array<{
      templateId: string
      instances: Array<{
        id: string
        transform: {
          position: { x: number; y: number; z: number }
          rotation: { x: number; y: number; z: number }
        }
      }>
    }>
  }
  actions: AssemblyStep[]
  activities: Array<{
    id: string
    name: string
    description: string
    difficulty: string
    estimatedTime: number
    steps: Array<{
      actionId: string
      title: string
      description: string
      expectedResult: string
      hints: string[]
    }>
  }>
  scene: {
    environment: {
      background: string
      lighting: {
        ambient: string
        directional: {
          color: string
          intensity: number
          position: { x: number; y: number; z: number }
        }
      }
      camera: {
        position: { x: number; y: number; z: number }
        target: { x: number; y: number; z: number }
        fov: number
      }
    }
  }
}

