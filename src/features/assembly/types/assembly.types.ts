// New standardized types based on backend schema

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Transform {
  position: Vector3
  rotation: Vector3
  scale: Vector3
}

export interface MaterialProperties {
  color: string // #RRGGBB
  flexibility: number // 0-100
  opacity: number // 0-1
  roughness: number // 0-1
  metalness: number // 0-1
  transmission?: number // 0-1 (glass-like)
  ior?: number // Index of refraction
  thickness?: number // thickness for transmission
}

export interface MaterialPhysics {
  friction: number
  elasticity: number
  density?: number
}

export interface MaterialLOD {
  high?: Record<string, any>
  medium?: Record<string, any>
  low?: Record<string, any>
}

export interface MaterialStreaming {
  priority: number
  chunkSize: 'small' | 'medium' | 'large'
  compressionLevel: number
}

export interface Material {
  id?: string
  name?: string
  version?: string
  type: 'plastic' | 'rubber' | 'metal' | 'wood' | 'tpu'
  properties: MaterialProperties
  physics?: MaterialPhysics
  lod?: MaterialLOD
  streaming?: MaterialStreaming
}

export interface Physics {
  mass: number
  friction: number
  elasticity: number // 0-1
}

// Base component interface
export interface BaseComponent {
  id: string
  name: string
  transform: Transform
  material: Material
}

// Straw interfaces
export interface StrawGeometry {
  length: number
  diameter: number
  wallThickness: number
}

export interface StrawEndpoint {
  id: string
  localPosition: Vector3
  connectionId: string | null
  isAvailable: boolean
}

export interface StrawEndpoints {
  start: StrawEndpoint
  end: StrawEndpoint
}

export interface Straw extends BaseComponent {
  geometry: StrawGeometry
  endpoints: StrawEndpoints
  physics?: Physics
}

// Connector interfaces
export interface ConnectorGeometry {
  size: Vector3
  portDiameter: number
  shape: 'cylindrical' | 'cubic' | 'spherical' | 'custom'
  modelPath?: string
}

export interface ConnectorPort {
  id: string
  localPosition: Vector3
  orientation: Vector3
  connectionId: string | null
  isAvailable: boolean
  portIndex: number
}

export interface ConnectorConstraints {
  maxConnections: number
  allowedAngles: number[]
}

export interface Connector extends BaseComponent {
  type: 'straight' | 'elbow' | 'tee' | 'cross' | 'custom'
  geometry: ConnectorGeometry
  ports: ConnectorPort[]
  constraints: ConnectorConstraints
  modelUrl?: string
  numArms?: number
}

// Joint interfaces
export interface JointComponent {
  componentId: string
  componentType: 'straw' | 'connector'
  attachmentPointId: string
}

export interface JointConstraints {
  allowRotation: Vector3
  allowTranslation: Vector3
  limits?: {
    rotation?: {
      min: Vector3
      max: Vector3
    }
    translation?: {
      min: Vector3
      max: Vector3
    }
  }
}

export interface Joint {
  id: string
  type: 'fixed' | 'hinged' | 'ball' | 'slider'
  componentA: JointComponent
  componentB: JointComponent
  constraints?: JointConstraints
  strength?: number // 0-100
  created: string // ISO date
}

// Action interfaces
export interface ActionParameters {
  duration: number
  delay: number
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  loop: boolean
  autoReverse?: boolean
}

export interface ActionKeyframe {
  time: number // 0-1
  transform?: Transform
  material?: Material
}

export interface ActionAnimation {
  keyframes: ActionKeyframe[]
  interpolation: 'linear' | 'cubic' | 'step'
}

export interface ActionTrigger {
  event: 'click' | 'hover' | 'collision' | 'time' | 'completion'
  condition?: string
  nextActionId?: string | null
}

export interface Action {
  id: string
  name: string
  type: 'move' | 'rotate' | 'scale' | 'connect' | 'disconnect' | 'highlight' | 'animate'
  targetId: string
  targetType: 'straw' | 'connector' | 'joint' | 'group'
  parameters?: ActionParameters
  animation?: ActionAnimation
  triggers?: ActionTrigger[]
  order: number
}

// Activity interfaces
export interface ActivityStepValidation {
  type: 'position' | 'connection' | 'structure' | 'custom'
  criteria: Record<string, any>
}

export interface ActivityStep {
  id: string
  order: number
  title: string
  description?: string
  actionIds: string[]
  expectedResult?: string
  hints?: string[]
  validation?: ActivityStepValidation
}

export interface PlaybackControls {
  allowRewind: boolean
  allowPause: boolean
  allowSkip: boolean
  speed: number // 0.1-5.0
}

export interface Activity {
  id: string
  name: string
  description?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // seconds
  objectives: string[]
  steps: ActivityStep[]
  playbackControls?: PlaybackControls
}

// Scene interfaces
export interface SceneLighting {
  ambient: string // color
  directional: {
    color: string
    intensity: number
    position: Vector3
  }
}

export interface SceneCamera {
  position: Vector3
  target: Vector3
  fov: number
  controls: 'orbit' | 'fly' | 'first-person'
}

export interface SceneEnvironment {
  background: string // color
  lighting: SceneLighting
  camera: SceneCamera
}

export interface WorkspaceGrid {
  visible: boolean
  size: number
  divisions: number
}

export interface WorkspaceBounds {
  min: Vector3
  max: Vector3
}

export interface Workspace {
  bounds: WorkspaceBounds
  grid: WorkspaceGrid
}

export interface Scene {
  environment: SceneEnvironment
  workspace: Workspace
}

// Main assembly interface
export interface AssemblyMetadata {
  version: string
  created: string // ISO date
  lastModified?: string // ISO date
  author: string
  description: string
}

export interface Assembly {
  metadata: AssemblyMetadata
  straws: Straw[]
  connectors: Connector[]
  joints: Joint[]
  actions: Action[]
  activities: Activity[]
  scene: Scene
}

// Component library types
export interface ComponentTemplate {
  id: string
  name: string
  shortName: string
  type: 'straw' | 'connector'
  category: string
  description: string
  defaultProperties: Straw | Connector
  previewImageUrl?: string
  source?: string
  modelUrl?: string
}

export interface ComponentLibrary {
  straws: ComponentTemplate[]
  connectors: ComponentTemplate[]
}

// Builder/Editor types
export interface BuilderState {
  currentAssembly: Assembly | null
  selectedComponents: string[]
  viewMode: 'builder' | 'player'
  currentStep: number
  isPlaying: boolean
  isDirty: boolean
}

export interface PlayerState {
  assembly: Assembly | null
  currentActivity: Activity | null
  currentStep: number
  isPlaying: boolean
  playbackSpeed: number
  progress: Record<string, boolean>
}

// Validation types
export interface ValidationError {
  type: 'error' | 'warning'
  message: string
  componentId?: string
  location?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

// API types
export interface CreateAssemblyRequest {
  name: string
  description?: string
  assembly: Assembly
}

export interface UpdateAssemblyRequest {
  id: string
  updates: Partial<Assembly>
}

export interface AssemblyFilters {
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  category?: string
  search?: string
  tags?: string[]
}

export interface ComponentFilters {
  type?: 'straw' | 'connector'
  category?: string
  search?: string
}

// Utility types
export type ComponentType = Straw | Connector
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'failed'
export type ConnectionStatus = 'available' | 'connected' | 'blocked'

// Props types for components
export interface Assembly3DProps {
  assembly: Assembly
  currentStep?: number
  showDebug?: boolean
  interactive?: boolean
  onComponentSelect?: (componentId: string) => void
  onStepComplete?: (stepId: string) => void
}

export interface Straw3DProps {
  straw: Straw
  isSelected?: boolean
  isHighlighted?: boolean
  showEndpoints?: boolean
  onSelect?: (strawId: string) => void
}

export interface Connector3DProps {
  connector: Connector
  isSelected?: boolean
  isHighlighted?: boolean
  showPorts?: boolean
  animate?: boolean
  modelUrl?: string
  modelScale?: [number, number, number] | number
  rotationOffset?: [number, number, number]
  showDebug?: boolean
  onSelect?: (connectorId: string) => void
}

export interface PortVisualizerProps {
  ports: ConnectorPort[]
  visible?: boolean
  interactive?: boolean
  onPortClick?: (portId: string) => void
}

export interface ConnectionVisualizerProps {
  joints: Joint[]
  straws: Straw[]
  connectors: Connector[]
  visible?: boolean
  animated?: boolean
}

// ============== Exported assembly format ==============
export interface ExportedInstance {
  id: string
  transform: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
  }
}

export interface ExportedAssembly {
  metadata: AssemblyMetadata
  templates: {
    materials: { id: string; source: string }[]
    components: { id: string; source: string }[]
  }
  instances: {
    straws: { templateId: string; instances: ExportedInstance[] }[]
    connectors: { templateId: string; instances: ExportedInstance[] }[]
  }
  actions: any[]
  activities: any[]
  scene: Scene
}
