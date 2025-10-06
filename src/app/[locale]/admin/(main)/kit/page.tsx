'use client'
import KitList from '@/features/resource/kit/components/list/KitList'
import { Plus } from 'lucide-react'
import ProductFilterSidebar from '@/features/resource/kit/components/shop/list/ProductFilterSidebar'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useModal } from '@/providers/ModalProvider'
import { Button } from '@/components/shadcn/button'

export default function KitListPage() {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const { openModal } = useModal()
  return (
    <div>
      <div className='mx-4 mt-2 mb-6 flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>
        {/* Create action */}
        <Button
          className='bg-amber-custom-400 cursor-pointer'
          onClick={() => {
            // Open modal for creating a new kit
            openModal('upsertKit')
          }}
        >
          <Plus className='mr-1 h-4 w-4' />
          {tc('button.create')}
        </Button>
      </div>
      <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4'>
        <ProductFilterSidebar className='hidden border-r border-gray-200 md:block' />
        <div className='scrollbar-hidden col-span-1 md:col-span-3 lg:col-span-3 lg:max-h-[calc(100vh)] lg:overflow-y-auto'>
          <KitList />
        </div>
      </div>
    </div>
  )
}
