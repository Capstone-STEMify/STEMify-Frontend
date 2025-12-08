'use client'

import Image from 'next/image'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Badge } from '@/components/shadcn/badge'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { formatDate } from '@/utils/index'
import { Calendar, Clock } from 'lucide-react'
import CourseAction from '@/features/resource/course/components/detail/enrolled/CourseAction'
import { useLocale, useTranslations } from 'next-intl'
import { Course } from '@/features/resource/course/types/course.type'

type CourseDetailDescriptionProps = {
  courseData: Course
}

export default function CourseDetailDescription({ courseData }: CourseDetailDescriptionProps) {
  const t = useTranslations('course')
  const locale = useLocale()

  return (
    <div className='py-8'>
      <ScrollArea className='h-[480px]'>
        <section className='w-sm px-6'>
          <div className='relative mx-auto mb-8 aspect-square w-[160px] overflow-hidden rounded-2xl'>
            <Image
              src={
                courseData.imageUrl ||
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
            <p className='my-1 text-xs font-semibold uppercase'>{t('details.title')}</p>
            <div className='bg-muted-foreground mb-2 h-[0.1px] w-full'></div>

            <h1 className='mb-2 text-lg leading-tight font-bold text-gray-900 lg:text-lg'>{courseData.title}</h1>

            {/* Meta Information */}
            <div className='mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600'>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>
                  {courseData.duration} {t('details.tags.dur_unit')}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                <span>{formatDate(courseData.createdDate, { locale })}</span>
              </div>
              {/* Age Range */}
              {courseData.ageRangeLabel} {t('details.tags.age_unit')}
            </div>
          </div>

          <div className='w-full space-y-3 text-left'>
            <div className='text-xs'>
              <h2 className='text-base font-semibold text-gray-900'>{t('details.about')}</h2>
              <p className='leading-relaxed text-gray-700'>{courseData.description}</p>
            </div>
            {/* Tags Section */}
            <div className='max-w-[260px] space-y-2 sm:max-w-[260px] md:max-w-[350px]'>
              {/* Topics */}
              {courseData.topicNames.length > 0 && (
                <div className='flex flex-wrap items-center gap-x-2 gap-y-2'>
                  <h3 className='text-xs font-semibold whitespace-nowrap text-gray-900'>{t('details.tags.topic')}:</h3>
                  {courseData.topicNames.map((topic) => (
                    <Badge
                      key={topic}
                      className='border-blue-200 bg-blue-50 text-blue-700 transition-colors select-none hover:bg-blue-100'
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Skills */}
              {courseData.skillNames.length > 0 && (
                <div className='flex flex-wrap items-center gap-x-2 gap-y-2'>
                  <h3 className='text-xs font-semibold whitespace-nowrap text-gray-900'>{t('details.tags.skill')}</h3>
                  {courseData.skillNames.map((skill) => (
                    <Badge
                      key={skill}
                      className='border-green-200 bg-green-50 text-green-700 transition-colors select-none hover:bg-green-100'
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Standards */}
              {courseData.standardNames.length > 0 && (
                <div className='mb-2'>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-2'>
                    <h3 className='text-xs font-semibold whitespace-nowrap text-gray-900'>
                      {t('details.tags.standard')}
                    </h3>
                    {courseData.standardNames.map((standard) => (
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
      <CourseAction course={courseData} />
    </div>
  )
}
