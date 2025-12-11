'use client'

import React from 'react'
import { useTree } from '@headless-tree/react'
import {
  createOnDropHandler,
  dragAndDropFeature,
  DragTarget,
  expandAllFeature,
  ItemInstance,
  keyboardDragAndDropFeature,
  searchFeature,
  selectionFeature,
  syncDataLoaderFeature,
  TreeState
} from '@headless-tree/core'
import { FolderIcon, FolderOpenIcon, Trash2 } from 'lucide-react'
import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from '@/components/shadcn/tree'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { RootState } from '@/libs/redux/store'
import {
  addAction,
  addActivity,
  addStepToActivity,
  moveTargetToAction,
  removeActionWithInstances,
  removeTargetFromAllActions,
  setSelectedAction,
  updateActionName,
  WorkspaceAction
} from '@/features/creator-3d/slice/workspaceTreeSlice'
import { removeInstance, setSelectedId } from '@/features/creator-3d/slice/creatorSceneSlice'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'

interface WorkspaceItem {
  id: string
  type: 'workspace' | 'action' | 'component'
  name: string
  children?: string[]
}

export default function WorkspaceTree() {
  const tc = useTranslations('common')
  const t3d = useTranslations('creator3D')
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const { actions, activities } = useAppSelector((s: RootState) => s.workspaceTree)
  const instances = useAppSelector((s: RootState) => s.creatorScene.instances)

  const nextActionNumber = actions.length + 1

  const items = React.useMemo<Record<string, WorkspaceItem>>(() => {
    const base: Record<string, WorkspaceItem> = {
      workspace: { id: 'workspace', type: 'workspace', name: 'Workspace', children: actions.map((a) => a.id) }
    }

    actions.forEach((a) => {
      const children = Array.isArray(a.targets) ? a.targets : []

      base[a.id] = {
        id: a.id,
        type: 'action',
        name: a.name,
        children
      }

      children.forEach((t) => {
        const inst = instances.find((i) => i.id === t)
        base[t] = {
          id: t,
          type: 'component',
          name: inst?.data?.name ?? t
        }
      })
    })

    return { ...base }
  }, [JSON.stringify(actions), JSON.stringify(instances)])

  const handleExport = () => {
    // JSON gồm workspace + actions từ slice
    const exportData = {
      workspace: {
        id: 'workspace',
        type: 'workspace',
        name: 'Workspace',
        actions: actions.map((a) => ({
          id: a.id,
          name: a.name,
          type: a.type,
          targets: a.targets,
          duration: a.duration,
          ...(a.type === 'highlight' && { animation: a.animation }),
          ...(a.type === 'transform_arm' && {
            connectorArmTransforms: a.connectorArmTransforms,
            interpolation: a.interpolation,
            instantAppear: a.instantAppear
          }),
          ...(a.type === 'rotate_highlight' && { rotationSpeed: a.rotationSpeed })
        }))
      }
    }
    console.log('📁 Exported Workspace JSON:', JSON.stringify(exportData, null, 2))

    alert('Workspace JSON has been logged in the console!')
  }

  const handleDeleteComponent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    openModal('confirm', {
      message: t3d('right_panel.delete_component'),
      onConfirm: () => {
        dispatch(removeInstance(id))
        dispatch(removeTargetFromAllActions(id))
      }
    })
  }
  const [editingActionId, setEditingActionId] = React.useState<string | null>(null)

  const [state, setState] = React.useState<Partial<TreeState<any>>>({})
  const indent = 20
  const selectedId = useAppSelector((s: RootState) => s.creatorScene.selectedId)
  const selectedActionId = useAppSelector((s: RootState) => s.workspaceTree.selectedActionId)

  const tree = useTree<WorkspaceItem>({
    state,
    setState,
    initialState: { expandedItems: ['workspace'] },
    indent,
    rootItemId: 'workspace',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => ['workspace', 'action'].includes(item.getItemData()?.type),
    dataLoader: {
      getItem: (id) => {
        const item = items[id]
        if (item) return item

        // fallback nhưng vẫn đảm bảo đầy đủ field
        return { id, type: 'component', name: id, children: [] }
      },
      getChildren: (id) => items[id]?.children ?? []
    },
    onDrop: async (draggedItems, target) => {
      if (!target?.item) return

      const targetId = target.item.getId()
      const targetData = items[targetId]

      for (const dragged of draggedItems) {
        const draggedId = dragged.getId()
        const draggedData = items[draggedId]

        if (draggedData?.type === 'component' && targetData?.type === 'action') {
          dispatch(moveTargetToAction(draggedId, targetId))

          // ⚡ ép tree cập nhật lại UI và đảm bảo folder target mở
          requestAnimationFrame(() => {
            setState((prev) => ({
              ...prev,
              expandedItems: Array.from(new Set([...(prev.expandedItems ?? []), targetId])), // mở folder mới
              refreshKey: Math.random() // trigger re-render "ảo"
            }))
          })
        }
      }
    },
    features: [
      syncDataLoaderFeature,
      searchFeature,
      selectionFeature,
      expandAllFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature
    ]
  })

  const handleAddAction = (type: WorkspaceAction['type']) => {
    const newId = `action_${nextActionNumber}`

    let activityId = activities[0]?.id
    if (!activityId) {
      activityId = 'activity_1'
      dispatch(
        addActivity({
          id: activityId,
          name: 'Activity 1',
          steps: [],
          difficulty: 'easy',
          description: '',
          estimatedTime: 10
        })
      )
    }

    // 2️⃣ Add action mới
    dispatch(addAction({ id: newId, name: `Bước ${nextActionNumber}`, type }))

    // 3️⃣ Add step cho đúng action và activity
    dispatch(
      addStepToActivity({
        activityId,
        step: {
          title: `Bước ${nextActionNumber}`,
          actionId: newId,
          description: '',
          expectedResult: '',
          hints: []
        }
      })
    )

    // 4️⃣ Chọn action mới
    dispatch(setSelectedAction(newId))
  }

  // 1️⃣ expand chỉ khi actions thay đổi
  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      expandedItems: Array.from(new Set(['workspace', ...(prev.expandedItems ?? []), ...actions.map((a) => a.id)]))
    }))
  }, [actions])

  // 2️⃣ chọn item khi click
  React.useEffect(() => {
    const selected = selectedActionId || selectedId
    setState((prev) => ({
      ...prev,
      selectedItems: selected ? [selected] : []
    }))
  }, [selectedActionId, selectedId])

  return (
    <div>
      <div className='mb-2'>
        <h2 className='text-lg font-medium'>{t3d('right_panel.workspace_tree')}</h2>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => handleAddAction('highlight')}
            className='rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200'
          >
            Group component
          </button>
          <button
            onClick={() => handleAddAction('transform_arm')}
            className='rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200'
          >
            Transform connector
          </button>
        </div>
      </div>
      <div>
        <Tree indent={indent} tree={tree}>
          {tree.getItems().map((item) => {
            const data = item.getItemData()
            return (
              <TreeItem key={item.getId()} item={item}>
                <TreeItemLabel
                  onDoubleClick={() => {
                    if (data.type === 'action') {
                      setEditingActionId(data.id)
                    }
                  }}
                  onClick={() => {
                    if (data.type === 'action') {
                      dispatch(setSelectedAction(data.id))
                      dispatch(setSelectedId(null))
                    }
                    if (data.type === 'component') {
                      dispatch(setSelectedId(data.id))
                      dispatch(setSelectedAction(null))
                    }
                  }}
                >
                  <span className='flex w-full items-center justify-between'>
                    <span className='flex items-center gap-2'>
                      {item.isFolder() &&
                        (item.isExpanded() ? <FolderOpenIcon className='size-4' /> : <FolderIcon className='size-4' />)}

                      {editingActionId === data.id ? (
                        <input
                          type='text'
                          autoFocus
                          defaultValue={data.name}
                          className='rounded border px-1 text-xs'
                          onBlur={(e) => {
                            const newName = e.target.value.trim()
                            if (newName) {
                              dispatch(updateActionName({ id: data.id, newName }))
                            }
                            setEditingActionId(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const target = e.target as HTMLInputElement
                              const newName = target.value.trim()
                              if (newName) {
                                dispatch(updateActionName({ id: data.id, newName }))
                              }
                              setEditingActionId(null)
                            }
                            if (e.key === 'Escape') {
                              setEditingActionId(null)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span>{item.getItemName()}</span>
                      )}
                    </span>

                    {data.type === 'action' && (
                      <span
                        role='button'
                        tabIndex={0}
                        onClick={() => dispatch(removeActionWithInstances(data.id))}
                        className='rounded bg-red-100 px-2 py-1 text-xs hover:bg-red-200'
                      >
                        {tc('button.delete')}
                      </span>
                    )}

                    {data.type === 'component' && (
                      <div onClick={(e) => handleDeleteComponent(e, data.id)}>
                        <Trash2 className='size-4 cursor-pointer text-red-500 hover:text-red-700' />
                      </div>
                    )}
                  </span>
                </TreeItemLabel>
              </TreeItem>
            )
          })}
          <TreeDragLine />
        </Tree>
      </div>
    </div>
  )
}
