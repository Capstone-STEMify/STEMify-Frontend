'use client'

import React, { useState } from 'react'
import {
  expandAllFeature,
  hotkeysCoreFeature,
  searchFeature,
  selectionFeature,
  syncDataLoaderFeature,
  TreeState
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { FolderIcon, FolderOpenIcon } from 'lucide-react'
import { Tree, TreeItem, TreeItemLabel } from '@/components/shadcn/tree'

interface WorkspaceItem {
  id: string
  type: 'workspace' | 'action' | 'component'
  name: string
  children?: string[]
}

export default function WorkspaceTree() {
  const [items, setItems] = useState<Record<string, WorkspaceItem>>({
    workspace: {
      id: 'workspace',
      type: 'workspace',
      name: 'Workspace',
      children: ['action-1']
    },
    'action-1': {
      id: 'action-1',
      type: 'action',
      name: 'Action 1',
      children: ['straw-1', 'connector-1']
    },
    'straw-1': { id: 'straw-1', type: 'component', name: 'Straw 1' },
    'connector-1': { id: 'connector-1', type: 'component', name: 'Connector 1' }
  })

  const [state, setState] = useState<Partial<TreeState<WorkspaceItem>>>({})

  const indent = 20

  const tree = useTree<WorkspaceItem>({
    state,
    setState,
    initialState: { expandedItems: ['workspace'] },
    indent,
    rootItemId: 'workspace',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => item.getItemData()?.type === 'workspace' || item.getItemData()?.type === 'action',
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? []
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature, selectionFeature, searchFeature, expandAllFeature]
  })

  // Thêm action mới
  const handleAddAction = () => {
    const newId = `action-${Date.now()}`
    const newAction: WorkspaceItem = {
      id: newId,
      type: 'action',
      name: `New Action`,
      children: []
    }

    setItems((prev) => ({
      ...prev,
      [newId]: newAction,
      workspace: {
        ...prev['workspace'],
        children: [...(prev['workspace'].children ?? []), newId]
      }
    }))

    setState((prev) => ({
      ...prev,
      expandedItems: [...(prev.expandedItems ?? []), 'workspace']
    }))
  }

  // Thêm component vào action
  const handleAddComponent = (actionId: string) => {
    const newId = `component-${Date.now()}`
    const newComponent: WorkspaceItem = {
      id: newId,
      type: 'component',
      name: `New Component`
    }

    setItems((prev) => ({
      ...prev,
      [newId]: newComponent,
      [actionId]: {
        ...prev[actionId],
        children: [...(prev[actionId].children ?? []), newId]
      }
    }))

    setState((prev) => ({
      ...prev,
      expandedItems: [...(prev.expandedItems ?? []), actionId]
    }))
  }

  // Export JSON
  const handleExport = () => {
    console.log('Workspace JSON:', JSON.stringify(items, null, 2))
    alert('Workspace JSON has been logged in the console!')
  }

  return (
    <div>
      <div className='relative mb-2 flex items-center justify-between gap-2'>
        <h2 className='text-lg font-medium'>Workspace tree</h2>
        <div className='flex gap-2'>
          <span
            role='button'
            tabIndex={0}
            onClick={handleAddAction}
            className='cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200'
          >
            + Add action
          </span>
          <span
            role='button'
            tabIndex={0}
            onClick={handleExport}
            className='cursor-pointer rounded bg-blue-100 px-2 py-1 text-xs hover:bg-blue-200'
          >
            Export JSON
          </span>
        </div>
      </div>

      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => {
          const data = item.getItemData()
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel>
                <span className='flex w-full items-center justify-between gap-2'>
                  <span className='flex items-center gap-2'>
                    {item.isFolder() &&
                      (item.isExpanded() ? (
                        <FolderOpenIcon className='text-muted-foreground size-4' />
                      ) : (
                        <FolderIcon className='text-muted-foreground size-4' />
                      ))}
                    {item.getItemName()}
                  </span>

                  {data.type === 'action' && (
                    <span
                      role='button'
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddComponent(item.getId())
                      }}
                      className='cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs select-none hover:bg-gray-200'
                    >
                      + Add component
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
