export interface Straw {
  id: string
  name: string
  geometry: Geometry
  transform: Transform
  material: Material
  endpoints: Endpoint[]
  physics: Physics
}

export interface Geometry {
  length?: number
  diameter: number
  wallThickness: number
}

export interface Transform {
  position: number[]
  rotation: number[]
  scale: number[]
}

export interface Material {
  type?: string
  color?: string
  flexibility?: number // 0–100
  opacity: number // 0–1
  roughness?: number // 0–1
  metalness?: number // 0–1
}

export interface Physics {
  mass: number
  friction: number
  elasticity: number // 0–1
}

export interface Endpoint {
  id: string
  localPosition: number[]
}

export interface Connector {
  id: string
  name: string
  type: string
  diameter: number
  material: Material
  transform: Transform
  ports: Port[]
}

export interface Port {
  id: string
  localPosition: number[]
  direction: number[]
  portIndex: number
}

export interface Assembly {
  id: string
  name: string
  description?: string
  estimatedTime: number // in minutes
  objective?: string
  steps: Action[]
}

export interface Action {
  id: string
  name: string
  description?: string
  order: number
  straws?: Straw[]
  connectors?: Connector[]
}
