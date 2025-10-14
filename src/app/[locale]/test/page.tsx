'use client'
import React, { Fragment } from 'react'
import {
  DragTarget,
  ItemInstance,
  createOnDropHandler,
  dragAndDropFeature,
  hotkeysCoreFeature,
  insertItemsAtTarget,
  keyboardDragAndDropFeature,
  removeItemsFromParents,
  renamingFeature,
  searchFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { AssistiveTreeDescription, useTree } from '@headless-tree/react'
import { cn } from '@/utils/shadcn/utils'
import { ChevronDown, ChevronRight, Folder, FolderOpen, File, Search, Edit3 } from 'lucide-react'
import { createDemoData, DemoItem } from 'app/[locale]/test/data'

const { syncDataLoader, data } = createDemoData()
let newItemId = 0

const insertNewItem = (dataTransfer: DataTransfer) => {
  const newId = `new-${newItemId++}`
  data[newId] = { name: dataTransfer.getData('text/plain') }
  return newId
}

const onDropForeignDragObject = (dataTransfer: DataTransfer, target: DragTarget<DemoItem>) => {
  const newId = insertNewItem(dataTransfer)
  insertItemsAtTarget([newId], target, (item, newChildrenIds) => {
    data[item.getId()].children = newChildrenIds
  })
}

const onCompleteForeignDrop = (items: ItemInstance<DemoItem>[]) =>
  removeItemsFromParents(items, (item, newChildren) => {
    item.getItemData().children = newChildren
  })

const onRename = (item: ItemInstance<DemoItem>, value: string) => {
  data[item.getId()].name = value
}

export default function FancyTree() {
  const tree = useTree<DemoItem>({
    initialState: { expandedItems: ['fruit'], selectedItems: ['banana', 'orange'] },
    rootItemId: 'root',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => !!item.getItemData().children,
    canReorder: true,
    onDrop: createOnDropHandler((item, newChildren) => {
      data[item.getId()].children = newChildren
    }),
    onRename,
    onDropForeignDragObject,
    onCompleteForeignDrop,
    createForeignDragObject: (items) => ({
      format: 'text/plain',
      data: items.map((item) => item.getId()).join(',')
    }),
    canDropForeignDragObject: (_, target) => target.item.isFolder(),
    indent: 20,
    dataLoader: syncDataLoader,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
      renamingFeature,
      searchFeature
    ]
  })

  return (
    <div className='flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 p-4 shadow-inner'>
      {tree.isSearchOpen() && (
        <div className='flex items-center gap-2 rounded-xl border bg-white p-2 shadow-sm'>
          <Search size={16} className='text-gray-500' />
          <input
            {...tree.getSearchInputElementProps()}
            placeholder='Search items...'
            className='flex-1 text-sm outline-none'
          />
          <span className='text-xs text-gray-400'>({tree.getSearchMatchingItems().length} matches)</span>
        </div>
      )}

      <div {...tree.getContainerProps()} className='relative overflow-hidden rounded-xl border bg-white shadow-sm'>
        <AssistiveTreeDescription tree={tree} />
        {tree.getItems().map((item) => {
          const level = item.getItemMeta().level
          const isFolder = item.isFolder()
          const isExpanded = item.isExpanded()
          const isSelected = item.isSelected()

          return (
            <Fragment key={item.getId()}>
              {item.isRenaming() ? (
                <div className='flex items-center' style={{ marginLeft: `${level * 20}px` }}>
                  <input
                    {...item.getRenameInputProps()}
                    className='rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring focus:ring-blue-200 focus:outline-none'
                  />
                </div>
              ) : (
                <div
                  {...item.getProps()}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-2 py-1 text-sm transition-all duration-150 select-none',
                    isSelected ? 'bg-blue-100 font-medium text-blue-800' : 'text-gray-800 hover:bg-gray-100'
                  )}
                  style={{ paddingLeft: `${level * 20 + 8}px` }}
                >
                  {isFolder ? (
                    isExpanded ? (
                      <ChevronDown size={16} className='text-gray-500' />
                    ) : (
                      <ChevronRight size={16} className='text-gray-500' />
                    )
                  ) : (
                    <div className='w-4' />
                  )}

                  {isFolder ? (
                    isExpanded ? (
                      <FolderOpen size={16} className='text-yellow-600' />
                    ) : (
                      <Folder size={16} className='text-yellow-600' />
                    )
                  ) : (
                    <File size={14} className='text-gray-400' />
                  )}

                  <span className='truncate'>{item.getItemName()}</span>
                </div>
              )}
            </Fragment>
          )
        })}

        <div
          style={{ ...tree.getDragLineStyle() }}
          className='absolute h-[2px] rounded-full bg-blue-600 transition-all duration-150'
        />
      </div>

      <div className='mt-2 flex items-center justify-between'>
        <div
          className='cursor-grab rounded-lg border bg-blue-50 p-2 text-sm hover:bg-blue-100 active:cursor-grabbing'
          draggable
          onDragStart={(e) => e.dataTransfer.setData('text/plain', 'hello world')}
        >
          Drag me into the tree!
        </div>

        <div
          className='cursor-pointer rounded-lg border bg-green-50 p-2 text-sm hover:bg-green-100'
          onDrop={(e) => alert(e.dataTransfer.getData('text/plain'))}
          onDragOver={(e) => e.preventDefault()}
        >
          Drop items here!
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => tree.openSearch()}
            className='rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-all hover:bg-blue-700'
          >
            Search
          </button>
          <button
            onClick={() => tree.getItemInstance('fruit').startRenaming()}
            className='flex items-center gap-1 rounded-lg bg-gray-200 px-3 py-1.5 text-sm transition-all hover:bg-gray-300'
          >
            <Edit3 size={14} /> Rename Fruit
          </button>
        </div>
      </div>
    </div>
  )
}
