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
      <div className='mx-auto min-h-screen max-w-[1300px] space-y-10 p-4 md:p-8'>
        <UpsertLesson />
      </div>
    </Suspense>
  )
}
