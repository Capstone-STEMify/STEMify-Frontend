import { motion, useInView } from 'framer-motion'
import React, { useRef } from 'react'
import { Users2 } from 'lucide-react'
import { fadeInUp } from '@/utils/motion'

export default function CurrentClassSec() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const classrooms = [
    { name: 'test-classroom', members: 0, color: 'bg-gradient-to-r from-amber-400 to-red-500' },
    { name: 'test-classroom', members: 0, color: 'bg-gradient-to-r from-amber-400 to-red-500' }
  ]

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className='mx-auto max-w-7xl px-6 py-8'
    >
      <div className='mb-8 rounded-t-lg border-3 border-[#e6eef7] bg-sky-100 pt-6'>
        <div className='mb-6 flex items-start px-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Workspaces for teacher name</h3>
        </div>
        {classrooms.map((classroom, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className='flex items-center justify-between border border-gray-200 bg-white p-4 shadow-sm'
          >
            <div className='flex items-center gap-4'>
              <div className='h-full w-full rounded'>
                <img className='h-20 w-30 rounded' src='/HomeFiles/hcm.jpg' alt='class_img' />
              </div>
              <div className='w-full'>
                <h4 className='font-semibold text-gray-900'>{classroom.name}</h4>
                <div className='flex items-center gap-1 text-sm text-gray-500'>
                  <Users2 className='h-4 w-4' />
                  <span>{classroom.members} members</span>
                </div>
              </div>
            </div>
            <button className='rounded-lg bg-sky-300 p-2 font-medium text-white transition-colors hover:bg-sky-400'>
              View Class
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
