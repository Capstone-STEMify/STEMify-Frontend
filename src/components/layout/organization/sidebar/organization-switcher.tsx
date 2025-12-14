'use client'

import * as React from 'react'
import { ChevronsUpDown, GraduationCap, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  setSelectedOrganizationId,
  setSelectedSubscriptionOrderId
} from '@/features/subscription/slice/selectedOrganizationSlice'
import { useSearchLicenseAssignmentQuery } from '@/features/license-assignment/api/licenseAssignmentApi'
import { LicenseAssignmentStatus } from '@/features/license-assignment/types/licenseAssignment'

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const selectedOrganizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const { data: licenseAssignmentData, isLoading } = useSearchLicenseAssignmentQuery(
    { userId: user?.userId, status: LicenseAssignmentStatus.ACTIVE, pageSize: 10, pageNumber: 1 },
    { skip: !user?.userId }
  )

  const licenseAssignments = licenseAssignmentData?.data?.items ?? []

  // Nếu chưa chọn org nào => mặc định chọn org đầu tiên
  React.useEffect(() => {
    if (licenseAssignments.length && !selectedOrganizationId) {
      const first = licenseAssignments[0]
      dispatch(setSelectedOrganizationId(first.organizationId))
      dispatch(setSelectedSubscriptionOrderId(first.organizationSubscriptionOrderId))
    }
  }, [licenseAssignments, selectedOrganizationId, dispatch])

  if (isLoading || !licenseAssignments.length) return null

  // Organization đang được chọn
  const selectedOrg =
    licenseAssignments.find((org) => org.organizationId === selectedOrganizationId) ?? licenseAssignments[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-200 text-blue-600'>
                {selectedOrg.organizationImageUrl ? (
                  <img
                    src={selectedOrg.organizationImageUrl}
                    alt={selectedOrg.organizationName}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <GraduationCap className='size-4' />
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{selectedOrg.organizationName}</span>
                <span className='text-muted-foreground text-xs'>{selectedOrg.planName}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>Tổ chức</DropdownMenuLabel>

            {licenseAssignments.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => dispatch(setSelectedOrganizationId(org.organizationId))}
                className={`gap-2 p-2 ${org.organizationId === selectedOrganizationId ? 'bg-sidebar-accent/50' : ''}`}
              >
                <div className='flex size-6 items-center justify-center rounded-md border'>
                  {org.organizationImageUrl ? (
                    <img
                      src={org.organizationImageUrl}
                      alt={org.organizationName}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <GraduationCap className='size-3.5 shrink-0 text-blue-600' />
                  )}
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium'>{org.organizationName}</span>
                  <p className='text-muted-foreground text-xs'>{org.planName}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
