'use client'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import LessonSections from './SectionsInLesson'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useParams } from 'next/navigation'

export default function Page() {
  const { lessonId } = useParams()
  const token = useAppSelector((state) => state.auth.token)
  const { data, isLoading } = useSearchSectionQuery({ lessonId: Number(lessonId) }, { skip: !token })
  console.log('Sections data:', data)
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h2 className='mb-6 text-center text-5xl font-bold'>Lesson Sections</h2>
      <LessonSections sections={data?.data.items || []} />
    </div>
  )
}
