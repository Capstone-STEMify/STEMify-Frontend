'use client'
import React from 'react'
import { motion } from 'framer-motion'
import SyllabusTable from './pacing-guide/GuideTable'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import GuideLessonDetails from './pacing-guide/GuideLessonDetails'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function PacingGuide() {
  const { lessonId } = useParams()
  const { data, isLoading } = useGetLessonByIdQuery(Number(lessonId), { skip: !lessonId })

  if (isLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )

  if (!data) {
    return <SEmpty title='No lesson found' description='Please try again later.' />
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <motion.div variants={containerVariants} initial='hidden' animate='visible' className='space-y-8'>
          <GuideLessonDetails lesson={data?.data} />
          <SyllabusTable />
        </motion.div>
      </div>
    </div>
  )
}
