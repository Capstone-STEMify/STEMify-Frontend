import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import UpsertLesson from '@/features/resource/lesson/components/UpsertLesson'
import UpsertSection from '@/features/resource/section/components/SectionAndContent'
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
      <div className='mb-20 space-y-15'>
        <UpsertLesson />
        <UpsertSection />
      </div>
    </Suspense>
  )
}
