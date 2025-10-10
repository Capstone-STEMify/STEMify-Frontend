'use client'

import ActionInspector from '@/features/creator-3d/components/right-sidebar/ActionInspector'
import { ComponentInspector } from '@/features/creator-3d/components/right-sidebar/ComponentInspector'
import { useSelectedObject } from '@/features/creator-3d/hooks/creator-3d-helper'
import { useAppSelector } from '@/hooks/redux-hooks'

export function ObjectInspector() {
  const { actions, selectedActionId } = useAppSelector((s) => s.workspaceTree)
  const selectedObject = useSelectedObject()
  const selectedAction = actions.find((a) => a.id === selectedActionId)

  if (selectedObject) {
    return <ComponentInspector />
  }

  if (selectedAction) {
    return <ActionInspector selectedAction={selectedAction} />
  }

  return (
    <div className=''>
      <div className='border-b border-gray-200 p-4'>
        <h2 className='font-semibold text-gray-900'>Properties</h2>
      </div>
      <div className='flex flex-1 items-center justify-center p-8'>
        <p className='text-sm text-gray-500'>Select an object or action to edit properties</p>
      </div>
    </div>
  )
}
