import React from 'react'
import { motion } from 'framer-motion'
import { CalendarFold, BookOpen, Heart } from 'lucide-react'
import { TbDoorExit } from 'react-icons/tb'
import { fadeInUp } from '@/utils/motion'
import { Course } from '../../types/course.type'

interface HeroSectionProps {
  course: Course
}

export default function HeroSection({ course }: HeroSectionProps) {
  return (
    <motion.section
      initial='hidden'
      animate='visible'
      variants={fadeInUp}
      className='mt-12 bg-gradient-to-br from-sky-200 to-blue-100 py-26'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='space-y-6'>
            <div className='inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-sm font-medium text-white'>
              <CalendarFold className='mr-2 h-4 w-4' />
              Age Ranges: {course.ageRangeLabel}
            </div>

            <h1 className='text-4xl leading-tight font-bold text-gray-900 lg:text-5xl'>{course.title}</h1>

            <p className='text-lg leading-relaxed text-gray-600'>{course.description}</p>

            <div className='pace-x-6 text-sm text-gray-600'>
              <div className='mb-4 flex items-center gap-2'>
                <p className='text-lg font-bold'>Category: </p>
                {course.categoryNames.map((category, index) => (
                  <div key={index} className='flex w-fit items-center rounded-full bg-white px-3 py-1 text-sky-400'>
                    <BookOpen className='mr-2 h-4 w-4' />
                    {category}
                  </div>
                ))}
              </div>
              {/* <div className='space-y-2'>
                <p className='text-lg font-bold'>Grades</p>
                <div className='space-y-1 text-sm text-gray-600'>
                  <div>
                    <span className='font-medium'>United States:</span> K, 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, UK
                  </div>
                  <div>
                    <span className='font-medium'>England:</span> Early Years, Year 1, Year 2, Year 3, Year 4, Year 5,
                    Year 6, Year 7, Year 8
                  </div>
                  <div>
                    <span className='font-medium'>UK - Scotland:</span> Early Learning and Childcare, S1, P1
                  </div>
                </div>
              </div> */}
            </div>

            <div className='flex flex-col gap-4 sm:flex-row'>
              <button className='flex items-center justify-center rounded-lg bg-sky-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-sky-500'>
                <TbDoorExit className='mr-2 h-5 w-5' />
                Assign to Student
              </button>
              <button className='flex items-center justify-center rounded-lg border bg-white px-8 py-3 font-medium text-sky-400 transition-colors duration-200 hover:border-sky-400'>
                <Heart className='mr-2 h-5 w-5' />
                Wishlist
              </button>
            </div>
          </div>

          <div className='hidden w-fit items-center justify-center lg:flex lg:justify-end'>
            <img
              src={'/HomeFiles/hcm.jpg'}
              alt='Database Design and Querying with SQL Server Course Preview'
              className='h-auto w-full max-w-lg rounded-2xl border-4 border-white object-cover shadow-xl shadow-amber-400'
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
