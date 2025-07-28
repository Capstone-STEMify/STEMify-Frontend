import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import UpsertLesson from '@/features/resource/lesson/components/UpsertLesson'
import React, { Suspense } from 'react'

export default function CreateLessonPage() {
  return (
    <Suspense fallback={<div><LoadingComponent /></div>}>
      <UpsertLesson />
    </Suspense>
  )
}
