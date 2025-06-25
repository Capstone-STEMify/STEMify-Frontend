import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/utils/motion'

export default function HeroClassSec() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className='mx-auto max-w-7xl px-6 pt-12'
    >
      <motion.div variants={fadeInUp} className='mb-12 text-center'>
        <p className='mb-8 text-gray-600'>Based on your experience, we think these resources will be helpful.</p>
      </motion.div>

      <motion.div variants={fadeInUp} className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='flex flex-col items-center gap-8 lg:flex-row'>
          <div className='flex-shrink-0'>
            <div className='flex h-32 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100'>
              <div className='relative'>
                <div className='h-12 w-16 rounded bg-amber-400 opacity-80'></div>
                <div className='absolute -top-2 -right-2 h-8 w-12 rounded bg-orange-400 opacity-60'></div>
                <Users className='absolute top-1 left-1 h-6 w-6 text-white' />
              </div>
            </div>
          </div>
          <div className='flex-1 text-center lg:text-left'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>Create an Engaging Classroom</h2>
            <p className='mb-6 max-w-2xl text-gray-600'>
              Whether you've been teaching for years or are teaching for the first time, you can make an engaging
              classroom. We've compiled resources and best practices to help you get to the next level, no matter where
              you're starting.
            </p>
            <button className='rounded-lg font-medium text-amber-400 underline transition-colors hover:text-amber-500'>
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
