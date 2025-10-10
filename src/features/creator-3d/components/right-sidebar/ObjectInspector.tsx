'use client'

import ActionInspector from '@/features/creator-3d/components/right-sidebar/ActionInspector'
import { ComponentInspector } from '@/features/creator-3d/components/right-sidebar/ComponentInspector'
import { useSelectedObject } from '@/features/creator-3d/hooks/creator-3d-helper'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'

export function ObjectInspector() {
  const t3d = useTranslations('creator3D.right_panel')
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
    <div>
      <h2 className='font-semibold text-gray-900'>{t3d('properties')}</h2>
      <p className='text-sm text-gray-500'>{t3d('select_object_or_action')}</p>
    </div>
  )
}
