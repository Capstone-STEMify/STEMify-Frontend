import AgeRangeTable from '@/features/resource/age-range/components/list/AgeRangeTable'
import { useTranslations } from 'next-intl'

export default function AdminAgeRange() {
  const t = useTranslations('Admin.ageRange')
  return (
    <div>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('listTitle')}</h1>
      <AgeRangeTable />
    </div>
  )
}
