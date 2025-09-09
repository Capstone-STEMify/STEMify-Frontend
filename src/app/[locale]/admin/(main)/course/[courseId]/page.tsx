import BackButton from '@/components/shared/button/BackButton'
import CourseDetailForAdmin from '@/features/resource/course/components/CourseDetailForAdmin'
import React from 'react'

export default function CourseDetailPage() {
  return (
    <div className='flex gap-5'>
      <BackButton />
      <CourseDetailForAdmin />
    </div>
  )
}
