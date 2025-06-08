import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Award, Clock, Users } from 'lucide-react'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 2 } }
}

const statsData = [
  {
    icon: BookOpen,
    value: '1',
    title: 'Course lessons',
    subtitle: 'Comprehensive curriculum',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Star,
    value: '0 ★',
    title: 'Rating',
    subtitle: '0 reviews',
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  },
  {
    icon: Award,
    value: 'Intermediate',
    title: 'Difficulty',
    subtitle: 'Suitable for all levels',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Clock,
    value: '1',
    title: 'Hour(s)',
    subtitle: 'Self-paced learning',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Users,
    value: '0',
    title: 'Students',
    subtitle: 'Join the community',
    iconColor: 'text-red-500',
    bgColor: 'bg-red-100'
  }
]

export default function StatsSection() {
  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className='absolute inset-x-0 -bottom-24 z-10 px-4 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-lg sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6'>
          {statsData.map((stat, index) => (
            <motion.div key={index} variants={staggerItem} className='py-2 text-center'>
              <div className={`inline-flex h-10 w-10 items-center justify-center ${stat.bgColor} mb-2 rounded-full`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className='text-xl font-bold text-gray-800'>{stat.value}</div>
              <div className='mt-1 text-xs font-semibold text-gray-700'>{stat.title}</div>
              {stat.subtitle && <div className='mt-0.5 text-xs text-gray-500'>{stat.subtitle}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
