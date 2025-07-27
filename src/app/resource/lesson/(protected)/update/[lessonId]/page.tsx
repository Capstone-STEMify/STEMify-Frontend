import UpsertLesson from '@/features/resource/lesson/components/UpsertLesson'
import React, { Suspense } from 'react'

export default function LessonUpdatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpsertLesson />
    </Suspense>
  )
}
