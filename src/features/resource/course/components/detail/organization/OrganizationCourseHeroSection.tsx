import React from 'react'
import { motion } from 'framer-motion'
import { CalendarFold } from 'lucide-react'
import { fadeInUp } from '@/utils/motion'
import { Course } from '../../../types/course.type'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import BackButton from '@/components/shared/button/BackButton'
import { useTranslations } from 'next-intl'

type OrganizationCourseHeroSectionProps = {
  course: Course
}

type TagGroupProps = {
  label: string
  items: string[]
  className?: string
}

const TagGroup = ({ label, items, className }: TagGroupProps) => (
  <div className='mb-4 gap-1'>
    <div className='flex flex-wrap gap-2'>
      <p className='font-semibold'>{label}: </p>
      {items.map((item, index) => (
        <Badge key={index} className={`${className} rounded-full px-3 py-1`}>
          {item}
        </Badge>
      ))}
    </div>
  </div>
)

export default function OrganizationCourseHeroSection({ course }: OrganizationCourseHeroSectionProps) {
  const t = useTranslations('course')

  return (
    <motion.section initial='hidden' animate='visible' variants={fadeInUp} className='bg-sky-50 pt-5 pb-26'>
      <div className='mx-auto max-w-7xl sm:px-6 lg:px-10'>
        <div className='grid items-center gap-8 lg:grid-cols-2'>
          <div className='space-y-4'>
            <BackButton />
            <div className='mx-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800'>
              <CalendarFold className='mr-2 h-4 w-4' />
              {t('details.tags.ageRange')}: {course.ageRangeLabel}
            </div>

            <h1 className='text-lg leading-tight font-bold text-blue-800 lg:text-2xl'>{course.title}</h1>

            <p className='text-lg leading-relaxed text-gray-600'>{course.description}</p>

            <div className='space-x-6 text-sm'>
              {/* Category */}
              <TagGroup label={t('details.tags.topic')} items={course.topicNames} className='bg-red-100 text-red-800' />
              {/* Skill */}
              <TagGroup
                label={t('details.tags.skill')}
                items={course.skillNames}
                className='bg-emerald-100 text-emerald-700'
              />
              {/* Standard */}
              <TagGroup
                label={t('details.tags.standard')}
                items={course.standardNames}
                className='text-orange-custom-500 bg-yellow-custom-50'
              />
            </div>
          </div>

          <div className='mb-5 w-full flex-1'>
            <Image
              src={course.imageUrl || '/images/fallback.png'}
              width={400}
              height={250}
              alt={course.title ?? ''}
              className='aspect-[16/10] w-full rounded-2xl border-4 border-white object-cover'
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
