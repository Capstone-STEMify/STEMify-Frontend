import { AppThunk } from '@/libs/redux/store'
import { undo, redo } from '@/features/creator-3d/slice/creatorSceneSlice'
import { removeTargetFromAllActions } from '@/features/creator-3d/slice/workspaceTreeSlice'

/**
 * Sync undo: khôi phục instances và dọn dẹp workspaceTree
 */
export const syncUndo = (): AppThunk => (dispatch, getState) => {
  const beforeInstances = getState().creatorScene.instances
  const beforeIds = new Set(beforeInstances.map(i => i.id))

  // Thực hiện undo
  dispatch(undo())

  const afterInstances = getState().creatorScene.instances
  const afterIds = new Set(afterInstances.map(i => i.id))

  // Tìm các instances đã bị xóa sau undo
  const removedIds = [...beforeIds].filter(id => !afterIds.has(id))

  // Xóa các targets không còn tồn tại khỏi workspaceTree
  removedIds.forEach(id => {
    dispatch(removeTargetFromAllActions(id))
  })

  console.log('⏪ Undo synced:', { removedIds })
}

/**
 * Sync redo: khôi phục instances và dọn dẹp workspaceTree
 */
export const syncRedo = (): AppThunk => (dispatch, getState) => {
  const beforeInstances = getState().creatorScene.instances
  const beforeIds = new Set(beforeInstances.map(i => i.id))

  // Thực hiện redo
  dispatch(redo())

  const afterInstances = getState().creatorScene.instances
  const afterIds = new Set(afterInstances.map(i => i.id))

  // Tìm các instances đã bị xóa sau redo
  const removedIds = [...beforeIds].filter(id => !afterIds.has(id))

  // Xóa các targets không còn tồn tại khỏi workspaceTree
  removedIds.forEach(id => {
    dispatch(removeTargetFromAllActions(id))
  })

  console.log('⏩ Redo synced:', { removedIds })
}
