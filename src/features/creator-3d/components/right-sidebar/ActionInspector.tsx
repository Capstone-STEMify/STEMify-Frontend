import { updateActionName, WorkspaceAction } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import React from 'react'

type ActionInspectorProps = {
  selectedAction: WorkspaceAction
}

export default function ActionInspector({ selectedAction }: ActionInspectorProps) {
  const dispatch = useAppDispatch()
  return (
    <div>
      <div>
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
