'use client'

import Image from 'next/image'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Badge } from '@/components/shadcn/badge'
import LessonAction from '@/features/resource/lesson/components/detail/LessonAction'

type LessonDescriptionProps = {
  lessonId: number
  imageUrl: string
  title: string
  author: string
  description: string
  categories?: string[]
}

export default function LessonDescription({
  lessonId,
  imageUrl,
  title,
  author,
  description,
  categories = []
}: LessonDescriptionProps) {
  return (
    <div>
      <ScrollArea className='h-[480px] px-4 pt-4'>
        <section className='flex flex-col items-center'>
          {/* Thumbnail image */}
          <div className='mb-4 overflow-hidden rounded-xl shadow'>
            <Image src={imageUrl} alt='Wetlands Biome' width={250} height={250} className='object-fit' />
          </div>

          {/* Title & description */}
          <div className='w-full max-w-md space-y-3 text-left'>
            <p className='text-muted-foreground mb-1 text-xs font-semibold uppercase'>Lesson</p>
            {/* separotor */}
            <div className='bg-muted-foreground mb-2 h-[0.1px] w-full'></div>

            {/* Title */}
            <div>
              <h2 className='text-xl font-bold'>{title}</h2>
              <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                By <span className='font-semibold text-black'>{author}</span>
              </h3>
            </div>

            {/* Description */}
            <p className='text-muted-foreground space-y-1 text-sm'>{description}</p>

            {/* Categories */}
            <div>
              <h3 className='mb-2 text-sm font-medium'>Categories</h3>
              <div className='flex flex-wrap items-center gap-2'>
                {categories.map((category) => (
                  <Badge key={category} variant='outline' className='bg-skye-custom-100 select-none hover:scale-105'>
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollArea>
      {/* Actions */}
      <LessonAction />
    </div>
  )
}
