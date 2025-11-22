'use client'

import { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  GraduationCap,
  Building2,
  Send,
  Archive
} from 'lucide-react'
import { useDeletePlanMutation, useSearchPlanQuery } from '@/features/plan/api/planApi'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import {
  useDeleteOrganizationMutation,
  useSearchOrganizationsQuery,
  useUpdateOrganizationMutation
} from '@/features/organization/api/organizationApi'
import Image from 'next/image'
import { formatDate } from '@/utils/index'
import SystemSubscriptionTable from '@/features/subscription/components/list/SystemSubscriptionTable'
import SearchBar from '@/components/shared/search/SearchBar'
import { Input } from '@/components/shadcn/input'
import SSelect from '@/components/shared/SSelect'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setParam, setSearchTerm } from '@/features/organization/slice/organizationSlice'
import { OrganizationStatus } from '@/features/organization/types/organization.type'
import useDebounce from '@/hooks/useDebounce'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { SPagination } from '@/components/shared/SPagination'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import SStatusDropdown from '@/components/shared/SStatusDropdown'

export default function SystemOrganizationList() {
  const t = useTranslations('subscription')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>('')
  const debouncedSearchQuery = useDebounce(search, 500)

  const { openModal } = useModal()
  const [expandedOrganizations, setExpandedOrganizations] = useState<number[]>([])
  const queryParams = useAppSelector((state) => state.organization)
  const { data, isLoading, refetch } = useSearchOrganizationsQuery(queryParams)
  const organizations = data?.data.items || []

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])
  const [updateOrganization] = useUpdateOrganizationMutation()
  const [deleteOrganization] = useDeleteOrganizationMutation()
  const toggleExpand = (organizationId: number) => {
    setExpandedOrganizations((prev) =>
      prev.includes(organizationId) ? prev.filter((id) => id !== organizationId) : [...prev, organizationId]
    )
  }
  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const organizationStatusOptions = [
    { label: 'All', value: 'all' },
    ...Object.entries(OrganizationStatus).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value
    }))
  ]

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }
  if (!data) {
    return <SEmpty title={tc('message.noData')} />
  }

  const handleStatusChange = (organization: any, newStatus: string) => {
    updateOrganization({ id: organization.id, body: { status: newStatus as OrganizationStatus } })
      .unwrap()
      .then(() => toast.success(tt('successMessage.update', { title: newStatus })))
  }
  return (
    <div className='my-5 px-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='mt-4 mb-4 text-3xl font-bold'>{t('list.organizationSubscriptionTitle')}</h1>
            <p className='text-muted-foreground mt-1'>{t('list.organizationSubscriptionDescription')}</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => openModal('upsertOrganization')}>
              <Building2 className='h-4 w-4' /> {tc('button.createOrganization')}
            </Button>
          </div>
        </div>

        <div className='flex items-center justify-start gap-2'>
          {/* Search Input */}
          <div className='relative w-100'>
            <Input
              type='text'
              placeholder={t('list.placeholder.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            />
            <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
          </div>
          <SSelect
            className='w-fit'
            placeholder={t('list.placeholder.status')}
            value={queryParams.status?.toString() ?? ''}
            onChange={(val) => {
              if (val === 'all') {
                dispatch(setParam({ key: 'status', value: undefined }))
              } else {
                dispatch(setParam({ key: 'status', value: val as OrganizationStatus }))
              }
            }}
            options={organizationStatusOptions}
          />
        </div>

        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'></TableHead>
                <TableHead>{tc('tableHeader.image')}</TableHead>
                <TableHead>{tc('tableHeader.name')}</TableHead>
                <TableHead>{tc('tableHeader.organizationType')}</TableHead>
                <TableHead>{tc('tableHeader.status')}</TableHead>
                <TableHead>{tc('tableHeader.createdDate')}</TableHead>
                <TableHead className='text-center'>{tc('tableHeader.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((organization) => (
                <Fragment key={organization.id}>
                  <TableRow className='cursor-pointer' onClick={() => toggleExpand(organization.id)}>
                    <TableCell>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        {expandedOrganizations.includes(organization.id) ? (
                          <ChevronDown className='h-4 w-4' />
                        ) : (
                          <ChevronRight className='h-4 w-4' />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className='py-4 font-medium'>
                      <div className='h-12 w-12 overflow-hidden rounded-full'>
                        {organization.imageUrl ? (
                          <Image
                            src={organization.imageUrl}
                            alt='preview'
                            className='h-full w-full rounded-full object-cover'
                            width={64}
                            height={64}
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center bg-sky-100 text-xl font-semibold text-blue-400'>
                            <GraduationCap className='h-4 w-4' />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className='font-medium'>{organization.name}</TableCell>
                    <TableCell>{organization.organizationType}</TableCell>
                    <TableCell>
                      <SStatusDropdown
                        value={organization.status}
                        options={organizationStatusOptions.filter(
                          (opt) => opt.value !== 'all' && opt.value !== OrganizationStatus.ARCHIVED
                        )}
                        onChange={(newStatus) => handleStatusChange(organization, newStatus)}
                      />{' '}
                    </TableCell>
                    <TableCell>{formatDate(organization.createdDate)}</TableCell>

                    <TableCell>
                      <div className='flex items-center justify-center'>
                        <button
                          className='h-8 w-8 hover:cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal('upsertOrganization', { organizationId: organization.id })
                          }}
                        >
                          <Pencil className='h-4 w-4' />
                        </button>
                        <button
                          className='h-8 w-8 hover:cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal('confirm', {
                              message: 'Are you sure you want to delete this organization?',
                              onConfirm: async () => {
                                await deleteOrganization(organization.id)
                                toast.success('Organization archived successfully')
                              }
                            })
                          }}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedOrganizations.includes(organization.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className='bg-muted/30 p-0'>
                        <SystemSubscriptionTable organization={organization} refetchOrganization={refetch} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between gap-2 py-4'>
          {data?.data?.totalPages > 1 && (
            <SPagination
              pageNumber={queryParams?.pageNumber}
              totalPages={data.data.totalPages}
              onPageChanged={handlePageChange}
              className='w-fit'
            />
          )}
        </div>
      </div>
    </div>
  )
}
