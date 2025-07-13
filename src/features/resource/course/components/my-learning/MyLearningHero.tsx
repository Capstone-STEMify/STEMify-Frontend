'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PaginatedResult } from '@/types/baseModel'
import { Enrollment } from '@/features/enrollment/types/enrollment.type'

const mockMyCourses = {
  courses: [
    { progress: { progressPercentage: 100 } },
    { progress: { progressPercentage: 87 } },
    { progress: { progressPercentage: 65 } },
    { progress: { progressPercentage: 100 } },
    { progress: { progressPercentage: 43 } },
    { progress: { progressPercentage: 92 } },
    { progress: { progressPercentage: 100 } },
    { progress: { progressPercentage: 78 } },
    { progress: { progressPercentage: 56 } },
    { progress: { progressPercentage: 34 } },
    { progress: { progressPercentage: 89 } },
    { progress: { progressPercentage: 100 } }
  ]
}
type MyLearningHeroProps = {
  course?: PaginatedResult<Enrollment>
}

export function MyLearningHero({ course }: MyLearningHeroProps) {
  const totalCourses = course?.items.length || 0
  const averageProgress = 0
  const completedCourses = 0
  const inProgressCourses = 0
  const notStartedCourses = 0

  const stats = [
    { label: 'Total Courses', value: totalCourses },
    { label: 'Completed', value: completedCourses },
    { label: 'In Progress', value: `${totalCourses - completedCourses - notStartedCourses}` },
    { label: 'Not Start', value: notStartedCourses }
  ]

  return (
    <section className='bg-sky-custom-600 relative overflow-hidden p-6 text-white sm:p-10'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex flex-col justify-between gap-16 md:flex-row md:items-center'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='flex-1'
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='mb-2 text-3xl font-bold md:text-4xl'
            >
              Your Learning Journey
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='mb-4 max-w-xl text-blue-100'
            >
              Continue learning and developing your skills with your enrolled courses.
              {totalCourses > 0 && ` You're currently taking ${totalCourses} courses.`}
            </motion.p>

            <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + index * 0.1,
                    type: 'spring',
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transition: { duration: 0.2 }
                  }}
                  className='cursor-pointer rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg'
                >
                  <motion.h3
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className='mb-1 text-xl font-bold sm:text-2xl'
                  >
                    {stat.value}
                  </motion.h3>
                  <p className='text-sm text-blue-100'>{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className='mt-8 rounded-lg bg-white/10 p-4 backdrop-blur-sm'
            >
              <div className='mb-3 flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-white'>Overall Progress</h3>
                <span className='text-2xl font-bold text-white'>{averageProgress}%</span>
              </div>
              <div className='h-3 w-full rounded-full bg-white/20'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${averageProgress}%` }}
                  transition={{ duration: 1.5, delay: 1.5, ease: 'easeOut' }}
                  className='h-3 rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 shadow-lg'
                  style={{
                    background: 'white'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
