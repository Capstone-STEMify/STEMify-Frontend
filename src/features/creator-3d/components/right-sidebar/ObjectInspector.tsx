'use client'

import { ComponentInspector } from '@/features/creator-3d/components/right-sidebar/ComponentInspector'
import { updateActionName } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

export function ObjectInspector() {
  const dispatch = useAppDispatch()
  const { actions } = useAppSelector((s) => s.workspaceTree)
  const selection = useAppSelector((s) => s.selectObject)

  if (selection.type === 'component') {
    return <ComponentInspector />
  }

  if (selection.type === 'action') {
    const selectedAction = actions.find((a) => a.id === selection.id)
    if (!selectedAction) {
      return (
        <div className='flex h-full w-80 flex-col border-gray-200 bg-white'>
          <div className='border-b border-gray-200 p-4'>
            <h2 className='font-semibold text-gray-900'>Properties</h2>
          </div>
          <div className='flex flex-1 items-center justify-center p-8'>
            <p className='text-sm text-gray-500'>Select an object or action to edit properties</p>
          </div>
        </div>
      )
    }
    return (
      <div className='flex h-full w-80 flex-col border-gray-200 bg-white'>
        <div className='border-b border-gray-200 p-4'>
          <h2 className='font-semibold text-gray-900'>Action Properties</h2>
          <span className='text-sm text-gray-600'>{selectedAction.name}</span>
        </div>

        <div className='flex-1 space-y-6 overflow-y-auto p-4'>
          {/* Name */}
          <div>
            <label className='text-sm font-medium'>Name</label>
            <input
              type='text'
              value={selectedAction.name}
              onChange={(e) => dispatch(updateActionName({ id: selectedAction.id, newName: e.target.value }))}
              className='w-full rounded border px-2 py-1 text-sm'
            />
          </div>

          {/* Type */}
          <div>
            <label className='text-sm font-medium'>Type</label>
            <p className='text-sm text-gray-700'>{selectedAction.type}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full w-80 flex-col border-gray-200 bg-white'>
      <div className='border-b border-gray-200 p-4'>
        <h2 className='font-semibold text-gray-900'>Properties</h2>
      </div>
      <div className='flex flex-1 items-center justify-center p-8'>
        <p className='text-sm text-gray-500'>Select an object or action to edit properties</p>
      </div>
    </div>
  )
}
