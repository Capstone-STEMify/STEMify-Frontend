'use client'

import * as React from 'react'
import { ChevronsUpDown, GraduationCap, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setSelectedOrganizationId, setSelectedSubscriptionOrderId } from '@/features/subscription/slice/selectedOrganizationSlice'
import { useSearchLicenseAssignmentQuery } from '@/features/license-assignment/api/licenseAssignmentApi'
import { LicenseAssignmentStatus } from '@/features/license-assignment/types/licenseAssignment'

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const { data: licenseAssignmentData, isLoading } = useSearchLicenseAssignmentQuery(
    { userId: user?.userId, status: LicenseAssignmentStatus.ACTIVE, pageSize: 5, pageNumber: 1 },
    { skip: !user?.userId }
  )

  if (isLoading || !licenseAssignmentData) {
    return null
  }
  const licenseAssignments = licenseAssignmentData.data.items
  dispatch(setSelectedOrganizationId(licenseAssignments[0].organizationId))
  dispatch(setSelectedSubscriptionOrderId(licenseAssignments[0].organizationSubscriptionOrderId))

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
                {licenseAssignments[0].organizationImageUrl ? (
                  <img
                    src={licenseAssignments[0].organizationImageUrl}
                    alt={licenseAssignments[0].organizationName}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <GraduationCap className='size-4' />
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{licenseAssignments[0].organizationName}</span>
                <span className='text-muted-foreground text-xs'>{licenseAssignments[0].planName}</span>
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
            <DropdownMenuLabel className='text-muted-foreground text-xs'>Organizations</DropdownMenuLabel>
            {licenseAssignments.map((org, index) => (
              <DropdownMenuItem
                key={org.organizationName}
                onClick={() => dispatch(setSelectedOrganizationId(org.organizationId))}
                className='gap-2 p-2'
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
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>Add team</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
