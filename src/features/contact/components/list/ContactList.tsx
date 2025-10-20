'use client'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import SSelect from '@/components/shared/SSelect'
import { useSearchContactQuery } from '@/features/contact/api/contactApi'
import { useGetContactColumnTable } from '@/features/contact/components/list/ContactColumnTable'
import { Contact, ContactQueryParams, ContactStatus } from '@/features/contact/types/contact.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ContactList() {
  const { openModal } = useModal()
  const t = useTranslations('Admin.placeholder')
  const tList = useTranslations('curriculum.list')
  const dispatch = useAppDispatch()
  const columns = useGetContactColumnTable()
  const contactParams = useAppSelector((state) => state.contact)

  const queryParams: ContactQueryParams = {
    pageNumber: contactParams.pageNumber,
    pageSize: contactParams.pageSize,
    search: contactParams.search,
    orderBy: contactParams.orderBy,
    sortDirection: contactParams.sortDirection,
    status: contactParams.status
  }
  const { data } = useSearchContactQuery(queryParams)
  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  // Options for selects
  const statusOptions = Object.entries(ContactStatus).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: value
  }))

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
        <SSelect
          className='w-30'
          placeholder={tList('placeholder.status')}
          //   value={filters.status?.toString() ?? ''}
          value={''}
          //   onChange={(val) => dispatch(setParam({ key: 'status', value: val as CurriculumStatus }))}
          onChange={(val) => {}}
          options={statusOptions}
          onOpen={() => {
            // No action needed; statusOptions is static
          }}
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
