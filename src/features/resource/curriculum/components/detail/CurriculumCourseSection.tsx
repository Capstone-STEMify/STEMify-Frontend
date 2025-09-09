import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { SCarousel } from '@/components/shared/SCarousel'
import { Course } from '@/features/resource/course/types/course.type'
import { useTranslations } from 'next-intl'
import React from 'react'

type CurriculumCourseSectionProps = {
  courses: Course[]
}
export default function CurriculumCourseSection({ courses }: CurriculumCourseSectionProps) {
  const t = useTranslations('curriculum')
  return (
    <div className='space-y-10 py-10'>
      <div className='text-center'>
        <h1 className='text-5xl'>{t('custom.courseListTitle')}</h1>
        <hr className='mx-auto my-6 w-1/4 border-2 border-amber-400' />
        <p className='mx-auto w-180 py-5'>{t('custom.courseListDescription')}</p>
      </div>
      <SCarousel
        variant='spacing'
        autoplayDelay={2000}
        items={Array.from({ length: courses.length }).map((_, i) => (
          <div className='p-1' key={i}>
            <CardLayout
              imageSrc={courses[i].imageUrl || 'images/fallback.png'}
              size='md'
              children={
                <div>
                  <h4 className='text-amber-custom-400 text-xs font-semibold'>
                    {t('custom.courseTag').toLocaleUpperCase()}
                  </h4>
                  <p className='text-md font-semibold text-gray-700'>{courses[i].title}</p>
                  <p className='mt-3 line-clamp-3 text-sm text-gray-500'>{courses[i].description}</p>
                </div>
              }
            />
          </div>
        ))}
      />
    </div>
  )
}
