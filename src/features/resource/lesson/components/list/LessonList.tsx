import BreadcrumbPageLayout from '@/components/shared/layout/BreadcrumbPageLayout'
import SListTitle from '@/components/shared/SListTitle'
import LessonListAction from '@/features/resource/lesson/components/list/LessonListAction'
import LessonListContent from '@/features/resource/lesson/components/list/LessonListContent'
import { useTranslations } from 'next-intl'

export default function LessonList() {
  const t = useTranslations('LessonList')
  const tc = useTranslations('common.breadcrumb')
  return (
    <BreadcrumbPageLayout color={'yellow'} size='md' weight='semibold'>
      <div className='shadow-6 mt-6 rounded-lg bg-white'>
        <SListTitle title={t('title')} description={t('description')} />
        <LessonListAction />
        <LessonListContent />
      </div>
    </BreadcrumbPageLayout>
  )
}
