import BackButton from '@/components/shared/button/BackButton'
import UpsertCourse from '@/features/resource/course/components/UpsertCourse'
import React from 'react'

export default function CreateCoursePage() {
  return (
    <div>
      <div className='flex items-center gap-5 pb-5'>
        <BackButton />
        <h2>Create New Course</h2>
      </div>
      <UpsertCourse />
    </div>
  )
}
