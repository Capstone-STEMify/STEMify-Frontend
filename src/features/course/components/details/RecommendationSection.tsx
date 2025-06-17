import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/utils/motion'

export default function RecommendationSection() {
  const courses = [
    {
      title: 'React - The Complete Guide 2025 (incl. Next.js, Redux)',
      author:
        'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
      rating: 4.6,
      students: '100+',
      age: '8 - 14 years old'
    },
    {
      title: 'The Ultimate React Course 2024: React, Next.js...',
      author:
        'Master modern React from beginner to advanced! Context API, React Query, Redux Toolkit, Tailwind, advanced patterns',
      rating: 4.7,
      students: '130+',
      age: '8 - 14 years old'
    },
    {
      title: 'Front-end Web Development with React from...',
      author:
        'This course explores the front-end web development using the popular React framework. You will learn React Router and Flux architecture',
      rating: 4.5,
      students: '50+',
      age: '8 - 14 years old'
    }
  ]

  return (
    <motion.section
      id='suggestions'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={staggerContainer}
      className='bg-white py-16'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.h2 variants={staggerItem} className='mb-8 text-3xl font-bold text-gray-900'>
          Students also bought
        </motion.h2>

        <div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {courses.map((course, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md'
            >
              <div className='h-32 bg-gradient-to-r from-blue-500 to-purple-600'></div>
              <div className='p-4'>
                <div className='mb-2'>
                  <span className='inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-700'>{course.age}</span>
                </div>
                <h3 className='mb-2 line-clamp-2 font-medium text-gray-900'>{course.title}</h3>
                <p className='mb-3 line-clamp-2 text-sm text-gray-600'>{course.author}</p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='mr-2 flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className='text-sm text-gray-600'>{course.rating}</span>
                  </div>
                  <span className='text-sm text-gray-500'>{course.students}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className='text-center'>
          <button className='rounded-lg bg-sky-400 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-sky-500'>
            Show more courses
          </button>
        </div>
      </div>
    </motion.section>
  )
}
