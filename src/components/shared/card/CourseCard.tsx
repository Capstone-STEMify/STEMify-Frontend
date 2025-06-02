import { ClockFading } from 'lucide-react'
import React from 'react'

type Resource = {
  title: string
  description: string
  image: string
  category: string
  age: string
  duration: string
}

type Props = {
  resource: Resource
}

export default function ResourceCard({ resource }: Props) {
  return (
    <div className='group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:transform hover:shadow-2xl'>
      <div className='absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-60 group-hover:animate-ping'></div>

      <div className='relative h-64 overflow-hidden'>
        <img
          src={resource.image}
          alt={resource.title}
          className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
        />

        <div className='absolute bottom-4 left-4 flex gap-2'>
          <span className='bg-opacity-80 inline-block rounded-full bg-gray-200 opacity-75 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
            {resource.category}
          </span>
          <span className='bg-opacity-80 inline-block rounded-full bg-gray-200 opacity-75 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
            Ages {resource.age}
          </span>
        </div>
      </div>

      <div className='p-6'>
        <h3 className='mb-3 text-xl font-semibold'>{resource.title}</h3>
        <p className='leading-relaxed'>{resource.description}</p>

        <div className='mt-4 flex justify-between items-center'>
          <div className='flex items-center justify-between gap-2 bg-opacity-80 rounded-full bg-gray-300 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
            <ClockFading size={16} />
            <span>{resource.duration}</span>
          </div>
          <div className='rounded-full bg-gray-400 p-2 transition-colors duration-300 group-hover:bg-gray-300'>
            <svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
