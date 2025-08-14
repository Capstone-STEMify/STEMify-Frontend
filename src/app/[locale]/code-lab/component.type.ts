export type ComponentType = {
  type: 'straw' | 'connector'
  length?: number
  color?: string
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
