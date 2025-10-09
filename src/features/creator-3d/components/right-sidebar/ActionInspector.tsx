import { updateActionName, WorkspaceAction } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import React, { useState } from 'react'

type ActionInspectorProps = {
  selectedAction: WorkspaceAction
}

export default function ActionInspector({ selectedAction }: ActionInspectorProps) {
  const [localName, setLocalName] = useState(selectedAction.name)

  const dispatch = useAppDispatch()

  const handleBlur = () => {
    if (localName !== selectedAction.name) {
      dispatch(updateActionName({ id: selectedAction.id, newName: localName }))
    }
  }
  return (
    <div>
      <div>
        <h2 className='font-semibold text-gray-900'>Action Properties</h2>
        <span className='text-sm text-gray-600'>{selectedAction.name}</span>
      </div>

      <div className='flex-1 space-y-3 overflow-y-auto'>
        {/* Name */}
        <div>
          <label className='text-sm font-medium'>Name</label>
          <input
            type='text'
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleBlur()
            }}
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
