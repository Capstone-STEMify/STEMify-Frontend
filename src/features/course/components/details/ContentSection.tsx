import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronDown, Play, Users } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

export default function ContentSection() {
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null)

  const lectures = [
    {
      id: 1,
      title: 'Introduction to Relational Databases',
      duration: '8 lectures',
      time: '01:07:31',
      isExpanded: false
    },
    {
      id: 2,
      title: 'What is a Database? Relational Model',
      duration: '1 lecture',
      time: '07:30',
      isExpanded: false
    }
  ]

  return (
    <motion.section
      id='courses'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
      className='bg-white py-12 md:py-16'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl md:text-left'>Course Content</h2>

        <div className='mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-600 md:justify-start'>
          <span>📚 1 sections</span>
          <span>🎥 8 lectures</span>
          <span>⏱️ 1 minutes total</span>
        </div>

        <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12'>
          <div className='w-full space-y-4 lg:w-2/3'>
            {lectures.map((lecture) => (
              <div key={lecture.id} className='rounded-lg border border-gray-200'>
                <button
                  onClick={() => setExpandedLecture(expandedLecture === lecture.id ? null : lecture.id)}
                  className='flex w-full flex-col items-start justify-between p-4 text-left transition-colors duration-200 hover:bg-gray-50 sm:flex-row sm:items-center'
                >
                  <div className='mb-2 flex items-center sm:mb-0'>
                    <BookOpen className='mr-3 h-5 w-5 flex-shrink-0 text-blue-500' />
                    <span className='font-medium text-gray-900'>{lecture.title}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-500 sm:ml-4'>
                    <span className='mr-3 sm:mr-4'>{lecture.duration}</span>
                    <span className='mr-3 sm:mr-4'>{lecture.time}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        expandedLecture === lecture.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {expandedLecture === lecture.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className='overflow-hidden border-t border-gray-200 bg-gray-50 p-4'
                  >
                    <div className='space-y-2'>
                      <div className='flex cursor-pointer items-center text-sm text-gray-700 hover:text-blue-600'>
                        <Play className='mr-2 h-4 w-4 text-blue-500' />
                        <span>Lecture content will be displayed here (e.g., Video Title 1)</span>
                      </div>
                      <div className='flex cursor-pointer items-center text-sm text-gray-700 hover:text-blue-600'>
                        <Play className='mr-2 h-4 w-4 text-blue-500' />
                        <span>Sub-topic or resource link</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className='w-full rounded-lg bg-white p-6 shadow-xl lg:sticky lg:top-24 lg:w-1/3'>
            <h3 className='mb-6 text-xl font-bold text-gray-900'>Instructors</h3>
            <div className='flex items-start'>
              <img src={'/images/Rosie.jpg'} className='mr-4 h-16 w-16 flex-shrink-0 rounded-full' />
              <div>
                <h4 className='mb-1 font-medium break-all text-gray-900'>awesomeorg@gmail.com</h4>
                <p className='mb-2 text-sm text-gray-600'>by Coursera • ⭐️ 4.8 Reviews</p>
                <div className='flex items-center text-sm text-gray-500'>
                  <Users className='mr-1 h-4 w-4 text-blue-500' />
                  <span>Expert Instructor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
