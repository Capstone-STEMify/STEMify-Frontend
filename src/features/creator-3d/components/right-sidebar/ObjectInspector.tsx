'use client'

import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { ComponentInspector } from '@/features/creator-3d/components/right-sidebar/ComponentInspector'
import { useSelectedObject } from '@/features/creator-3d/hooks/creator-3d-helper'
import { removeInstance, updateInstance } from '@/features/creator-3d/slice/creatorSceneSlice'
import {
  removeTargetFromAllActions,
  updateActionName,
  updateConnectorArms
} from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useState, useCallback, useEffect } from 'react'

function normalizePose(pose?: Partial<{ x: number; y: number; z: number }>): { x: number; y: number; z: number } {
  return {
    x: pose?.x ?? 0,
    y: pose?.y ?? 0,
    z: pose?.z ?? 0
  }
}

export function ObjectInspector() {
  const dispatch = useAppDispatch()
  const { selectedActionId, actions } = useAppSelector((s) => s.workspaceTree)
  const selectedAction = actions.find((a) => a.id === selectedActionId)
  const selectedObject = useSelectedObject()
  // TODO: DETECT IF CONNECTOR AND SHOW CONNECTOR PROPS

  if (selectedObject) {
    return <ComponentInspector />
  }

  if (selectedAction) {
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
