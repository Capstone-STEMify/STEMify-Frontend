'use client'

import Image from 'next/image'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Badge } from '@/components/shadcn/badge'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { formatDate } from '@/utils/index'
import { Calendar, Clock } from 'lucide-react'
import CourseAction from '@/features/resource/course/components/detail/enrolled/CourseAction'

type CourseDetailDescriptionProps = {
  courseId: number
}

export default function CourseDetailDescription({ courseId }: CourseDetailDescriptionProps) {
  const { data: courseData, isLoading: courseLoading, isFetching: courseFetching } = useGetCourseByIdQuery(courseId)

  if (courseLoading || courseFetching)
    return (
      <div className='flex h-fit items-center justify-center'>
        <LoadingComponent size={150} />
      </div>
    )

  if (!courseData) return <div>No Course Data</div>
  return (
    <div className='py-8'>
      <ScrollArea className='h-[480px]'>
        <section className='px-6'>
          <div className='relative mx-auto mb-8 aspect-square w-[160px] overflow-hidden rounded-2xl'>
            <Image
              src={
                courseData.data.imageUrl ||
                'https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=1109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt='Course Cover'
              fill
              priority
              sizes='160px'
              className='object-cover'
            />
          </div>

          <div>
            <p className='my-1 text-xs font-semibold uppercase'>Course</p>
            <div className='bg-muted-foreground mb-2 h-[0.1px] w-full'></div>

            <h1 className='mb-2 text-lg leading-tight font-bold text-gray-900 lg:text-lg'>{courseData.data.title}</h1>

            {/* Meta Information */}
            <div className='mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600'>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>{courseData.data.duration} minutes</span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                <span>{formatDate(courseData.data.createdDate)}</span>
              </div>
              {/* Age Range */}
              {courseData.data.ageRangeLabel} ages
            </div>
          </div>

          <div className='w-full space-y-3 text-left'>
            <div className='text-xs'>
              <h2 className='text-base font-semibold text-gray-900'>About this course</h2>
              <p className='leading-relaxed text-gray-700'>{courseData.data.description}</p>
            </div>
            {/* Tags Section */}
            <div className='space-y-2'>
              {/* Categories */}
              {courseData.data.categoryNames.length > 0 && (
                <div className='flex items-center gap-x-2'>
                  <h3 className='text-xs font-semibold text-gray-900'>Categories</h3>
                  <div className='flex gap-2'>
                    {courseData.data.categoryNames.map((category) => (
                      <Badge
                        key={category}
                        className='border-blue-200 bg-blue-50 text-blue-700 transition-colors select-none hover:bg-blue-100'
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {courseData.data.skillNames.length > 0 && (
                <div className='flex items-center gap-x-2'>
                  <h3 className='text-xs font-semibold text-gray-900'>Skills</h3>
                  <div className='flex gap-2'>
                    {courseData.data.skillNames.map((skill) => (
                      <Badge
                        key={skill}
                        className='border-green-200 bg-green-50 text-green-700 transition-colors select-none hover:bg-green-100'
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Standards */}
              {courseData.data.standardNames.length > 0 && (
                <div className='mb-2'>
                  <h3 className='mb-2 text-xs font-semibold text-gray-900'>Standards</h3>
                  <div className='flex flex-wrap gap-2'>
                    {courseData.data.standardNames.map((standard) => (
                      <Badge
                        key={standard}
                        variant='outline'
                        className='border-amber-200 bg-amber-50 text-amber-700 transition-colors select-none hover:bg-amber-100'
                      >
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollArea>
      <CourseAction course={courseData.data} />
    </div>
  )
}
