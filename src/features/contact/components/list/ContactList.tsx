'use client'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import SSelect from '@/components/shared/SSelect'
import { useGetContactColumnTable } from '@/features/contact/components/list/ContactColumnTable'
import { Contact, ContactStatus } from '@/features/contact/types/contact.type'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ContactList() {
  const { openModal } = useModal()
  const t = useTranslations('Admin.placeholder')
  const tList = useTranslations('curriculum.list')
  const dispatch = useAppDispatch()
  const columns = useGetContactColumnTable()
  const data: Contact[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      organizationName: 'Example Corp',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-05',
      organizationType: 'Technology',
      jobRoleName: 'Software Engineer',
      status: ContactStatus.PENDING
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddress: 'jane.smith@example.com',
      phoneNumber: '987-654-3210',
      organizationName: 'Tech Solutions',
      createdAt: '2023-09-15',
      updatedAt: '2023-09-20',
      organizationType: 'Consulting',
      jobRoleName: 'Project Manager',
      status: ContactStatus.RESOLVED
    }
  ]
  const rows = React.useMemo(() => data ?? [], [data])

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
