import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Star, Users } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/utils/motion'
import { formatDuration } from '@/utils/index'
import { useTranslations } from 'next-intl'
import { Curriculum } from '../../types/curriculum.type'

interface StatsSectionProps {
  curriculum: Curriculum | undefined
}

export default function CurriculumStatsSection({ curriculum }: StatsSectionProps) {
  const t = useTranslations('course')
  const statsData = [
    {
      icon: BookOpen,
      value: curriculum?.courses.length,
      title: `${t('details.stats.course')}`,
      subtitle: `${t('details.stats.course_description')}`,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      value: formatDuration(
        curriculum && curriculum.courses
          ? curriculum.courses.reduce((total, course) => total + course.duration, 0)
          : 0
      ),
      title: `${t('details.stats.duration')}`,
      subtitle: `${t('details.stats.dur_description')}`,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      value: 0,
      title: `${t('details.stats.ratings')}`,
      subtitle: `${t('details.stats.rate_description')}`,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    }
  ]

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className='absolute inset-x-0 -bottom-24 z-10 px-4 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-7xl rounded-lg bg-white px-6 py-4 shadow-lg sm:px-6 lg:px-8'>
        <div className='grid grid-cols-3 gap-6 md:gap-8'>
          {statsData.map((stat, index) => (
            <motion.div key={index} variants={staggerItem} className='flex flex-col items-center text-center'>
              <div
                className={`inline-flex h-12 w-12 items-center justify-center ${stat.bgColor} mb-3 rounded-full shadow-sm`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className='mb-1 text-2xl font-bold text-gray-800'>{stat.value}</div>
              <div className='mb-1 text-sm font-semibold text-gray-700'>{stat.title}</div>
              {stat.subtitle && <div className='text-xs leading-tight text-gray-500'>{stat.subtitle}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
