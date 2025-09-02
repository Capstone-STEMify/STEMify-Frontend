'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { containerVariants } from '@/utils/motion'
import BackButton from '@/components/shared/button/BackButton'
import GuideLessonDetails from '@/features/resource/lesson/components/pacing-guide/GuideLessonDetails'
import GuideTable from '@/features/resource/lesson/components/pacing-guide/GuideTable'

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
    <div className='min-h-screen'>
      <div className='mx-auto flex max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8'>
        <BackButton />
        <motion.div variants={containerVariants} initial='hidden' animate='visible' className='space-y-8'>
          <GuideLessonDetails lesson={data?.data} />
          <GuideTable lessonId={Number(lessonId)} />
        </motion.div>
      </div>
    </div>
  )
}
