'use client'

import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { updateActionName, updateStep, WorkspaceAction } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import React, { useState, useMemo } from 'react'

type ActionInspectorProps = {
  selectedAction: WorkspaceAction
}

export default function ActionInspector({ selectedAction }: ActionInspectorProps) {
  const t3d = useTranslations('creator3D.right_panel')
  const dispatch = useAppDispatch()
  const activities = useAppSelector((s) => s.workspaceTree.activities)

  const stepInfo = useMemo(() => {
    for (const activity of activities) {
      const idx = activity.steps.findIndex((s) => s.actionId === selectedAction.id)
      if (idx !== -1) return { activityId: activity.id, stepIndex: idx, step: activity.steps[idx] }
    }
    return null
  }, [activities, selectedAction.id])

  const [localFields, setLocalFields] = useState(() => ({
    name: selectedAction.name,
    title: stepInfo?.step.title || '',
    description: stepInfo?.step.description || '',
    expectedResult: stepInfo?.step.expectedResult || '',
    hints: stepInfo?.step.hints || []
  }))

  const handleChange = (field: keyof typeof localFields, value: string | string[]) => {
    setLocalFields((prev) => ({ ...prev, [field]: value }))
  }

  const handleBlur = () => {
    // update name
    if (localFields.name !== selectedAction.name) {
      dispatch(updateActionName({ id: selectedAction.id, newName: localFields.name }))
    }

    // update step
    if (stepInfo) {
      dispatch(
        updateStep({
          activityId: stepInfo.activityId,
          stepIndex: stepInfo.stepIndex,
          patch: {
            title: localFields.title,
            description: localFields.description,
            expectedResult: localFields.expectedResult,
            hints: localFields.hints
          }
        })
      )
    }
  }

  if (!stepInfo) return <p className='text-sm text-gray-500'>{t3d('noStep')}</p>

  return (
    <div className='space-y-4'>
      {/* Action info */}
      <div>
        <h2 className='font-semibold text-gray-900'>{t3d('action_properties.title')}</h2>
        <span className='text-sm text-gray-600'>{selectedAction.name}</span>
      </div>

      {/* Action Name */}
      <div>
        <label className='text-sm font-medium'>{t3d('action_properties.name')}</label>
        <Input
          value={localFields.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          className='w-full text-sm'
        />
      </div>

      {/* Action Type */}
      <div>
        <label className='text-sm font-medium'>{t3d('action_properties.type')}</label>
        <p className='text-sm text-gray-700'>{selectedAction.type}</p>
      </div>

      {/* Step section */}
      <div className='space-y-3 border-t pt-3'>
        <h3 className='font-semibold text-gray-900'>{t3d('action_properties.step.detail')}</h3>

        <div>
          <label className='text-sm font-medium'>{t3d('action_properties.step.title')}</label>
          <Input
            value={localFields.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={handleBlur}
            className='text-sm text-gray-700'
          />
        </div>

        <div>
          <label className='text-sm font-medium'>{t3d('action_properties.step.description')}</label>
          <Textarea
            value={localFields.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={handleBlur}
            className='text-sm text-gray-700'
          />
        </div>

        <div>
          <label className='text-sm font-medium'>{t3d('action_properties.step.expectedResult')}</label>
          <Textarea
            value={localFields.expectedResult}
            onChange={(e) => handleChange('expectedResult', e.target.value)}
            onBlur={handleBlur}
            className='text-sm text-gray-700'
          />
        </div>

        <div>
          <label className='text-sm font-medium'>{t3d('action_properties.step.hint')}</label>
          {localFields.hints.map((hint, index) => (
            <Input
              key={index}
              value={hint}
              onChange={(e) => {
                const newHints = [...localFields.hints]
                newHints[index] = e.target.value
                handleChange('hints', newHints)
              }}
              onBlur={handleBlur}
              className='mb-1 text-sm text-gray-700'
            />
          ))}
          <button
            onClick={() => handleChange('hints', [...localFields.hints, ''])}
            className='mt-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
          >
            {t3d('action_properties.step.addHint')}
          </button>
        </div>
      </div>
    </div>
  )
}
