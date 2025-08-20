export type Vector3 = {
  x: number
  y: number
  z: number
}

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
  position: Vector3
  rotation: Vector3
  scale: Vector3
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
  localPosition: Vector3
  connectionId: string | null
  isAvailable: boolean
}

export interface Connector {
  id: number
  name: string
  type: string
  diameter: number
  material: Material
  transform: Transform
  ports: Port[]
}

export interface Port {
  id: number
  localPosition: number[]
  direction: number[]
  portIndex: number
}
