'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HeroSection } from './myCourse/HeroSection'
import { QuickActions } from './myCourse/QuickActions'
import { ProgressOverview } from './myCourse/ProgressOverview'
import { RecentActivity } from './myCourse/RecentActivity'
import { CourseList } from './myCourse/CourseList'

export function MyCourses() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='min-h-screen bg-gray-50'
    >
      <HeroSection />
      {/* <QuickActions /> */}
      {/* <ProgressOverview /> */}
      {/* <RecentActivity /> */}

      {/* Course Content Section */}
      <section className='bg-sky-50 py-12'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='mb-8 text-center'
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CourseList />
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
