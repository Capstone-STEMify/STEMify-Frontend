'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useDeleteComponentMutation, useSearchComponentQuery } from '@/features/kit-components/api/kitComponentApi'
import { useGetComponentColumn } from '@/features/kit-components/components/list/ComponentColumn'
import { setPageIndex, setSearchTerm } from '@/features/kit-components/slice/componentSlice'
import { ComponentSliceParams } from '@/features/kit-components/types/kit-component.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ComponentList() {
  const t = useTranslations('components')
  const tc = useTranslations('common')
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.component)

  const queryParams: ComponentSliceParams = useAppSelector((state) => state.component)
  const { data: componentData, isLoading } = useSearchComponentQuery(queryParams)
  const [deleteComponent] = useDeleteComponentMutation()

  const rows = React.useMemo(() => componentData?.data.items ?? [], [componentData])
  const columns = useGetComponentColumn({ isPopup: false })

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
  return (
    <div className='pt-4 select-none'>
      <div className='relative flex w-full max-w-[700px] items-center justify-start gap-4 pt-4 pb-10 md:flex-row'>
        <Input
          type='text'
          placeholder={t('list.placeholder.search')}
          value={filters.search}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className='flex-1 border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        />
        <Search className='absolute top-6.5 left-3 h-4 w-4 text-gray-400' />
        {/* Create action */}
        <Button
          className='bg-amber-custom-400 cursor-pointer'
          onClick={() => {
            openModal('upsertComponent')
          }}
        >
          <Plus className='mr-1 h-4 w-4' />
          {tc('button.create')}
        </Button>
      </div>

      {!componentData || componentData.data.items.length === 0 ? (
        <SEmpty title={t('list.noData')} description={t('list.noDataDescription')} />
      ) : (
        <DataTable
          data={rows}
          columns={columns}
          enableRowSelection
          pagingData={componentData}
          pagingParams={queryParams}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  )
}
