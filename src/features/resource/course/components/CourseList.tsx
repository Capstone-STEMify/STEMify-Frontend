import BreadcrumbPageLayout from '@/components/shared/layout/BreadcrumbPageLayout'
import SListTitle from '@/components/shared/SListTitle'
import CoyurseListAction from '@/features/resource/course/components/list/CourseListAction'
import CourseListContent from '@/features/resource/course/components/list/CourseListContent'

export default function CourseList() {
  return (
    <BreadcrumbPageLayout color={'yellow'} size='md' weight='semibold' title='Courses'>
      <div className='shadow-6 mt-6 rounded-lg bg-white'>
        <SListTitle
          title='Courses'
          description='Curriculum-aligned, thematic guides with following educational pedagogical approach. Courses have teacher and student perspectives.'
        />
        <CoyurseListAction />
        <CourseListContent />
      </div>
    </BreadcrumbPageLayout>
  )
}
