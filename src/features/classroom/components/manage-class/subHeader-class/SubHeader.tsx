import { fadeInUp } from '@/utils/motion'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import React, { useRef } from 'react'

export default function SubHeader() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className='border-b border-gray-200 bg-white px-6 py-4'
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <div className='text-gray-600'>Jump Into Classroom Creation</div>
        <Link href={'/teacher/classrooms/create-steps'}>
          <button className='rounded-lg bg-amber-400 px-6 py-2 font-medium text-white transition-colors hover:bg-amber-500'>
            Create Your Classroom
          </button>
        </Link>
      </div>
    </motion.section>
  )
}
