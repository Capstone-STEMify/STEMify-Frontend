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
  selectedActionId?: string | null
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
  ],
  selectedActionId: null
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
        const prevHighlight = [...state.actions].reverse().find((a) => a.type === 'highlight')

        state.actions.push({
          id: action.payload.id,
          name: action.payload.name,
          type: 'transform_arm',
          targets: prevHighlight ? prevHighlight.targets : [],
          duration: 2,
          connectorArmTransforms: {},
          instantAppear: true,
          interpolation: 'easeInOut'
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

      if (act.type === 'highlight') {
        // highlight → cho phép add nhiều target khác nhau
        if (!act.targets.includes(action.payload.targetId)) {
          act.targets.push(action.payload.targetId)
        }
      }

      if (act.type === 'transform_arm') {
        // transform_arm → targets phải giống highlight gần nhất
        const idx = state.actions.findIndex((a) => a.id === action.payload.actionId)
        const prevHighlight = [...state.actions.slice(0, idx)].reverse().find((a) => a.type === 'highlight')
        act.targets = prevHighlight ? [...prevHighlight.targets] : []
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

    setSelectedAction: (state, action: PayloadAction<string | null>) => {
      state.selectedActionId = action.payload
    },

    resetActions: () => initialState
  }
})

export const {
  addAction,
  removeAction,
  addTargetToAction,
  updateConnectorArms,
  updateAction,
  resetActions,
  setSelectedAction
} = workspaceTreeSlice.actions

export default workspaceTreeSlice.reducer
