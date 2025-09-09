import StandardTable from '@/features/resource/standard/components/list/StandardTable'
import { useTranslations } from 'next-intl'

export default function AdminStandard() {
  const t = useTranslations('Admin.standard')
  return (
    <div>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('listTitle')}</h1>
      <StandardTable />
    </div>
  )
}
