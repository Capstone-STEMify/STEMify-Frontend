import React from 'react'
import { motion } from 'framer-motion'
import { CalendarFold, BookOpen, Heart } from 'lucide-react'
import { TbDoorExit } from 'react-icons/tb'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

export default function HeroSection() {
  return (
    <motion.section
      initial='hidden'
      animate='visible'
      variants={fadeInUp}
      className='bg-gradient-to-br from-sky-200 to-blue-100 py-26'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='space-y-6'>
            <div className='inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-sm font-medium text-white'>
              <CalendarFold className='mr-2 h-4 w-4' />
              Age Ranges: 8-14+
            </div>

            <h1 className='text-4xl leading-tight font-bold text-gray-900 lg:text-5xl'>
              Database Design and Querying with SQL Server
            </h1>

            <p className='text-lg leading-relaxed text-gray-600'>
              This course will help you understand relational databases and how to use SQL to design and query data. You
              will learn how to create tables, query data, optimize queries, and manage databases.
            </p>

            <div className='pace-x-6 text-sm text-gray-600'>
              <div className='mb-4 flex items-center gap-2'>
                <p className='text-lg font-bold'>Category: </p>
                <div className='flex w-fit items-center rounded-full bg-white px-3 py-1 text-sky-400'>
                  <BookOpen className='mr-2 h-4 w-4' />
                  IT & Software
                </div>
              </div>
              <div className='flex items-center'>
                <img src={'/images/Rosie.jpg'} className='mr-4 h-10 w-10 flex-shrink-0 rounded-full' />
                by awesomeorg@gmail.com
              </div>
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
