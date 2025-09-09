import SkillTable from '@/features/resource/skill/components/list/SkillTable'
import { useTranslations } from 'next-intl'

export default function AdminSkill() {
  const t = useTranslations('Admin.skill')
  return (
    <div>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('listTitle')}</h1>
      <SkillTable />
    </div>
  )
}
