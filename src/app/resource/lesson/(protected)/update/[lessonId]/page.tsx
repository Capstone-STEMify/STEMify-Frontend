import UpsertLesson from '@/features/resource/lesson/components/UpsertLesson'
import UpsertSection from '@/features/resource/section/components/UpsertSection'
import React, { Suspense } from 'react'

export default function LessonUpdatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='mx-auto min-h-screen max-w-7xl space-y-10 p-4 md:p-8'>
        <UpsertLesson />
        <UpsertSection />
      </div>
    </Suspense>
  )
}
