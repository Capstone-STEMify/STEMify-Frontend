import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Lesson } from '@/features/resource/lesson/types/lesson.type'

type GuideLessonDetailsProps = {
  lesson: Lesson
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

const CircleIcon = () => (
  <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-400'>
    <div className='h-2 w-2 rounded-full bg-gray-400' />
  </div>
)

export default function GuideLessonDetails({ lesson }: GuideLessonDetailsProps) {
  const fallback = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop'

  return (
    <motion.section initial='hidden' animate='visible' variants={itemVariants} className='space-y-8'>
      <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.7fr_1fr]'>
        <div>
          {/* <p className='text-xs font-semibold tracking-wider text-gray-500 uppercase'>{breadcrumb}</p> */}

          <h1 className='mt-2 text-3xl font-bold text-gray-900 sm:text-4xl'>{lesson.title}</h1>

          {/* <p className='mt-2 text-sm text-gray-700'>
            By <span className='font-semibold'>{lesson.author}</span>
          </p> */}

          <p className='mt-4 leading-7 text-gray-700'>{lesson.description}</p>

          <div className='mt-6 flex flex-col gap-8 sm:flex-row'>
            <div className='flex items-start gap-3 border-l-4 border-l-gray-500 pl-1'>
              <div>
                <h3 className='text-sm font-bold tracking-wide text-gray-800 uppercase'>Age Range</h3>
                <p className='text-lg font-bold text-gray-900'>{lesson.ageRangeLabel}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 border-l-4 border-l-gray-500 pl-1'>
              <div>
                <h3 className='text-sm font-bold tracking-wide text-gray-800 uppercase'>Duration</h3>
                <p className='text-lg font-bold text-gray-900'>{lesson.duration}</p>
              </div>
            </div>
          </div>

          <div className='mt-8'>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>Aligned Standards</h3>
            <p className='leading-relaxed text-gray-700'>{lesson.standardNames.join(', ')}</p>
          </div>

          <div className='mt-6'>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>Grades</h3>
            <p className='leading-relaxed text-gray-700'>{lesson.skillNames.join(', ')}</p>
          </div>

          <div className='mt-6'>
            <h3 className='mb-3 text-sm font-bold tracking-wide text-gray-800 uppercase'>Topics</h3>
            <div className='flex flex-wrap gap-3'>{lesson.topicNames.join(', ')}</div>
          </div>
        </div>

        <div className='lg:pl-2'>
          <div className='overflow-hidden rounded-2xl bg-slate-100 shadow-sm'>
            <img
              src={lesson.imageUrl || fallback}
              alt='Lesson artwork'
              className='aspect-[4/3] h-full w-full object-cover'
              loading='lazy'
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
