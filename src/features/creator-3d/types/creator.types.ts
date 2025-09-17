import * as THREE from 'three'
import {
  Vector3,
  Transform,
  Material,
  Physics,
  Straw,
  Connector,
  Joint,
  Action,
  Activity,
  Scene,
  Assembly,
  ComponentTemplate,
  BuilderState
} from "@/features/assembly/types/assembly.types"// 👈 import từ file schema chuẩn bạn gửi ở trên

// Loại bỏ SceneObject cũ, CreatorScene cũ
// Thay bằng các type chuẩn hóa

// CreatorState: giữ lại nhưng tham chiếu tới Assembly thay vì CreatorScene
export interface CreatorState {
  scene: Assembly['scene'] // dùng scene từ Assembly chuẩn
  currentAssembly: Assembly | null
  isDragging: boolean
  dragSource: ComponentTemplate | null
  transformMode: 'translate' | 'rotate' | 'scale'
  snapToGrid: boolean
  gridSize: number
  showGrid: boolean
  showAxes: boolean
}

// AssemblyStep → đã có trong chuẩn (ActivityStep + Action)
// Nếu vẫn muốn custom step riêng cho editor:
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

// AssemblyExport bây giờ chính là Assembly chuẩn hóa
export type AssemblyExport = Assembly
