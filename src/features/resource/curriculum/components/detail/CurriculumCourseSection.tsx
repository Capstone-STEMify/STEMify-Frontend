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
    <div className='relative space-y-0 py-10'>
      <div className='clip-slant relative h-[400px] bg-[#fec708] py-16 text-center'>
        <h1 className='text-5xl'>{t('custom.courseListTitle')}</h1>
        <p className='mx-auto w-180 py-5'>{t('custom.courseListDescription')}</p>
      </div>

      <div className='relative z-10 mx-auto -mt-30 max-w-6xl'>
        <SCarousel
          variant='spacing'
          autoplayDelay={2000}
          items={Array.from({ length: courses.length }).map((_, i) => (
            <div className='p-1' key={i}>
              <CardLayout
                imageRatio='aspect-3/2'
                imageClassName='object-cover'
                onClick={() => router.push(`/resource/course/${courses[i].id}`)}
                imageSrc={courses[i].imageUrl || 'images/fallback.png'}
              >
                <div>
                  <h4 className='text-amber-custom-400 text-xs font-semibold'>
                    {t('custom.courseTag').toLocaleUpperCase()}
                  </h4>
                  <p className='text-md font-semibold text-gray-700'>{courses[i].title}</p>
                  <p className='mt-3 line-clamp-3 text-sm text-gray-500'>{courses[i].description}</p>
                </div>
              </CardLayout>
            </div>
          ))}
        />
      </div>
    </div>
  )
}
