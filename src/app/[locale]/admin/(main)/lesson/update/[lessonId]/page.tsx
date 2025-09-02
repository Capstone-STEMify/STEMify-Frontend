import BackButton from '@/components/shared/button/BackButton'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import UpsertLesson from '@/features/resource/lesson/components/upsert/UpsertLesson'
import SectionAndContent from '@/features/resource/section/components/list/SectionAndContent'
import UpsertSection from '@/features/resource/section/components/upsert/UpsertSection'
import React, { Suspense } from 'react'

export default function LessonUpdatePage() {
  return (
    <Suspense
      fallback={
        <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
          <LoadingComponent size={150} />
        </div>
      }
    >
      <div className='mb-20'>
        <BackButton />
        <div className='space-y-15'>
          <UpsertLesson />
          <SectionAndContent />
        </div>
      </div>
    </Suspense>
  )
}
