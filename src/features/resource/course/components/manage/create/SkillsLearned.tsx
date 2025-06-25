'use client'
import React, { useState } from 'react'
import { Edit3, Save, XCircle, Plus, X } from 'lucide-react'

interface SkillsLearnedProps {
  takeAways: string[]
  onUpdateTakeAways: (takeAways: string[]) => void
}

export function SkillsLearned({ takeAways, onUpdateTakeAways }: SkillsLearnedProps) {
  const [newTakeAway, setNewTakeAway] = useState('')
  const [isEditingTakeAways, setIsEditingTakeAways] = useState(false)
  const [editingTakeAways, setEditingTakeAways] = useState<string[]>([])

  const handleEditTakeAways = () => {
    setIsEditingTakeAways(true)
    setEditingTakeAways([...takeAways])
    setNewTakeAway('')
  }

  const handleAddTakeAway = () => {
    if (newTakeAway.trim()) {
      setEditingTakeAways((prev) => [...prev, newTakeAway.trim()])
      setNewTakeAway('')
    }
  }

  const handleRemoveTakeAway = (index: number) => {
    setEditingTakeAways((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateTakeAway = (index: number, value: string) => {
    setEditingTakeAways((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const handleSaveTakeAways = () => {
    onUpdateTakeAways(editingTakeAways.filter((item) => item.trim()))
    setIsEditingTakeAways(false)
    setNewTakeAway('')
  }

  const handleCancelTakeAways = () => {
    setIsEditingTakeAways(false)
    setEditingTakeAways([])
    setNewTakeAway('')
  }

  return (
    <div className='rounded-lg bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Skills Learned</h3>
        {!isEditingTakeAways && (
          <button
            onClick={handleEditTakeAways}
            className='flex items-center gap-2 rounded-lg px-3 py-1 text-sm text-amber-400 transition-colors hover:bg-amber-50'
          >
            <Edit3 className='h-4 w-4' />
            Edit
          </button>
        )}
      </div>

      {!isEditingTakeAways ? (
        // Display mode
        <ul className='space-y-3 text-sm'>
          {takeAways.map((takeAway, index) => (
            <li key={index} className='flex items-start'>
              <span className='mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400'></span>
              <span>{takeAway}</span>
            </li>
          ))}
        </ul>
      ) : (
        // Edit mode
        <div className='space-y-4'>
          {/* Existing items being edited */}
          {editingTakeAways.map((takeAway, index) => (
            <div key={index} className='flex items-start gap-2'>
              <span className='mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400'></span>
              <textarea
                value={takeAway}
                onChange={(e) => handleUpdateTakeAway(index, e.target.value)}
                className='flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none'
                rows={2}
              />
              <button onClick={() => handleRemoveTakeAway(index)} className='mt-2 text-red-500 hover:text-red-700'>
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}

          {/* Add new item */}
          <div className='flex items-start gap-2'>
            <span className='mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400'></span>
            <textarea
              value={newTakeAway}
              onChange={(e) => setNewTakeAway(e.target.value)}
              placeholder='Add new take away...'
              className='flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none'
              rows={2}
            />
            <button
              onClick={handleAddTakeAway}
              disabled={!newTakeAway.trim()}
              className='mt-2 text-amber-400 hover:text-amber-500 disabled:cursor-not-allowed disabled:text-gray-400'
            >
              <Plus className='h-4 w-4' />
            </button>
          </div>

          {/* Action buttons */}
          <div className='flex gap-2 pt-2'>
            <button
              onClick={handleSaveTakeAways}
              className='flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-500'
            >
              <Save className='h-4 w-4' />
              Save
            </button>
            <button
              onClick={handleCancelTakeAways}
              className='flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50'
            >
              <XCircle className='h-4 w-4' />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
