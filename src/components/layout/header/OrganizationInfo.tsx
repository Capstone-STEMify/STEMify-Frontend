'use client'
import { useGetOrganizationByIdQuery } from '@/features/organization/api/organizationApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import React from 'react'
import { Building2 } from 'lucide-react'

export default function OrganizationInfo() {
  const user = useAppSelector((state) => state.auth?.user)
  const organizationId = user?.organizationId
  const { data: organizationData, isLoading } = useGetOrganizationByIdQuery(organizationId!, { skip: !organizationId })

  if (isLoading || !organizationData) return null

  return (
    <button className='flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 transition-colors hover:bg-gray-50'>
      <div className='h-7 w-7 flex-shrink-0 overflow-hidden rounded bg-gray-100'>
        {organizationData.data.imageUrl ? (
          <img
            src={organizationData.data.imageUrl}
            alt={organizationData.data.name}
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <Building2 className='h-4 w-4 text-gray-400' />
          </div>
        )}
      </div>

      <span className='max-w-[100px] text-xs leading-tight font-medium text-gray-900'>
        {organizationData.data.name}
      </span>
    </button>
  )
}
