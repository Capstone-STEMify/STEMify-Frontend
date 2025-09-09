import CourseListAction from '@/features/resource/course/components/list/CourseListAction'
import CourseTable from '@/features/resource/course/components/list/AdminCourseList'
import { useTranslations } from 'next-intl'

export default function AdminCourse() {
  const t = useTranslations('course')
  return (
    <div>
      <h1 className='mb-4 text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>
      <CourseListAction />
      <CourseTable />
    </div>
  )
}
