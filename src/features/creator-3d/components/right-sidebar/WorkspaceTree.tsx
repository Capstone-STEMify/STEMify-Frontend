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
import { FolderIcon, FolderOpenIcon } from 'lucide-react'
import { Tree, TreeItem, TreeItemLabel } from '@/components/shadcn/tree'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { RootState } from '@/libs/redux/store'
import { addAction, removeAction } from '@/features/creator-3d/slice/workspaceTreeSlice'

interface WorkspaceItem {
  id: string
  type: 'workspace' | 'action' | 'component'
  name: string
  children?: string[]
}

export default function WorkspaceTree() {
  const dispatch = useAppDispatch()
  const actions = useAppSelector((s: RootState) => s.workspaceTree.actions)
  const instances = useAppSelector((s: RootState) => s.creatorScene.instances)

  const items = React.useMemo<Record<string, WorkspaceItem>>(() => {
    const base: Record<string, WorkspaceItem> = {
      workspace: { id: 'workspace', type: 'workspace', name: 'Workspace', children: actions.map((a) => a.id) }
    }

    actions.forEach((a) => {
      const children = Array.isArray(a.targets) ? a.targets : instances.map((i) => i.id)
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

  const [state, setState] = React.useState<Partial<TreeState<any>>>({})
  const indent = 20

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

  const handleAddAction = () => {
    const newId = `action-${Date.now()}`
    dispatch(addAction({ id: newId, name: 'New Action', type: 'highlight' }))
  }

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      expandedItems: [...(prev.expandedItems ?? []), 'workspace', ...actions.map((a) => a.id)]
    }))
  }, [instances, actions])

  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <h2 className='text-lg font-medium'>Workspace Tree</h2>
        <div className='flex gap-2'>
          <button onClick={handleAddAction} className='rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200'>
            + Add Action
          </button>
          <button onClick={handleExport} className='rounded bg-blue-100 px-2 py-1 text-xs hover:bg-blue-200'>
            Export JSON
          </button>
        </div>
      </div>

      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => {
          const data = item.getItemData()
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel>
                <span className='flex w-full items-center justify-between'>
                  <span className='flex items-center gap-2'>
                    {item.isFolder() &&
                      (item.isExpanded() ? <FolderOpenIcon className='size-4' /> : <FolderIcon className='size-4' />)}
                    {item.getItemName()}
                  </span>

                  {data.type === 'action' && (
                    <span
                      role='button'
                      tabIndex={0}
                      onClick={() => dispatch(removeAction(data.id))}
                      className='rounded bg-red-100 px-2 py-1 text-xs hover:bg-red-200'
                    >
                      Delete
                    </span>
                  )}
                </span>
              </TreeItemLabel>
            </TreeItem>
          )
        })}
      </Tree>
    </div>
  )
}
