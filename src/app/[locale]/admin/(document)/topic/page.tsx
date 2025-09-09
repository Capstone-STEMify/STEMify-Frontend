import CategoryTable from '@/features/resource/category/components/list/CategoryTable'
import { useTranslations } from 'next-intl'

export default function AdminCategory() {
  const t = useTranslations('Admin.topic')
  return (
    <div>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('listTitle')}</h1>
      <CategoryTable />
    </div>
  )
}
