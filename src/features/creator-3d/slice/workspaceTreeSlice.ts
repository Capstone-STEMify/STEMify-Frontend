import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Animation {
  colorHighlight?: string
  pulseEffect?: boolean
}

export interface ConnectorArmTransforms {
  [connectorId: string]: {
    [armId: string]: { x: number; y: number; z: number }
  }
}

/**
 * Các action type khác nhau sẽ có field riêng
 */
export type WorkspaceAction =
  | {
      id: string
      name: string
      type: 'highlight'
      targets: string[]
      duration: number
      animation?: Animation
    }
  | {
      id: string
      name: string
      type: 'transform_arm'
      targets: string[] // thường là các connector id
      duration: number
      connectorArmTransforms: ConnectorArmTransforms
      interpolation?: string
      instantAppear?: boolean
    }
  | {
      id: string
      name: string
      type: 'rotate_highlight'
      targets: string[] | 'all'
      duration: number
      rotationSpeed: number
    }

interface WorkspaceTreeState {
  actions: WorkspaceAction[]
}

const initialState: WorkspaceTreeState = {
  actions: [
    {
      id: 'action-1',
      name: 'Default Action',
      type: 'highlight',
      targets: [],
      duration: 2
    }
  ]
}

export const workspaceTreeSlice = createSlice({
  name: 'workspaceTree',
  initialState,
  reducers: {
    addAction: (state, action: PayloadAction<{ id: string; name: string; type: WorkspaceAction['type'] }>) => {
      if (action.payload.type === 'highlight') {
        state.actions.push({
          id: action.payload.id,
          name: action.payload.name,
          type: 'highlight',
          targets: [],
          duration: 2
        })
      } else if (action.payload.type === 'transform_arm') {
        state.actions.push({
          id: action.payload.id,
          name: action.payload.name,
          type: 'transform_arm',
          targets: [],
          duration: 2,
          connectorArmTransforms: {}
        })
      } else if (action.payload.type === 'rotate_highlight') {
        state.actions.push({
          id: action.payload.id,
          name: action.payload.name,
          type: 'rotate_highlight',
          targets: 'all',
          duration: 3,
          rotationSpeed: 1.0
        })
      }
    },

    removeAction: (state, action: PayloadAction<string>) => {
      state.actions = state.actions.filter((a) => a.id !== action.payload)
    },

    addTargetToAction: (state, action: PayloadAction<{ actionId: string; targetId: string }>) => {
      const act = state.actions.find((a) => a.id === action.payload.actionId)
      if (!act) return
      if (act.type === 'highlight' || act.type === 'transform_arm') {
        if (!act.targets.includes(action.payload.targetId)) {
          act.targets.push(action.payload.targetId)
        }
      }
    },

    updateConnectorArms: (
      state,
      action: PayloadAction<{
        actionId: string
        connectorId: string
        arms: Record<string, { x: number; y: number; z: number }>
      }>
    ) => {
      const act = state.actions.find((a) => a.id === action.payload.actionId)
      if (act && act.type === 'transform_arm') {
        act.connectorArmTransforms[action.payload.connectorId] = action.payload.arms
      }
    },

    updateAction: (state, action: PayloadAction<{ id: string; patch: Partial<WorkspaceAction> }>) => {
      const idx = state.actions.findIndex((a) => a.id === action.payload.id)
      if (idx >= 0) {
        state.actions[idx] = { ...state.actions[idx], ...action.payload.patch } as WorkspaceAction
      }
    },

    resetActions: () => initialState,
    syncInstancesToTargets: (state, action: PayloadAction<string[]>) => {
      // action.payload = danh sách tất cả instance id hiện tại
      state.actions = state.actions.map((act) => {
        if (act.type === 'highlight' || act.type === 'transform_arm' || act.type === 'rotate_highlight') {
          return {
            ...act,
            targets: action.payload // đồng bộ targets luôn bằng toàn bộ instances
          }
        }
        return act
      })
    }
  }
})

export const {
  addAction,
  removeAction,
  addTargetToAction,
  updateConnectorArms,
  updateAction,
  resetActions,
  syncInstancesToTargets
} = workspaceTreeSlice.actions

export default workspaceTreeSlice.reducer
