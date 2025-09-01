import CurriculumAction from '@/features/resource/curriculum/components/list/CurriculumAction'
import CurriculumList from '@/features/resource/curriculum/components/list/CurriculumList'
import React from 'react'

export default function AdminCurriculum() {
  return (
    <div className='px-5'>
      <CurriculumAction />
      <CurriculumList />
    </div>
  )
}
