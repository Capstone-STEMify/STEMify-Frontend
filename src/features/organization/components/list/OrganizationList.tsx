'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import SSelect from '@/components/shared/SSelect'
import { useGetOrganizationColumnTable } from '@/features/organization/components/list/OrganizationColumnTable'
import { Organization, OrganizationStatus } from '@/features/organization/types/organization.type'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function OrganizationList() {
  const t = useTranslations('Admin.placeholder')
  const tc = useTranslations('common')
  const tList = useTranslations('curriculum.list')

  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const columns = useGetOrganizationColumnTable()
  const data: Organization[] = [
    {
      id: 1,
      name: 'Example Corp',
      description: 'A sample organization',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGXT3A_mrlYfgBBKN5Qh7yXzDjEIPT34SUPQ&s',
      organizationType: 'Technology',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-05',
      status: OrganizationStatus.ACTIVE
    },
    {
      id: 2,
      name: 'Example Corp',
      description: 'A sample organization',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGXT3A_mrlYfgBBKN5Qh7yXzDjEIPT34SUPQ&s',
      organizationType: 'Technology',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-05',
      status: OrganizationStatus.ACTIVE
    },
    {
      id: 3,
      name: 'Example Corp',
      description: 'A sample organization',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGXT3A_mrlYfgBBKN5Qh7yXzDjEIPT34SUPQ&s',
      organizationType: 'Technology',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-05',
      status: OrganizationStatus.ACTIVE
    }
  ]
  const rows = React.useMemo(() => data ?? [], [data])

  // Options for selects
  const statusOptions = Object.entries(OrganizationStatus).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: value
  }))

  const handlePageChange = (page: number) => {
    // dispatch(setPageIndex(page))
  }

  return (
    <div className='mx-auto max-w-6xl p-4'>
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
        <Button className='bg-sky-500' onClick={() => openModal('upsertOrganization')}>
          + {tc('button.create')}
        </Button>
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
