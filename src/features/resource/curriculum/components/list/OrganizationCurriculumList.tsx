'use client'
import { SPagination } from '@/components/shared/SPagination'
import { useModal } from '@/providers/ModalProvider'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { toast } from 'sonner'
import SEmpty from '@/components/shared/empty/SEmpty'

import { CurriculumSliceParams, CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'
import CardLayout from '@/components/shared/card/CardLayout'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { useSearchCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import {
  setPageIndex,
  setPageSize,
  setParam,
  setSearchTerm
} from '@/features/resource/curriculum/slice/curriculumSlice'
import { Input } from '@/components/shadcn/input'
import SSelect from '@/components/shared/SSelect'
import { Button } from '@/components/shadcn/button'
import { useStatusTranslation } from '@/utils/index'

export default function OrganizationCurriculumList() {
  const t = useTranslations('curriculum')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const statusTranslate = useStatusTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const locale = useLocale()

  const tList = useTranslations('curriculum.list')

  const filters = useAppSelector((state) => state.curriculum)

  const statusOptions = Object.entries(CurriculumStatus)
    .filter(([key]) => key.toLowerCase() !== 'deleted')
    .map(([key, value]) => ({
      label: statusTranslate(key),
      value: value
    }))

  const queryParams: CurriculumSliceParams = useAppSelector((state) => state.curriculum)
  const { data: curriculumData, isLoading } = useSearchCurriculumQuery(queryParams)
  const rows = React.useMemo(() => curriculumData?.data.items ?? [], [curriculumData])

  useEffect(() => {
    dispatch(setPageSize(6))
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (!curriculumData || curriculumData.data.items.length === 0) {
    return (
      <div className='mx-auto max-w-7xl px-5'>
        <h1 className='text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>

        <div className='relative flex w-full items-center justify-start gap-4 py-4 md:flex-row'>
          {/* Search input */}
          <Input
            type='text'
            placeholder={tList('placeholder.search')}
            value={filters.search}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className='max-w-[400px] flex-1 border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          />
          <Search className='absolute top-6.5 left-3 h-4 w-4 text-gray-400' />

          <SSelect
            className='w-30'
            placeholder={tList('placeholder.status')}
            value={filters.status?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val as CurriculumStatus }))}
            options={statusOptions}
            onOpen={() => {}}
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
        <SEmpty title={t('list.noData')} description={t('list.noDataDetail')} />
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-7xl px-5'>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>

      <div className='relative flex w-full items-center justify-start gap-4 py-4 md:flex-row'>
        {/* Search input */}
        <Input
          type='text'
          placeholder={tList('placeholder.search')}
          value={filters.search}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className='max-w-[400px] flex-1 border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        />
        <Search className='absolute top-6.5 left-3 h-4 w-4 text-gray-400' />

        <SSelect
          className='w-30'
          placeholder={tList('placeholder.status')}
          value={filters.status?.toString() ?? ''}
          onChange={(val) => dispatch(setParam({ key: 'status', value: val as CurriculumStatus }))}
          options={statusOptions}
          onOpen={() => {}}
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

      <div className='mt-5'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4'>
          {curriculumData.data.items.map((curriculum) => (
            <CardLayout
              key={curriculum.id}
              className='cursor-pointer rounded-2xl border-none bg-transparent'
              imageSrc={curriculum.imageUrl}
              onClick={() => router.push(`/${locale}/organization/curriculum/${curriculum.id}`)}
            >
              <div className='m-2 mt-1'>
                <h2 className='line-clamp-1 text-lg font-semibold'>{curriculum.title}</h2>
                <p className='line-clamp-4 flex-1 text-sm text-gray-600'>{curriculum.description}</p>
                <div className='mt-auto flex items-center gap-2'></div>
                <Link
                  href={`/${locale}/admin/curriculum/${curriculum.id}`}
                  className='mt-4 flex items-center text-sm font-medium text-sky-500 hover:underline'
                >
                  {t('list.viewDetails')} &gt;
                </Link>
              </div>
            </CardLayout>
          ))}
        </div>

        {curriculumData?.data?.totalPages > 1 && (
          <SPagination
            pageNumber={curriculumData.data.pageNumber}
            totalPages={curriculumData.data.totalPages}
            onPageChanged={handlePageChange}
            className='pb-6'
          />
        )}
      </div>
    </div>
  )
}
