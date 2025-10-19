'use client'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
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
  const data: Contract[] = [
    {
      id: 1,
      description: 'Contract 1 description',
      name: 'Contract 1',
      organizationName: 'Organization A',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      description: 'Contract 2 description',
      name: 'Contract 2',
      organizationName: 'Organization B',
      createdAt: '2024-02-01'
    }
  ]
  const rows = React.useMemo(() => data ?? [], [data])

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
        onRowClick={(row) => openModal('contactDetail', { contact: row })}
      />
    </div>
  )
}
