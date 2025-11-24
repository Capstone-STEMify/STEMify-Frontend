'use client'

import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Separator } from '@/components/shadcn/separator'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useGetOrganizationByIdQuery } from '@/features/organization/api/organizationApi'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDate, formatDateV2, useStatusTranslation } from '@/utils/index'
import { Building2, Calendar, GraduationCap } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type OrganizationInfoProps = {
  organizationId: number
}

export default function OrganizationInfo({ organizationId }: OrganizationInfoProps) {
  const locale = useLocale()
  const to = useTranslations('organization.detail')
  const translateStatus = useStatusTranslation()

  const { data, isLoading } = useGetOrganizationByIdQuery(organizationId, { skip: !organizationId })
  const organization = data?.data

  if (isLoading) {
    return (
      <Card className='p-4'>
        <CardHeader className='pb-2'>
          <Skeleton className='h-6 w-2/3' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-1/2' />
        </CardContent>
      </Card>
    )
  }

  if (!organization)
    return (
      <Card>
        <CardContent>
          <p className='text-muted-foreground text-center text-sm'>{to('noData')}</p>
        </CardContent>
      </Card>
    )

  return (
    <Card className='overflow-hidden border py-4 shadow-sm'>
      {/* Header */}
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-3'>
          <div className='relative h-12 w-12 overflow-hidden rounded-full border'>
            {organization.imageUrl ? (
              <Image
                src={organization.imageUrl}
                alt={organization.name || 'Organization logo'}
                fill
                className='object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-sky-100 text-xl font-semibold text-blue-400'>
                <GraduationCap className='h-4 w-4' />
              </div>
            )}
          </div>
          <div className='flex-1'>
            <CardTitle className='line-clamp-1 text-base font-semibold'>{organization.name}</CardTitle>
            <Badge className={`${getStatusBadgeClass(organization.status)} mt-1 px-2 py-0.5 text-[11px]`}>
              {translateStatus(organization.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className='space-y-3 text-sm'>
        <p className='text-muted-foreground line-clamp-2'>{organization.description}</p>
        <Separator />

        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <Building2 size={14} />
              {to('organizationType')}
            </span>
            <span className='font-medium'>{organization.organizationType}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <Calendar size={14} />
              {to('createdAt')}
            </span>
            <span>{formatDate(organization.createdDate, { locale: locale as 'en' | 'vi' })}</span>
          </div>
          {/* <div className='flex justify-between'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <Calendar size={14} />
              {to('updatedAt')}
            </span>
            <span>{formatDate(organization.createdDate, { locale: locale as 'en' | 'vi' })}</span>
          </div> */}
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{to('subscription.label')}</span>
            <span className='font-medium'>
              {organization.subscriptions.length} {to('package')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
