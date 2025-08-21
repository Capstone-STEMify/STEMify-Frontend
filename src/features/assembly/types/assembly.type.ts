export interface Straw {
  id: string
  name: string
  geometry: Geometry
  transform: Transform
  color: string
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
  diameter: number
  color: string
  transform: Transform
  ports: Port[]
}

export interface Port {
  id: string
  localPosition: number[]
  direction: number[]
}

export interface Assembly {
  id: string
  name: string
  description?: string
  imageUrl?: string
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
