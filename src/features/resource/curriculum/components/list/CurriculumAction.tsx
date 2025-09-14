'use client'
import { Input } from '@/components/shadcn/input'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { setParam, setSearchTerm } from '../../slice/curriculumSlice'
import SSelect from '@/components/shared/SSelect'
import { CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'

export default function CurriculumAction() {
  // Translations
  const tList = useTranslations('curriculum.list')
  const tc = useTranslations('common')
  // Modal
  const { openModal } = useModal()

  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.curriculum)

  // Options for selects
  const statusOptions = Object.entries(CurriculumStatus)
    .filter(([key]) => key.toLowerCase() !== 'deleted')
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: value
    }))

  return (
    <div className='relative flex w-full max-w-[700px] items-center justify-start gap-4 py-4 md:flex-row'>
      {/* Search input */}
      <Input
        type='text'
        placeholder={tList('placeholder.search')}
        value={filters.search}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        className='flex-1 border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
      />
      <Search className='absolute top-6.5 left-3 h-4 w-4 text-gray-400' />

      <SSelect
        className='w-30'
        placeholder={tList('placeholder.status')}
        value={filters.status?.toString() ?? ''}
        onChange={(val) => dispatch(setParam({ key: 'status', value: val as CurriculumStatus }))}
        options={statusOptions}
        onOpen={() => {
          // No action needed; statusOptions is static
        }}
      />

      {/* Create action */}
      <Button
        className='bg-amber-custom-400 cursor-pointer'
        onClick={() => {
          openModal('upsertCurriculum')
        }}
      >
        <Plus className='mr-1 h-4 w-4' />
        {tc('button.create')}
      </Button>
    </div>
  )
}
