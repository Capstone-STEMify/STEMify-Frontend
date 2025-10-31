'use client'

import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Separator } from '@/components/shadcn/separator'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useGetOrganizationByIdQuery } from '@/features/organization/api/organizationApi'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDateV2 } from '@/utils/index'
import { Building2, Calendar } from 'lucide-react'

type OrganizationInfoProps = {
  organizationId: number
}

export default function OrganizationInfo({ organizationId }: OrganizationInfoProps) {
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

  if (!organization) return null

  return (
    <Card className='overflow-hidden border py-4 shadow-sm'>
      {/* Header */}
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-3'>
          <div className='relative h-12 w-12 overflow-hidden rounded-full border'>
            <Image
              src={organization.imageUrl || '/placeholder.png'}
              alt={organization.name || 'Organization logo'}
              fill
              className='object-cover'
            />
          </div>
          <div className='flex-1'>
            <CardTitle className='line-clamp-1 text-base font-semibold'>{organization.name}</CardTitle>
            <Badge className={`${getStatusBadgeClass(organization.status)} mt-1 px-2 py-0.5 text-[11px]`}>
              {organization.status}
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
              Type
            </span>
            <span className='font-medium'>{organization.organizationType}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <Calendar size={14} />
              Created
            </span>
            <span>{formatDateV2(new Date(organization.createdDate))}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <Calendar size={14} />
              Updated
            </span>
            <span>{formatDateV2(new Date(organization.lastModifiedDate))}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Subscriptions</span>
            <span className='font-medium'>{organization.subscriptions.length} packages</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
