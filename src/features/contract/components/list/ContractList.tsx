'use client'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchContractQuery } from '@/features/contract/api/contractApi'
import { useGetContractColumnTable } from '@/features/contract/components/list/ContractColumnTable'
import { Contract } from '@/features/contract/types/contract.type'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ContractList() {
  const { openModal } = useModal()
  const t = useTranslations('Admin.placeholder')
  const tList = useTranslations('curriculum.list')
  const dispatch = useAppDispatch()
  const columns = useGetContractColumnTable()
  const { data } = useSearchContractQuery({})

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (page: number) => {
    // dispatch(setPageIndex(page))
  }
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-4 py-4'>
        <Input
          placeholder={t('userSearch')}
          //   value={searchQuery}
          //   onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
      </div>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        // pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
