'use client'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import LessonSections from './LessonSections'

export default function Page() {
  const { data } = useSearchSectionQuery({ lessonId: 1 }, { skip: false })
  return (
    <div>
      <h2 className='mb-4 text-2xl font-bold'>Lesson Sections</h2>
      <LessonSections sections={data?.data.items || []} />
    </div>
  )
}
