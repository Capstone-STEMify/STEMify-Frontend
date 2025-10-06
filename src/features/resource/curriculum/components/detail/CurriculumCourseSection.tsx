'use client'
import CardLayout from '@/components/shared/card/CardLayout'
import { SCarousel } from '@/components/shared/SCarousel'
import { Course } from '@/features/resource/course/types/course.type'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'

type CurriculumCourseSectionProps = {
  courses: Course[]
}
export default function CurriculumCourseSection({ courses }: CurriculumCourseSectionProps) {
  const t = useTranslations('curriculum')
  const router = useRouter()
  return (
    <div className='relative space-y-0 py-14 pb-20'>
      <div className='clip-slant relative h-[400px] bg-[#d8e9ff] py-16 text-center'>
        <h1 className='text-5xl'>{t('custom.courseListTitle')}</h1>
        <p className='mx-auto w-180 py-5'>{t('custom.courseListDescription')}</p>
      </div>

      <div className='relative z-10 mx-auto -mt-30 max-w-6xl'>
        <SCarousel
          variant='spacing'
          autoplayDelay={2000}
          items={courses.map((course, i) => (
            <div className='group cursor-pointer p-2.5' key={course.id}>
              <CardLayout
                imageRatio='aspect-3/2'
                imageClassName='object-cover transition-transform duration-300 group-hover:scale-110'
                onClick={() => router.push(`/resource/course/${course.id}`)}
                imageSrc={course.imageUrl || 'images/fallback.png'}
                className='rounded-3xl'
              >
                <div className='flex h-full flex-col justify-between p-2'>
                  <div className='mb-6 min-h-[130px]'>
                    <h4 className='text-amber-custom-400 text-sm font-semibold'>
                      {t('custom.courseTag').toLocaleUpperCase()}
                    </h4>
                    <p className='text-xl font-semibold text-gray-700'>{course.title}</p>
                    <p className='mt-3 line-clamp-3 text-sm text-gray-500'>{course.description}</p>
                  </div>
                </div>
              </CardLayout>
            </div>
          ))}
        />
      </div>
    </div>
  )
}
