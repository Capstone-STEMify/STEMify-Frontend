import { fadeInUp } from '@/utils/motion'
import { motion, useInView } from 'framer-motion'
import React, { useRef } from 'react'

export default function CTASec() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className='mx-auto max-w-7xl px-6 py-12 text-center'
    >
      <h2 className='mb-8 text-2xl font-bold text-gray-900'>Are You Ready to Begin?</h2>
      <button className='transform rounded-lg bg-amber-400 px-8 py-4 text-lg font-medium text-white transition-all hover:scale-105 hover:bg-amber-500'>
        Create Your Classroom
      </button>
    </motion.section>
  )
}
