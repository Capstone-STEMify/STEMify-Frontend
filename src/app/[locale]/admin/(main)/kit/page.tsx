import KitList from '@/features/resource/kit/components/list/KitList'
import KitAction from '@/features/resource/kit/components/list/KitListAction'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function KitListPage() {
  const t = useTranslations('kits')
  return (
    <div>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>
      <KitAction />
      <KitList />
    </div>
  )
}
