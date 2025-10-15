import React from 'react'

interface FeatureItemProps {
  text: string
  isSelected: boolean
}

export function FeatureItem({ text, isSelected }: FeatureItemProps) {
  return (
    <div className='flex items-start gap-3'>
      <svg
        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-sky-500'}`}
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path
          fillRule='evenodd'
          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
          clipRule='evenodd'
        />
      </svg>
      <span className={`text-sm ${isSelected ? 'text-slate-200' : 'text-gray-600'}`}>{text}</span>
    </div>
  )
}
