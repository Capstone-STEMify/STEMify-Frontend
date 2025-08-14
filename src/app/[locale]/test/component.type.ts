export interface Root {
  metadata: Metadata
  straws: Straw[]
  connectors: Connector[]
  joints: Joint[]
  actions: Action[]
  activities: Activity[]
  scene: Scene
}

export interface Metadata {
  version: string
  created: string
  lastModified: string
  author: string
  description: string
}

export interface Straw {
  id: string
  name: string
  geometry: Geometry
  material: Material
  transform: Transform
  endpoints: Endpoints
  physics: Physics
}

export interface Geometry {
  length: number
  diameter: number
  wallThickness: number
}

export interface Material {
  type: string
  color: string
  flexibility: number
  opacity: number
  roughness: number
  metalness: number
}

export interface Transform {
  position: Position
  rotation: Rotation
  scale: Scale
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface Rotation {
  x: number
  y: number
  z: number
}

export interface Scale {
  x: number
  y: number
  z: number
}

export interface Endpoints {
  start: Start
  end: End
}

export interface Start {
  id: string
  localPosition: LocalPosition
  connectionId: any
  isAvailable: boolean
}

export interface LocalPosition {
  x: number
  y: number
  z: number
}

export interface End {
  id: string
  localPosition: LocalPosition2
  connectionId: any
  isAvailable: boolean
}

export interface LocalPosition2 {
  x: number
  y: number
  z: number
}

export interface Physics {
  mass: number
  friction: number
  elasticity: number
}

export interface Connector {
  id: string
  name: string
  type: string
  geometry: Geometry2
  material: Material2
  transform: Transform2
  ports: Port[]
  constraints: Constraints
}

export interface Geometry2 {
  size: Size
  portDiameter: number
  shape: string
}

export interface Size {
  x: number
  y: number
  z: number
}

export interface Material2 {
  type: string
  color: string
  flexibility: number
  opacity: number
  roughness: number
  metalness: number
}

export interface Transform2 {
  position: Position2
  rotation: Rotation2
  scale: Scale2
}

export interface Position2 {
  x: number
  y: number
  z: number
}

export interface Rotation2 {
  x: number
  y: number
  z: number
}

export interface Scale2 {
  x: number
  y: number
  z: number
}

export interface Port {
  id: string
  localPosition: LocalPosition3
  orientation: Orientation
  connectionId: any
  isAvailable: boolean
  portIndex: number
}

export interface LocalPosition3 {
  x: number
  y: number
  z: number
}

export interface Orientation {
  x: number
  y: number
  z: number
}

export interface Constraints {
  maxConnections: number
  allowedAngles: number[]
}

export interface Joint {
  id: string
  type: string
  componentA: ComponentA
  componentB: ComponentB
  constraints: Constraints2
  strength: number
  created: string
}

export interface ComponentA {
  componentId: string
  componentType: string
  attachmentPointId: string
}

export interface ComponentB {
  componentId: string
  componentType: string
  attachmentPointId: string
}

export interface Constraints2 {
  allowRotation: AllowRotation
  allowTranslation: AllowTranslation
}

export interface AllowRotation {
  x: number
  y: number
  z: number
}

export interface AllowTranslation {
  x: number
  y: number
  z: number
}

export interface Action {
  id: string
  name: string
  type: string
  targetId: string
  targetType: string
  parameters: Parameters
  animation?: Animation
  triggers?: Trigger[]
  order: number
}

export interface Parameters {
  duration: number
  delay?: number
  easing?: string
  loop?: boolean
  autoReverse?: boolean
}

export interface Animation {
  keyframes: Keyframe[]
  interpolation?: string
}

export interface Keyframe {
  time: number
  material?: Material3
  transform?: Transform3
}

export interface Material3 {
  type: string
  color: string
  opacity: number
}

export interface Transform3 {
  position: Position3
  rotation: Rotation3
  scale: Scale3
}

export interface Position3 {
  x: number
  y: number
  z: number
}

export interface Rotation3 {
  x: number
  y: number
  z: number
}

export interface Scale3 {
  x: number
  y: number
  z: number
}

export interface Trigger {
  event: string
  condition?: string
  nextActionId: string
}

export interface Activity {
  id: string
  name: string
  description: string
  difficulty: string
  estimatedTime: number
  objectives: string[]
  steps: Step[]
  playbackControls: PlaybackControls
}

export interface Step {
  id: string
  order: number
  title: string
  description: string
  actionIds: string[]
  expectedResult: string
  hints: string[]
  validation?: Validation
}

export interface Validation {
  type: string
  criteria: Criteria
}

export interface Criteria {
  jointId?: string
  connected?: boolean
  maxDistance?: number
  targetPosition?: TargetPosition
}

export interface TargetPosition {
  x: number
  y: number
  z: number
}

export interface PlaybackControls {
  allowRewind: boolean
  allowPause: boolean
  allowSkip: boolean
  speed: number
}

export interface Scene {
  environment: Environment
  workspace: Workspace
}

export interface Environment {
  background: string
  lighting: Lighting
  camera: Camera
}

export interface Lighting {
  ambient: string
  directional: Directional
}

export interface Directional {
  color: string
  intensity: number
  position: Position4
}

export interface Position4 {
  x: number
  y: number
  z: number
}

export interface Camera {
  position: Position5
  target: Target
  fov: number
  controls: string
}

export interface Position5 {
  x: number
  y: number
  z: number
}

export interface Target {
  x: number
  y: number
  z: number
}

export interface Workspace {
  bounds: Bounds
  grid: Grid
}

export interface Bounds {
  min: Min
  max: Max
}

export interface Min {
  x: number
  y: number
  z: number
}

export interface Max {
  x: number
  y: number
  z: number
}

export interface Grid {
  visible: boolean
  size: number
  divisions: number
}
