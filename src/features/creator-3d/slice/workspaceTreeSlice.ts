import { removeInstance } from '@/features/creator-3d/slice/creatorSceneSlice'
import { AppThunk } from '@/libs/redux/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'sonner'

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

export type WorkspaceActivity = {
  id: string
  name: string
  steps: Step[]
  difficulty: string
  description: string
  estimatedTime: number
}

export type Step = {
  hints: string[]
  title: string
  actionId: string
  description: string
  expectedResult: string
}

export interface WorkspaceTreeState {
  actions: WorkspaceAction[]
  activities: WorkspaceActivity[]
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
  activities: [
    {
      id: 'activity_1',
      name: 'Default Activity',
      steps: [],
      difficulty: 'easy',
      description: 'This is a default activity',
      estimatedTime: 10
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
        state.actions.push({
          id: action.payload.id,
          name: action.payload.name,
          type: 'transform_arm',
          targets: [],
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
      const { targetId } = action.payload

      if (act.type === 'highlight') {
        if (!act.targets.includes(targetId)) {
          act.targets.push(targetId)
        }
        return
      }

      if (act.type === 'transform_arm') {
        if (targetId.startsWith('connector_')) {
          if (!act.targets.includes(targetId)) {
            act.targets.push(targetId)
          }
        }
        return
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
      act.name = action.payload.newName
    },
    addStepToActivity: (state, action: PayloadAction<{ activityId: string; step: Step }>) => {
      const activity = state.activities.find((a) => a.id === action.payload.activityId)
      if (activity) activity.steps.push(action.payload.step)
    },
    updateTargetOrderInAction: (state, action: PayloadAction<{ actionId: string; newTargets: string[] }>) => {
      const act = state.actions.find((a) => a.id === action.payload.actionId)
      if (act && (act.type === 'highlight' || act.type === 'transform_arm')) {
        act.targets = [...action.payload.newTargets]
      }
    },
    updateStep: (state, action: PayloadAction<{ activityId: string; stepIndex: number; patch: Partial<Step> }>) => {
      const activity = state.activities.find((a) => a.id === action.payload.activityId)
      if (activity?.steps[action.payload.stepIndex]) {
        activity.steps[action.payload.stepIndex] = {
          ...activity.steps[action.payload.stepIndex],
          ...action.payload.patch
        }
      }
    },
    addActivity: (state, action: PayloadAction<WorkspaceActivity>) => {
      const existingIndex = state.activities.findIndex((a) => a.id === action.payload.id)
      if (existingIndex >= 0) {
        // ✅ REPLACE nếu đã tồn tại
        state.activities[existingIndex] = action.payload
      } else {
        // ✅ THÊM MỚI nếu chưa có
        state.activities.push(action.payload)
      }
    },

    clearActivities: (state) => {
      state.activities = []
    },

    resetActions: () => initialState,
    clearAction: (state) => {
      state.actions = []
      state.selectedActionId = null
    },
    resetWorkspace: (state) => {
      state.actions = []
      state.activities.forEach((a) => (a.steps = [])) // xoá toàn bộ step
      state.selectedActionId = null
    }
  }
})

export const {
  addActivity,
  addAction,
  removeAction,
  addTargetToAction,
  updateConnectorArms,
  updateAction,
  resetActions,
  clearAction,
  setSelectedAction,
  addStepToActivity,
  updateStep,
  removeTargetFromAllActions,
  updateActionName,
  updateTargetOrderInAction,
  clearActivities,
  resetWorkspace
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

export const moveTargetToAction =
  (targetId: string, newActionId: string): AppThunk =>
  (dispatch, getState) => {
    const { workspaceTree } = getState()
    const act = workspaceTree.actions.find((a) => a.id === newActionId)
    if (!act) return

    // validate
    if (act.type === 'transform_arm' && !targetId.startsWith('connector_')) {
      toast.error(`❌ '${targetId}' không thể thêm vào action '${act.name}'`)
      return
    }

    if (act.type === 'rotate_highlight') {
      toast.error(`❌ Action '${act.name}' không thể thêm target`)
      return
    }

    // hợp lệ → chuyển
    dispatch(removeTargetFromAllActions(targetId))
    dispatch(addTargetToAction({ actionId: newActionId, targetId }))
  }
