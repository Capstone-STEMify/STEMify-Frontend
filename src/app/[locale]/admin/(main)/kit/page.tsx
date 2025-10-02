import KitList from '@/features/resource/kit/components/list/KitList'
import KitAction from '@/features/resource/kit/components/list/KitListAction'
import { Filter } from 'lucide-react'
import ProductFilterSidebar from '@/features/resource/kit/components/shop/list/ProductFilterSidebar'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function KitListPage() {
  const t = useTranslations('kits')
  return (
    <div>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>
      <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4'>
        <ProductFilterSidebar className='hidden border-r border-gray-200 md:block' />
        <div className='scrollbar-hidden col-span-1 md:col-span-3 lg:col-span-3 lg:max-h-[calc(100vh)] lg:overflow-y-auto'>
          <KitList />
        </div>
      </div>
    </div>
  )
}
