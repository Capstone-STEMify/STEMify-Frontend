import { Badge } from '@/components/shadcn/badge'
import { Size } from '@/types/general'
import { ArrowRight, ChevronRightIcon, ClockFading } from 'lucide-react'
import React from 'react'

const sizeClasses: Record<Size, { height: string; width: string; titleSize: string }> = {
  sm: {
    height: 'h-44',
    width: 'w-[360px]',
    titleSize: 'text-sm'
  },
  md: {
    height: 'h-48',
    width: 'w-[370px]',
    titleSize: 'text-base'
  },
  lg: {
    height: 'h-60',
    width: 'w-[380px]',
    titleSize: 'text-lg'
  },
  xl: {
    height: 'h-64',
    width: 'w-full',
    titleSize: 'text-xl'
  }
}

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
  size?: Size
}

export default function ResourceCard({ resource, size = 'xl' }: Props) {
  const { height, width, titleSize } = sizeClasses[size]

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:transform hover:shadow-xl ${width}`}
    >
      <div className='absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-60 group-hover:animate-ping'></div>

      <div className={`relative ${height} overflow-hidden`}>
        <img src={resource.image} alt={resource.title} className='h-full w-full object-cover' />

        <div className='absolute bottom-4 left-4 flex gap-2'>
          <Badge className='bg-opacity-80 rounded-2xl bg-gray-200 px-4 py-2 text-black opacity-75 backdrop-blur-sm'>
            {resource.category}
          </Badge>
          <Badge className='bg-opacity-80 rounded-2xl bg-gray-200 px-4 text-black opacity-75 backdrop-blur-sm'>
            {resource.age}
          </Badge>
        </div>
      </div>

      <div className='p-4'>
        <div className='h-20'>
          <h3 className={`mb-3 font-semibold ${titleSize}`}>{resource.title}</h3>
          <p className='line-clamp-2 text-sm leading-relaxed'>{resource.description}</p>
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <Badge className='bg-opacity-80 flex gap-2 rounded-full bg-gray-400 px-4 py-2'>
            <ClockFading size={16} />
            <span>{resource.duration}</span>
          </Badge>
          <Badge className='rounded-full bg-gray-400 p-2 transition-colors duration-300'>
            <ChevronRightIcon size={16} className='text-white' />
          </Badge>
        </div>
      </div>
    </div>
  )
}
