'use client'

import { Badge } from '@/components/shadcn/badge'
import { SCard } from '@/components/shared/card/SCard'
import Image from 'next/image'
import React from 'react'

type CardHorizontalProps = {
  badge?: React.ReactNode
  imageUrl?: string
  title: string
  description?: string
  className?: string
  height?: number
  onClick?: () => void
}

export default function CardHorizontal({
  badge,
  imageUrl,
  title,
  description,
  className = '',
  height = 150,
  onClick
}: CardHorizontalProps) {
  return (
    <SCard
      className={`w-full rounded-xl ${className}`}
      content={
        <div className='flex cursor-pointer flex-col items-start gap-4 md:flex-row' onClick={onClick}>
          {/* Image */}
          <div className='w-full flex-shrink-0 md:w-auto'>
            <Image
              src={imageUrl || '/images/resources/courses.png'}
              alt={title}
              width={height}
              height={height}
              style={{ width: height, height: height }}
              className='aspect-square max-h-60 w-full rounded-lg object-cover md:h-auto md:w-auto'
            />
          </div>

          {/* Text content */}
          <div className={`flex h-full w-full flex-col`}>
            <h3 className='mb-1 line-clamp-1 text-lg font-semibold text-gray-800'>
              {title} {badge && <span className='ml-2'>{badge}</span>}
            </h3>
            <p className='mt-1 line-clamp-4 text-sm text-gray-600 2xl:line-clamp-4'>{description}</p>
          </div>
        </div>
      }
    />
  )
}
