import CurriculumList from '@/features/resource/curriculum/components/list/CurriculumList'
import CurriculumListHeroSection from '@/features/resource/curriculum/components/list/CurriculumListHeroSection'
import React from 'react'

export default function CurriculumListPage() {
  return (
    <div>
      <CurriculumListHeroSection />
      <CurriculumList />
    </div>
  )
}
