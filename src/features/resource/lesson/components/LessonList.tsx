import BreadcrumbPageLayout from '@/components/shared/layout/BreadcrumbPageLayout'
import SListTitle from '@/components/shared/SListTitle'
import LessonListAction from '@/features/resource/lesson/components/list/LessonListAction'
import LessonListContent from '@/features/resource/lesson/components/list/LessonListContent'

export default function LessonList() {
  return (
    <BreadcrumbPageLayout color={'yellow'} size='md' weight='semibold' title='Lessons'>
      <div className='shadow-6 mt-6 rounded-lg bg-white'>
        <SListTitle
          title='Lessons'
          description='Curriculum-aligned, thematic guides with following educational pedagogical approach. Lessons have teacher and student perspectives.'
        />
        <LessonListAction />
        <LessonListContent />
      </div>
    </BreadcrumbPageLayout>
  )
}
