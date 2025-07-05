'use client'

import Image from 'next/image'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Badge } from '@/components/shadcn/badge'
import LessonAction from '@/features/resource/lesson/components/detail/LessonAction'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'


export default function LessonDescription() {
  const { data: lessonData, isLoading: lessonLoading, isFetching: lessonFetching } = useGetLessonByIdQuery(1)

  if (lessonLoading || lessonFetching)
    return (
      <div className='bg-blue-custom-50/60 flex min-h-screen items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )

  if (!lessonData) return <div>No Lesson Data</div>
  return (
    <div>
      <ScrollArea className='h-[480px] px-4 pt-4'>
        <section className='flex flex-col items-center'>
          {/* Thumbnail image */}
          <div className='mb-4 overflow-hidden rounded-xl shadow'>
            <Image
              src={
                lessonData.data.imageUrl ||
                'https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=1109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt='Wetlands Biome'
              width={250}
              height={250}
              className='object-fit'
            />
          </div>

          {/* Title & description */}
          <div className='w-full max-w-md space-y-3 text-left'>
            <p className='text-muted-foreground mb-1 text-xs font-semibold uppercase'>Lesson</p>
            {/* separotor */}
            <div className='bg-muted-foreground mb-2 h-[0.1px] w-full'></div>

            {/* Title */}
            <div>
              <h2 className='text-xl font-bold'>{lessonData.data.title}</h2>
              <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                By <span className='font-semibold text-black'>{lessonData.data.createdByUserId}</span>
              </h3>
            </div>

            {/* Description */}
            <p className='text-muted-foreground space-y-1 text-sm'>{lessonData.data.description}</p>

            {/* Categories */}
            <div>
              <h3 className='mb-2 text-sm font-medium'>Categories</h3>
              <div className='flex flex-wrap items-center gap-2'>
                {lessonData.data.categoryNames.map((cat) => (
                  <Badge key={cat} variant='outline' className='bg-sky-custom-100 select-none hover:scale-105'>
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollArea>
      <LessonAction />
    </div>
  )
}
