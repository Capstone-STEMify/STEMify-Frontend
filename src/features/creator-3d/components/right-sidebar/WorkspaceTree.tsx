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
import { FolderIcon, FolderOpenIcon, SearchIcon } from 'lucide-react'

import { Tree, TreeItem, TreeItemLabel } from 'components/shadcn/tree'

interface Item {
  name: string
  children?: string[]
}

const items: Record<string, Item> = {
  company: {
    name: 'Company',
    children: ['engineering', 'marketing', 'operations']
  },
  engineering: {
    name: 'Engineering',
    children: ['frontend', 'backend', 'platform-team']
  },
  frontend: { name: 'Frontend', children: ['design-system', 'web-platform'] },
  'design-system': {
    name: 'Design System',
    children: ['components', 'tokens', 'guidelines']
  },
  components: { name: 'Components' },
  tokens: { name: 'Tokens' },
  guidelines: { name: 'Guidelines' },
  'web-platform': { name: 'Web Platform' },
  backend: { name: 'Backend', children: ['apis', 'infrastructure'] },
  apis: { name: 'APIs' },
  infrastructure: { name: 'Infrastructure' },
  'platform-team': { name: 'Platform Team' },
  marketing: { name: 'Marketing', children: ['content', 'seo'] },
  content: { name: 'Content' },
  seo: { name: 'SEO' },
  operations: { name: 'Operations', children: ['hr', 'finance'] },
  hr: { name: 'HR' },
  finance: { name: 'Finance' }
}

const indent = 20

export default function WorkspaceTree() {
  // Store the initial expanded items to reset when search is cleared
  const initialExpandedItems = ['engineering', 'frontend', 'design-system']
  const [state, setState] = useState<Partial<TreeState<Item>>>({})

  const tree = useTree<Item>({
    state,
    setState,
    initialState: {
      expandedItems: initialExpandedItems
    },
    indent,
    rootItemId: 'company',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? []
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature, selectionFeature, searchFeature, expandAllFeature]
  })

  return (
    <div className=''>
      <div className='relative'>
        <h2 className='mb-2 text-lg font-medium'>Workspace tree</h2>
      </div>

      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => {
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel>
                <span className='flex items-center gap-2'>
                  {item.isFolder() &&
                    (item.isExpanded() ? (
                      <FolderOpenIcon className='text-muted-foreground pointer-events-none size-4' />
                    ) : (
                      <FolderIcon className='text-muted-foreground pointer-events-none size-4' />
                    ))}
                  {item.getItemName()}
                </span>
              </TreeItemLabel>
            </TreeItem>
          )
        })}
      </Tree>
    </div>
  )
}
