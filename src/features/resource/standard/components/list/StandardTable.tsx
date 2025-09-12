'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchStandardQuery } from '@/features/resource/standard/api/standardApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StandardQueryParams } from '../../types/standard.type'
import { setPageIndex, setSearchTerm } from '@/features/resource/standard/slice/standardSlice'
import useDebounce from '@/hooks/useDebounce'
import { useMemo } from 'react'
import { useGetStandardAction } from '@/features/resource/standard/components/list/StandardAction'

export default function StandardTable() {
  const { openModal } = useModal()
  const columns = useGetStandardAction()
  const dispatch = useAppDispatch()

  const t = useTranslations('Admin.placeholder')

  const standardParams = useAppSelector((state) => state.standard)
  const debouncedSearchQuery = useDebounce(standardParams.search ?? '', 500)

  const queryParams: StandardQueryParams = {
    pageNumber: standardParams.pageNumber,
    pageSize: standardParams.pageSize,
    search: debouncedSearchQuery,
    status: standardParams.status
  }

  const { data } = useSearchStandardQuery(queryParams)

  const rows = useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertStandard')
  }

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder={t('standardSearch')}
          value={standardParams.search}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className='max-w-sm'
        />
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
