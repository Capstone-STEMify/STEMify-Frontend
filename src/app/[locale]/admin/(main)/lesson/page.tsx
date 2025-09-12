import LessonTable from '@/features/resource/lesson/components/list/LessonTable'
import { useTranslations } from 'next-intl'

export default function AdminLesson() {
  const t = useTranslations('LessonList')
  return (
    <div>
      <h1 className='mb-4 text-2xl font-semibold text-gray-800'>{t('title')}</h1>
      <LessonTable />
    </div>
  )
}
