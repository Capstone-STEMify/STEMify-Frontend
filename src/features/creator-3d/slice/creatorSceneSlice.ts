import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'

interface CreatorSceneState {
  instances: AssemblyInstance[]
  selectedId: string | null
  transformMode: 'translate' | 'rotate' | 'scale'
  showGrid: boolean
  showAxes: boolean
  snapToGrid: boolean
  gridSize: number
}

const initialState: CreatorSceneState = {
  instances: [],
  selectedId: null,
  transformMode: 'translate',
  showGrid: true,
  showAxes: true,
  snapToGrid: true,
  gridSize: 1
}

export const creatorSceneSlice = createSlice({
  name: 'creatorScene',
  initialState,
  reducers: {
    setInstances(state, action: PayloadAction<AssemblyInstance[]>) {
      state.instances = action.payload
    },
    addInstance(state, action: PayloadAction<AssemblyInstance>) {
      state.instances = [...state.instances, action.payload]
      state.selectedId = action.payload.id
    },
    removeInstance(state, action: PayloadAction<string>) {
      state.instances = state.instances.filter((i) => i.id !== action.payload)
      if (state.selectedId === action.payload) state.selectedId = null
    },
    updateInstance(state, action: PayloadAction<{ id: string; updates: Partial<AssemblyInstance> }>) {
      const idx = state.instances.findIndex((i) => i.id === action.payload.id)
      if (idx >= 0) {
        const prev = state.instances[idx]
        state.instances[idx] = {
          ...prev,
          ...action.payload.updates,
          transform: {
            ...prev.transform,
            ...(action.payload.updates.transform ?? {}),
            position: {
              ...prev.transform.position,
              ...(action.payload.updates.transform?.position ?? {})
            },
            rotation: {
              ...prev.transform.rotation,
              ...(action.payload.updates.transform?.rotation ?? {})
            },
            scale: {
              x: action.payload.updates.transform?.scale?.x ?? prev.transform.scale?.x ?? 1,
              y: action.payload.updates.transform?.scale?.y ?? prev.transform.scale?.y ?? 1,
              z: action.payload.updates.transform?.scale?.z ?? prev.transform.scale?.z ?? 1
            }
          }
        }
      }
    },
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload
    },
    setTransformMode(state, action: PayloadAction<'translate' | 'rotate' | 'scale'>) {
      state.transformMode = action.payload
    },
    toggleGrid(state) {
      state.showGrid = !state.showGrid
    },
    toggleAxes(state) {
      state.showAxes = !state.showAxes
    },
    toggleSnap(state) {
      state.snapToGrid = !state.snapToGrid
    },
    setGridSize(state, action: PayloadAction<number>) {
      state.gridSize = action.payload
    },
    clearScene(state) {
      state.instances = []
      state.selectedId = null
    }
  }
})

export const {
  setInstances,
  addInstance,
  removeInstance,
  updateInstance,
  setSelectedId,
  setTransformMode,
  toggleGrid,
  toggleAxes,
  toggleSnap,
  setGridSize,
  clearScene
} = creatorSceneSlice.actions

export default creatorSceneSlice.reducer
