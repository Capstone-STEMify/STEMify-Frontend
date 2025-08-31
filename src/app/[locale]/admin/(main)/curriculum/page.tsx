import CurriculumAction from '@/features/resource/curriculum/components/CurriculumAction'
import CurriculumList from '@/features/resource/curriculum/components/CurriculumList'
import React from 'react'

export default function AdminCurriculum() {
  return (
    <div className='px-5'>
      <CurriculumAction />
      <CurriculumList />
    </div>
  )
}
