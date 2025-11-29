'use client'
import { Badge } from '@/components/shadcn/badge'
import { SCard } from '@/components/shared/card/SCard'
import { DataTable } from '@/components/shared/data-table/data-table'
import SEmpty from '@/components/shared/empty/SEmpty'
import SLoading from '@/components/shared/SLoading'
import { useDeleteOrganizationMutation, useGetOrganizationByIdQuery } from '@/features/organization/api/organizationApi'
import SystemSubscriptionTable from '@/features/subscription/components/list/SystemSubscriptionTable'
import UserOrganizationTable from '@/features/user/components/table/UserOrganizationTable'
import { useModal } from '@/providers/ModalProvider'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDate, useStatusTranslation } from '@/utils/index'
import { SquarePen, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'

export default function OrganizationDetail() {
  const locale = useLocale()

  const to = useTranslations('organization.detail')
  const tt = useTranslations('toast')
  const translateStatus = useStatusTranslation()

  const { openModal } = useModal()
  const { organizationId } = useParams()
  const { data: organization, isLoading } = useGetOrganizationByIdQuery(Number(organizationId))
  const [deleteOrganization] = useDeleteOrganizationMutation()

  const handleDelete = async (id: number) => {
    await deleteOrganization(id)
  }

  if (isLoading) {
    return <SLoading />
  }

  if (!organization) {
    return <SEmpty title={to('noData')} />
  }
  return (
    <div>
      <div className='grid grid-cols-1 gap-12 xl:grid-cols-3'>
        <div className='xl:col-span-2'>
          {/* <h2 className='mb-2 text-sm text-gray-500 uppercase'>{organization.data.code}</h2> */}
          <div className='flex items-center gap-2'>
            <h1 className='mb-4 text-4xl font-bold text-gray-900'>{organization.data.name}</h1>
            <span className='cursor-pointer text-blue-500'>
              <SquarePen
                onClick={() => {
                  openModal('upsertOrganization', { organizationId: organization.data.id })
                }}
              />
            </span>
            <span className='cursor-pointer text-red-500'>
              <Trash2
                onClick={() => {
                  openModal('confirm', {
                    message: `${tt('confirmMessage.delete', { title: organization.data.name })}`,
                    onConfirm: () => handleDelete(organization.data.id)
                  })
                }}
              />
            </span>
          </div>

          <div className='mb-4 flex flex-wrap gap-2 text-sm'>
            <p>Ngày tạo: {formatDate(organization.data.createdDate, { locale: locale as 'en' | 'vi' | undefined })}</p>
            <p>
              Chỉnh sửa gần nhất:{' '}
              {formatDate(organization.data.lastModifiedDate, { locale: locale as 'en' | 'vi' | undefined })}
            </p>
          </div>
          <div className='mb-4 flex flex-wrap gap-4 text-sm'>
            <span>
              {to('status')}:{' '}
              <Badge className={getStatusBadgeClass(organization.data.status)}>
                {translateStatus(organization.data.status)}
              </Badge>
            </span>
          </div>
          <hr className='mb-6 border-gray-300' />

          {/* Description */}
          <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800'>{to('description')}</h3>
          <p className='whitespace-pre-line text-gray-700'>{organization.data.description}</p>
        </div>

        {/* RIGHT: Thumbnail, Metadata, Actions */}
        <div className='space-y-6 xl:col-span-1'>
          {/* Thumbnail */}
          <div className='relative mx-auto aspect-[4/3] max-w-[300px] overflow-hidden rounded-2xl shadow-md xl:max-w-xs'>
            <Image
              src={organization.data.imageUrl || '/images/fallback.png'}
              alt={organization.data.name}
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>

      {/* Subscription List */}
      <SystemSubscriptionTable subscription={organization.data.subscriptions} />

      {/* Organization User List */}
      <UserOrganizationTable />
    </div>
  )
}
