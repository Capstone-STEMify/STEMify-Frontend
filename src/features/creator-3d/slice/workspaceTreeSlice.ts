import { removeInstance } from '@/features/creator-3d/slice/creatorSceneSlice'
import { AppThunk } from '@/libs/redux/store'
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
      id: 'action_1',
      name: 'Default Action',
      type: 'highlight',
      targets: [],
      duration: 2
    }
  ],
  selectedActionId: 'action_1'
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

      if (state.selectedActionId === action.payload) {
        state.selectedActionId = state.actions.length > 0 ? state.actions[0].id : null
      }
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

    removeTargetFromAllActions: (state, action: PayloadAction<string>) => {
      const targetId = action.payload
      state.actions.forEach((act) => {
        if (act.type === 'highlight' || act.type === 'transform_arm') {
          act.targets = act.targets.filter((t) => t !== targetId)
        }
        // nếu transform_arm có connectorArmTransforms thì cũng xóa key liên quan
        if (act.type === 'transform_arm' && act.connectorArmTransforms[targetId]) {
          delete act.connectorArmTransforms[targetId]
        }
      })
    },

    updateActionName: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const act = state.actions.find((a) => a.id === action.payload.id)
      if (!act) return

      // cập nhật name
      act.name = action.payload.newName

      // cập nhật id theo rule: lowercase + replace space = _
      const newId = action.payload.newName.toLowerCase().replace(/\s+/g, '_')

      // đổi id của action
      act.id = newId
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
  setSelectedAction,
  removeTargetFromAllActions,
  updateActionName
} = workspaceTreeSlice.actions

export default workspaceTreeSlice.reducer

export const removeActionWithInstances =
  (actionId: string): AppThunk =>
  (dispatch, getState) => {
    const { workspaceTree } = getState()
    const act = workspaceTree.actions.find((a) => a.id === actionId)
    if (!act) return

    const targets = act.type === 'highlight' || act.type === 'transform_arm' ? [...act.targets] : []

    dispatch(removeAction(actionId))

    // reset selectedActionId nếu xoá xong thì hết action
    const { workspaceTree: after } = getState()
    if (!after.actions.find((a) => a.id === after.selectedActionId)) {
      dispatch(setSelectedAction(after.actions.length > 0 ? after.actions[0].id : null))
    }

    targets.forEach((t) => dispatch(removeInstance(t)))
  }
