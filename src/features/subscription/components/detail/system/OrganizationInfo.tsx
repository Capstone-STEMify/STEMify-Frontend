import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useGetOrganizationByIdQuery } from '@/features/organization/api/organizationApi'
import React from 'react'

type OrganizationInfoProps = {
  organizationId: number
}

export default function OrganizationInfo({ organizationId }: OrganizationInfoProps) {
  const { data, isLoading } = useGetOrganizationByIdQuery(organizationId, { skip: !organizationId })

  const organization = data?.data

  if (isLoading) {
    return (
      <div>
        <Card className='py-4'>
          <CardHeader className='pb-4'>
            <CardTitle>
              <Skeleton className='h-6 w-1/2' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className='mb-2 h-4 w-full' />
            <Skeleton className='mb-2 h-4 w-full' />
            <Skeleton className='mb-2 h-4 w-1/2' />
            <Skeleton className='mb-4 h-4 w-3/4' />
            <Skeleton className='h-8 w-24' />
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <Card className='py-4'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500'>
            <span className='text-lg font-bold text-white'>{organization?.name.charAt(0)}</span>
          </div>
          <CardTitle className='text-lg'>{organization?.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-3 text-sm'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Industry</span>
          <span className='font-medium'>Marketing</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Organization ID</span>
          <span className='font-medium'>122234908</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Managed by</span>
          <span className='font-medium'>Domain Label</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Created on</span>
          <span className='font-medium'>9/18/16</span>
        </div>
        <Button variant='link' className='h-auto p-0 text-blue-600'>
          View Analytics
        </Button>
      </CardContent>
    </Card>
  )
}
