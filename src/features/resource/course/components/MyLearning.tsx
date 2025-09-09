'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { MyLearningHero } from '@/features/resource/course/components/my-learning/MyLearningHero'
import { MyLearningList } from '@/features/resource/course/components/my-learning/MyLearningList'

export function MyLearning() {
  const auth = useAppSelector((state) => state.auth)
  const { data } = useSearchEnrollmentQuery({ studentId: auth.user?.userId }, { skip: !auth.token })
  const course = data?.data
  const studentId = auth.user?.userId

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className='bg-gray-50'>
      <MyLearningHero course={course} studentId={studentId}/>

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
            <MyLearningList studentId={studentId} />
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
