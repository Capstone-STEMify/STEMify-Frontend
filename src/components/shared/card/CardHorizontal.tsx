'use client'

import { Button } from '@/components/shadcn/button'
import { SCard } from '@/components/shared/card/SCard'
import Image from 'next/image'
import React from 'react'

type CardHorizontalProps = {
  imageUrl?: string
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
  className?: string
}

export default function CardHorizontal({
  imageUrl,
  title,
  description,
  buttonText = 'Learn More',
  onButtonClick,
  className = ''
}: CardHorizontalProps) {
  return (
    <SCard
      className={`w-full max-w-3xl rounded-xl ${className}`}
      content={
        <div className='flex flex-col items-start gap-4 md:flex-row'>
          {/* Image */}
          <div className='w-full flex-shrink-0 md:w-auto'>
            <Image
              src={imageUrl || '/images/resources/courses.png'}
              alt={title}
              width={150}
              height={150}
              className='max-h-60 w-full rounded-lg object-cover md:h-[150px] md:w-[150px]'
            />
          </div>

          {/* Text content */}
          <div className='flex h-full min-h-[150px] w-full flex-col'>
            <h3 className='line-clamp-1 text-lg font-semibold text-gray-800'>{title}</h3>
            <p className='mt-1 line-clamp-3 text-sm text-gray-600 2xl:line-clamp-5'>{description}</p>

            {onButtonClick && (
              <Button
                variant={'outline'}
                onClick={onButtonClick}
                className='mt-auto w-fit rounded-full hover:bg-gray-100'
              >
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      }
    />
  )
}
