'use client'

import { ReactNode } from 'react'

type AbstractCardProps = {
  title: string
  description: string
  icon: ReactNode
  gridContent: ReactNode
}

export const AbstractCard = ({ title, description, icon, gridContent }: AbstractCardProps) => {
  return (
    <div className='w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg'>
      {/* Grid Pattern Section */}
      <div className='relative h-52 w-full overflow-hidden bg-gray-900'>
        <div className='grid h-full grid-cols-3 grid-rows-2 gap-2'>{gridContent}</div>
      </div>

      {/* Text Content */}
      <div className='p-6'>
        <h2 className='mb-3 flex items-center gap-2 text-xl font-semibold text-gray-900'>
          {icon}
          {title}
        </h2>
        <p className='text-sm leading-relaxed text-gray-600'>{description}</p>
      </div>
    </div>
  )
}
