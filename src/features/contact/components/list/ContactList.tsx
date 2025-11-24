'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import SSelect from '@/components/shared/SSelect'
import { useSearchContactQuery } from '@/features/contact/api/contactApi'
import { useGetContactColumnTable } from '@/features/contact/components/list/ContactColumnTable'
import { setPageIndex, setParam } from '@/features/contact/slice/contactSlice'
import { Contact, ContactQueryParams, ContactStatus } from '@/features/contact/types/contact.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import useDebounce from '@/hooks/useDebounce'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ContactList() {
  const { openModal } = useModal()
  const t = useTranslations('Admin.placeholder')
  const tList = useTranslations('curriculum.list')
  const columns = useGetContactColumnTable()

  const dispatch = useAppDispatch()
  const contactParams = useAppSelector((state) => state.contact)

  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const queryParams: ContactQueryParams = {
    pageNumber: contactParams.pageNumber,
    pageSize: contactParams.pageSize,
    search: debouncedSearch.trim() || undefined,
    orderBy: contactParams.orderBy,
    sortDirection: contactParams.sortDirection,
    status: contactParams.status
  }
  const { data } = useSearchContactQuery(queryParams)
  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  // Options for selects
  const statusOptions = Object.entries(ContactStatus).map(([key, value]) => {
    const formattedLabel = value.replace(/([a-z])([A-Z])/g, '$1 $2')

    return {
      label: formattedLabel,
      value
    }
  })

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center justify-between gap-4 py-4'>
        <div className='flex gap-2'>
          <Input
            placeholder={t('userSearch')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-92'
          />
          <SSelect
            className='w-40'
            placeholder={tList('placeholder.status')}
            value={contactParams.status ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val as ContactStatus }))}
            options={statusOptions}
            onOpen={() => {
              // No action needed; statusOptions is static
            }}
          />
        </div>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        onRowClick={(row) => openModal('upsertContact', { contact: row })}
      />
    </div>
  )
}
