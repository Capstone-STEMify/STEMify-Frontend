import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/utils/motion'
import { Course } from '../../../types/course.type'

interface HeroSectionProps {
  course: Course
}

export default function SkillSection({ course }: HeroSectionProps) {
  return (
    <motion.section
      id='skill'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={staggerContainer}
      className='scroll-mt-32 bg-gray-50 py-16'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.h2 variants={staggerItem} className='mb-12 text-center text-3xl font-bold text-gray-900'>
          Skills learned from the course
        </motion.h2>

        <div className='grid gap-8 md:grid-cols-3'>
          {course.skillNames.map((skillName, index) => (
            <motion.div key={index} variants={staggerItem} className='space-y-4'>
              <div key={index} className='flex items-start rounded-lg bg-white p-4 shadow-sm'>
                <CheckCircle className='mt-1 mr-3 h-5 w-5 flex-shrink-0 text-green-500' />
                <span className='text-sm text-gray-700'>{skillName}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
