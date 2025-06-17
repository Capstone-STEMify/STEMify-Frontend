import { fadeInUp } from '@/utils/motion'
import { motion, useInView } from 'framer-motion'
import { Trophy } from 'lucide-react'
import React, { useRef } from 'react'

export default function TipSec() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className='mx-auto max-w-7xl px-6 pb-8'
    >
      <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm'>
        <div className='flex flex-col items-center gap-8 lg:flex-row'>
          <div className='flex-shrink-0'>
            <div className='flex h-32 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-emerald-100'>
              <Trophy className='h-12 w-12 text-amber-600' />
            </div>
          </div>
          <div className='flex-1 text-center lg:text-left'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>Join the New Teacher Challenge!</h2>
            <p className='mb-6 max-w-2xl text-gray-600'>
              Get exclusive tips and resources designed to help you launch your first classroom faster! Eligible
              teachers who publish their first classroom on time will receive a special bonus to celebrate. Start today!
            </p>
            <button className='rounded-lg font-medium text-amber-400 underline transition-colors hover:text-amber-500'>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
