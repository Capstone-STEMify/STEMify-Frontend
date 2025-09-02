import BackButton from '@/components/shared/button/BackButton'
import UpsertCourse from '@/features/resource/course/components/upsert/UpsertCourse'
import React from 'react'

export default function UpdateCoursePage() {
  return (
    <div>
      <div className='flex items-center gap-5 pb-5'>
        <BackButton />
        <h2>Update Course</h2>
      </div>
      <UpsertCourse />
    </div>
  )
}
