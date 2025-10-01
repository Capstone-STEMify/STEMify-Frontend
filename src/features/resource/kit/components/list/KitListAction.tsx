'use client'
import { Input } from '@/components/shadcn/input'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { setSearchTerm } from '@/features/resource/kit/slice/kitProductSlice'

export default function KitAction() {
  // Translations
  const tList = useTranslations('kits.list')
  const tc = useTranslations('common')
  // Modal
  const { openModal } = useModal()

  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.kit)

  return (
    <div className='relative flex w-full max-w-[700px] items-center justify-start gap-4 py-4 md:flex-row'>
      {/* Search input */}
      <Input
        type='text'
        placeholder={tList('searchPlaceholder')}
        value={filters.search}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        className='flex-1 border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
      />
      <Search className='absolute top-6.5 left-3 h-4 w-4 text-gray-400' />

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
  )
}
