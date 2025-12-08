import BreadcrumbPageLayout from '@/components/shared/layout/BreadcrumbPageLayout'
import SListTitle from '@/components/shared/SListTitle'
import CourseListAction from '@/features/resource/course/components/list/CourseListAction'
import CourseListContent from '@/features/resource/course/components/list/CourseListContent'
import { useTranslations } from 'next-intl'

export default function CourseList() {
  const t = useTranslations('course')

  return (
    <BreadcrumbPageLayout color={'yellow'} size='md' weight='semibold'>
      <div className='shadow-6 mt-6 rounded-lg bg-white'>
        <SListTitle title={t('list.title')} description={t('list.description')} />
        <CourseListAction />
        <CourseListContent />
      </div>
    </BreadcrumbPageLayout>
  )
}
