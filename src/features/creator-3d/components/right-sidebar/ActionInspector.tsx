import { updateActionName, WorkspaceAction } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

type ActionInspectorProps = {
  selectedAction: WorkspaceAction
}

export default function ActionInspector({ selectedAction }: ActionInspectorProps) {
  const t3d = useTranslations('creator3D.right_panel')
  const dispatch = useAppDispatch()
  const [localName, setLocalName] = useState(selectedAction.name)

  const handleBlur = () => {
    if (localName !== selectedAction.name) {
      dispatch(updateActionName({ id: selectedAction.id, newName: localName }))
    }
  }
  return (
    <div>
      <div>
        <h2 className='font-semibold text-gray-900'>{t3d('action_properties.title')}</h2>
        <span className='text-sm text-gray-600'>{selectedAction.name}</span>
      </div>

      <div className='flex-1 space-y-3 overflow-y-auto'>
        {/* Name */}
        <div>
          <label className='text-sm font-medium'>{t3d('action_properties.name')}</label>
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
          <label className='text-sm font-medium'>{t3d('action_properties.type')}</label>
          <p className='text-sm text-gray-700'>{selectedAction.type}</p>
        </div>
      </div>
    </div>
  )
}
