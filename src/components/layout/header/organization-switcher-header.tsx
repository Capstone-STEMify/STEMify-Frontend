'use client'

import * as React from 'react'
import { ChevronsUpDown, GraduationCap } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setSelectedOrganizationId } from '@/features/subscription/slice/selectedOrganizationSlice'
import { useGetOrganizationsWithAccessByUserIdQuery } from '@/features/organization/api/organizationApi'
import { useSession } from 'next-auth/react'

export function OrganizationSwitcherHeader() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const selectedOrganizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const userId = user?.userId
  const { data: organizationData, isLoading } = useGetOrganizationsWithAccessByUserIdQuery(
    { userId: userId! },
    { skip: !userId }
  )

  const organizations = organizationData?.data?.organizations ?? []

  // Chỉ gán mặc định nếu chưa có org được chọn
  React.useEffect(() => {
    if (status === 'authenticated' && organizations.length && !selectedOrganizationId) {
      const first = organizations[0]
      dispatch(setSelectedOrganizationId(first.id))
    }
  }, [status, organizations, selectedOrganizationId, dispatch])
  if (isLoading || !organizations.length) return null

  // ✅ Tìm org đang được chọn (hoặc lấy org đầu tiên nếu chưa có)
  const selectedOrg = organizations.find((x) => x.id === selectedOrganizationId) ?? organizations[0]

  return (
    <div className='relative'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors'>
            <div className='flex size-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-blue-200 text-blue-600'>
              {selectedOrg.imageUrl ? (
                <img src={selectedOrg.imageUrl} alt={selectedOrg.name} className='h-full w-full object-cover' />
              ) : (
                <GraduationCap className='size-4' />
              )}
            </div>
            <div className='flex flex-col text-left leading-tight'>
              <span className='truncate font-medium'>{selectedOrg.name}</span>
            </div>
            <ChevronsUpDown className='ml-1 h-4 w-4 opacity-60' />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='min-w-56 rounded-lg shadow-lg' align='center' side='bottom' sideOffset={6}>
          <DropdownMenuLabel className='text-muted-foreground text-xs'>Organizations</DropdownMenuLabel>

          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => dispatch(setSelectedOrganizationId(org.id))}
              className={`flex cursor-pointer items-center gap-2 p-2 ${
                org.id === selectedOrganizationId ? 'bg-accent/40' : ''
              }`}
            >
              <div className='flex size-6 items-center justify-center rounded-md border'>
                {org.imageUrl ? (
                  <img src={org.imageUrl} alt={org.name} className='h-full w-full object-cover' />
                ) : (
                  <GraduationCap className='size-3.5 shrink-0 text-blue-600' />
                )}
              </div>
              <div className='flex flex-col'>
                <span className='font-medium'>{org.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
