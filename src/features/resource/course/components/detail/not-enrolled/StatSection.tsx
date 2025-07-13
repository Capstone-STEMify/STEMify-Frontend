import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Users } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/utils/motion'
import { formatDuration } from '@/utils/index'
import { Course } from '@/features/resource/course/types/course.type'

interface StatsSectionProps {
  course: Course
}

export default function StatsSection({ course }: StatsSectionProps) {
  const statsData = [
    {
      icon: BookOpen,
      value: course.lessonIds.length,
      title: 'Course section(s)',
      subtitle: 'Comprehensive curriculum',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      value: formatDuration(course.duration),
      title: 'Duration',
      subtitle: 'Self-paced learning',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Users,
      value: course.downloadCount ?? 0,
      title: 'Downloads',
      subtitle: 'Join the community',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100'
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
