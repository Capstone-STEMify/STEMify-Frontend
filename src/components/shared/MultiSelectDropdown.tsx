'use client'
import React, { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Label } from '@/components/shadcn/label'

type TageColor = 'sky' | 'blue' | 'green'

type MultiSelectDropdownProps = {
  placeholder: string
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  onRemove: (value: string) => void
  tagColor?: TageColor
}
export function MultiSelectDropdown({
  placeholder,
  options,
  selectedValues,
  onToggle,
  onRemove,
  tagColor = 'sky'
}: MultiSelectDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const tagClasses = {
    sky: 'bg-sky-100 text-sky-500',
    blue: 'bg-blue-100 text-blue-500',
    green: 'bg-green-100 text-green-500'
  }

  return (
    <div>
      {/* Selected Values */}
      {selectedValues.length > 0 && (
        <div className='mb-4 flex flex-wrap gap-2'>
          {selectedValues.map((value) => (
            <span
              key={value}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${tagClasses[tagColor as keyof typeof tagClasses]}`}
            >
              {value}
              <button onClick={() => onRemove(value)} className='ml-2 hover:opacity-75'>
                <X className='h-4 w-4' />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className='relative'>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className='flex w-full items-center justify-between rounded-lg border border-gray-300 p-3 text-left'
        >
          <span className='text-gray-400'>{placeholder}</span>
          {/* chrvron down animation */}
          <span className='sr-only'>Toggle Dropdown</span>

          <ChevronDown className='h-5 w-5 text-gray-400' />
        </button>

        {showDropdown && (
          <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg select-none'>
            {options.map((option) => (
              <Label key={option} className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50'>
                <input
                  type='checkbox'
                  checked={selectedValues.includes(option)}
                  onChange={() => onToggle(option)}
                  className='mr-3 h-4 w-4 rounded border-gray-300'
                />
                <span className='text-sm'>{option}</span>
              </Label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
