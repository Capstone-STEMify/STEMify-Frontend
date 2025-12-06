'use client'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Select } from '@/components/shadcn/select'
import { DataTable } from '@/components/shared/data-table/data-table'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SearchBar from '@/components/shared/search/SearchBar'
import SSelect from '@/components/shared/SSelect'
import { useSearchLicenseAssignmentQuery } from '@/features/license-assignment/api/licenseAssignmentApi'
import { useGetLicenseAssignmentColumnTable } from '@/features/license-assignment/components/list/licenseAssignmentColumnTable'
import { setPageIndex, setParam } from '@/features/license-assignment/slice/licenseAssignmentSlice'
import { LicenseAssignmentStatus, LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import useDebounce from '@/hooks/useDebounce'
import { useModal } from '@/providers/ModalProvider'
import { cn } from '@/utils/shadcn/utils'
import { or } from 'ajv/dist/compile/codegen'
import { CheckCircle, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function LicenseAssignmentList() {
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const to = useTranslations('organization.detail.license.userManagement')
  const tc = useTranslations('common')

  const [currentTab, setCurrentTab] = useState<LicenseAssignmentStatus>(LicenseAssignmentStatus.ACTIVE)
  const [search, setSearch] = useState<string>('')
  const debouncedSearchQuery = useDebounce(search, 500)

  const params = useAppSelector((state) => state.licenseAssignment)
  const { subscriptionId } = useParams()
  useEffect(() => {
    dispatch(setParam({ key: 'organizationSubscriptionOrderId', value: subscriptionId }))
    dispatch(setParam({ key: 'status', value: currentTab }))
    dispatch(setParam({ key: 'search', value: debouncedSearchQuery }))
  }, [dispatch, subscriptionId, currentTab, debouncedSearchQuery])

  const { data: licenses, isLoading } = useSearchLicenseAssignmentQuery(params)
  const rows = React.useMemo(() => licenses?.data.items ?? [], [licenses])
  const columns = useGetLicenseAssignmentColumnTable()

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  const accountTypeOptions = Object.entries(LicenseAssignmentType).map(([key, value]) => {
    const label = tc(`accountType.${key.toLowerCase()}`)

    return { label, value }
  })

  const statusTabs = Object.entries(LicenseAssignmentStatus)
    .filter(([key]) => key.toLowerCase() !== 'revoked' && key.toLowerCase() !== 'expired')
    .map(([key, value]) => ({
      label: tc(`status.${key.toLowerCase()}`),
      value: value
    }))

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <div>
      <Card className='py-4 shadow-lg'>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle className='text-xl'>{to('header')}</CardTitle>
              <p className='text-muted-foreground mt-1 text-sm'>{to('description')}</p>
            </div>
            <Button
              className='bg-sky-500'
              onClick={() => openModal('uploadCSV', { organizationSubscriptionOrderId: Number(subscriptionId) })}
            >
              <UserPlus className='mr-2 h-4 w-4' />
              {tc('button.addStudents')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Search and Tabs */}
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <Input placeholder={to('searchUser')} className='w-[400px]' onChange={(e) => setSearch(e.target.value)} />
              <SSelect
                className='w-[150px]'
                placeholder={to('accountType')}
                value={params.type?.toString() ?? ''}
                onChange={(val) => dispatch(setParam({ key: 'type', value: val as LicenseAssignmentType }))}
                options={accountTypeOptions}
                onOpen={() => {
                  // No action needed; accountTypeOptions is static
                }}
              />
            </div>
            <div className='border-border flex gap-6 border-b'>
              {statusTabs.map((tab) => (
                <div
                  key={tab.value}
                  onClick={() => {
                    setCurrentTab(tab.value)
                  }}
                  className={cn(
                    'cursor-pointer pb-2 text-sm font-medium transition-colors',
                    currentTab === tab.value
                      ? 'border-primary text-primary border-b-2'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <DataTable
            data={rows}
            columns={columns}
            enableRowSelection
            pagingData={licenses?.data}
            pagingParams={params}
            handlePageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
