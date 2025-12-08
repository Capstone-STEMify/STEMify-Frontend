'use client'

import Image from 'next/image'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Badge } from '@/components/shadcn/badge'
import LessonAction from '@/features/resource/lesson/components/detail/LessonAction'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { formatDate } from '@/utils/index'
import { Calendar, Clock } from 'lucide-react'
import { ApiSuccessResponse } from '@/types/baseModel'
import { Lesson } from '@/features/resource/lesson/types/lesson.type'
import { useLocale, useTranslations } from 'next-intl'
import { LicenseType } from '@/types/userRole'
import { useAppSelector } from '@/hooks/redux-hooks'

type LessonDescriptionProps = {
  lessonData?: ApiSuccessResponse<Lesson>
  lessonLoading: boolean
}

export default function LessonDescription({ lessonData, lessonLoading }: LessonDescriptionProps) {
  const locale = useLocale()
  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole)

  const isTeacher = userRole === LicenseType.TEACHER

  const t = useTranslations('LessonDetails')
  if (lessonLoading)
    return (
      <div className='flex h-[500px] items-center justify-center'>
        <LoadingComponent size={50} />
      </div>
    )

  if (!lessonData || !lessonData.data) {
    return (
      <div className='flex items-center justify-center'>
        <p className='text-gray-500'>{t('notFound.title')}</p>
      </div>
    )
  }
  return (
    <div>
      <ScrollArea className={isTeacher ? 'h-[480px]' : 'h-[540px]'}>
        <section className='w-sm px-6'>
          <div className='relative mx-auto mb-8 aspect-square w-[160px] overflow-hidden rounded-2xl'>
            <Image
              src={
                lessonData.data.imageUrl ||
                'https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=1109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt='Lesson Cover'
              fill
              className='object-cover'
            />
          </div>

          <div>
            <p className='my-1 text-xs font-semibold uppercase'>{t('lesson.title')}</p>
            <div className='bg-muted-foreground mb-2 h-[0.1px] w-full'></div>

            <h1 className='mb-2 line-clamp-2 text-lg font-bold break-words text-gray-900'>{lessonData.data.title}</h1>

            {/* Meta Information */}
            <div className='mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600'>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>
                  {lessonData.data.duration} {t('lesson.dur_unit')}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                <span>{formatDate(lessonData.data.createdDate, { locale })}</span>
              </div>
              {/* Age Range */}
              {lessonData.data.ageRangeLabel} {t('lesson.age_unit')}
            </div>
          </div>

          <div className='w-full space-y-3 text-left'>
            <div className='text-xs'>
              <h2 className='text-base leading-relaxed font-semibold text-gray-900'>{t('lesson.about')}</h2>
              <p className='leading-relaxed break-words whitespace-pre-wrap text-gray-700'>
                {lessonData.data.description}
              </p>
            </div>
            {/* Tags Section */}
            <div className='max-w-[260px] space-y-2 sm:max-w-[260px] md:max-w-[350px]'>
              {/* Topics */}
              {lessonData.data.topicNames.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  <h3 className='text-xs font-semibold whitespace-nowrap text-gray-900'>{t('lesson.topic')}</h3>
                  {lessonData.data.topicNames.map((topic) => (
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
              {lessonData.data.skillNames.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  <h3 className='text-xs font-semibold text-gray-900'>{t('lesson.skill')}</h3>
                  {lessonData.data.skillNames.map((skill) => (
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
              {lessonData.data.standardNames.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  <h3 className='mb-2 text-xs font-semibold whitespace-nowrap text-gray-900'>{t('lesson.standard')}</h3>
                  {lessonData.data.standardNames.map((standard) => (
                    <Badge
                      key={standard}
                      variant='outline'
                      className='border-amber-200 bg-amber-50 text-amber-700 transition-colors select-none hover:bg-amber-100'
                    >
                      {standard}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollArea>
      {isTeacher && <LessonAction lessonId={lessonData.data.id} />}
    </div>
  )
}
