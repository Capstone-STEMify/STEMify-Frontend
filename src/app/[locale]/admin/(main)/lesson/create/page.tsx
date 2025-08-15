import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import UpsertLesson from '@/features/resource/lesson/components/UpsertLesson'
import React, { Suspense } from 'react'

export default function CreateLessonPage() {
  return (
    <Suspense
      fallback={
        <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
          <LoadingComponent size={150} />
        </div>
      }
    >
      <div className='mb-20'>
        <UpsertLesson />
      </div>
    </Suspense>
  )
}
