import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react' // Ensure this is the correct icon if you prefer the one in the image
import { fadeInUp } from '@/utils/motion'

// Sample learning points based on the image
const learningPoints = [
  'Design and query databases with SQL',
  'Understand relational database concepts',
  'Learn to normalize data effectively',
  'Write complex SQL queries for data analysis'
]

export default function AboutSection() {
  return (
    <motion.section
      id='about'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
      className='bg-white py-16'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-start gap-x-12 gap-y-10 lg:grid-cols-2'>
          <div>
            <div className='aspect-video overflow-hidden rounded-lg bg-black shadow-2xl'>
              <video controls className='h-full w-full' src='https://www.w3schools.com/html/mov_bbb.mp4'>
                <source src='https://www.w3schools.com/html/mov_bbb.mp4' type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className='mt-0 lg:mt-0'>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <div className='flex items-start'>
                <div className='mt-0.5 mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-3 w-3'>
                    <path
                      fillRule='evenodd'
                      d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div>
                  <h4 className='mb-1 font-medium text-red-700'>Unable to load progress information</h4>
                  <p className='text-sm text-red-600'>
                    Please enroll in the course to stay updated on progress or contact support if the error persists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
