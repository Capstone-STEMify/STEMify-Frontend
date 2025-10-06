'use client'

import React from 'react'
import { useTree } from '@headless-tree/react'
import {
  expandAllFeature,
  searchFeature,
  selectionFeature,
  syncDataLoaderFeature,
  TreeState
} from '@headless-tree/core'
import { FolderIcon, FolderOpenIcon, Trash2 } from 'lucide-react'
import { Tree, TreeItem, TreeItemLabel } from '@/components/shadcn/tree'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { RootState } from '@/libs/redux/store'
import {
  addAction,
  removeAction,
  removeActionWithInstances,
  removeTargetFromAllActions,
  setSelectedAction,
  updateActionName,
  WorkspaceAction
} from '@/features/creator-3d/slice/workspaceTreeSlice'
import { removeInstance, setSelectedId } from '@/features/creator-3d/slice/creatorSceneSlice'
import { useModal } from '@/providers/ModalProvider'

interface WorkspaceItem {
  id: string
  type: 'workspace' | 'action' | 'component'
  name: string
  children?: string[]
}

type WorkspaceTreeProps = {
  selectedObjectId?: string | null
}

export default function WorkspaceTree({ selectedObjectId }: WorkspaceTreeProps) {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const actions = useAppSelector((s: RootState) => s.workspaceTree.actions)
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

    return base
  }, [actions, instances])

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

    console.log('Workspace JSON:', JSON.stringify(exportData, null, 2))
    alert('Workspace JSON has been logged in the console!')
  }

  const handleDeleteComponent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    openModal('confirm', {
      message: 'Are you sure you want to delete this component?',
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
      getItem: (id) => items[id] ?? { id, type: 'component', name: id, children: [] },
      getChildren: (id) => items[id]?.children ?? []
    },
    features: [syncDataLoaderFeature, searchFeature, selectionFeature, expandAllFeature]
  })

  const handleAddAction = (type: WorkspaceAction['type']) => {
    const newId = `action_${nextActionNumber}`
    if (type === 'highlight') {
      dispatch(addAction({ id: newId, name: `Highlight Action ${nextActionNumber}`, type }))
      dispatch(setSelectedAction(newId))
    }
    if (type === 'transform_arm') {
      dispatch(addAction({ id: newId, name: `Transform Action ${nextActionNumber}`, type }))
      dispatch(setSelectedAction(newId))
    }
  }

  React.useEffect(() => {
    const selected = selectedActionId || selectedId

    setState((prev) => ({
      ...prev,
      expandedItems: [...(prev.expandedItems ?? []), 'workspace', ...actions.map((a) => a.id)],
      selectedItems: selected ? [selected] : []
    }))
  }, [instances, actions, selectedId, selectedActionId])

  return (
    <div>
      <div className='mb-2'>
        <h2 className='text-lg font-medium'>Workspace Tree</h2>
        <div className='flex gap-2'>
          <button
            onClick={() => handleAddAction('highlight')}
            className='rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200'
          >
            (highlight)
          </button>
          <button
            onClick={() => handleAddAction('transform_arm')}
            className='rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200'
          >
            (transform_arm)
          </button>
          <button onClick={handleExport} className='rounded bg-blue-100 px-2 py-1 text-xs hover:bg-blue-200'>
            Export JSON
          </button>
        </div>
      </div>
      <div className='max-h-[200px] flex-1 overflow-y-auto'>
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
                    }
                    if (data.type === 'component') {
                      dispatch(setSelectedId(data.id))
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
                        Delete
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
        </Tree>
      </div>
    </div>
  )
}
