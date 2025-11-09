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
import { IconInnerShadowTop } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useGetOrganizationByIdQuery } from '@/features/organization/api/organizationApi'
import { setSelectedOrganizationId } from '@/features/subscription/slice/selectedOrganizationSlice'

export function OrganizationSwitcher({
  teams
}: {
  teams: {
    name: string
    imageUrl?: string
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch()
  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)
  const { data: organizationData, isLoading } = useGetOrganizationByIdQuery(organizationId!, { skip: !organizationId })

  if (isLoading || !organizationData) {
    return null
  }
  // TODO: Replace with real organization list
  const organizations = [organizationData.data]

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
                {organizationData.data.imageUrl ? (
                  <img
                    src={organizationData.data.imageUrl}
                    alt={organizationData.data.name}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <GraduationCap className='size-4' />
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{organizationData.data.name}</span>
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
            {organizations.map((org, index) => (
              <DropdownMenuItem
                key={org.name}
                onClick={() => dispatch(setSelectedOrganizationId(org.id))}
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-md border'>
                  {org.imageUrl ? (
                    <img src={org.imageUrl} alt={org.name} className='h-full w-full object-cover' />
                  ) : (
                    <GraduationCap className='size-3.5 shrink-0 text-blue-600' />
                  )}
                </div>
                {org.name}
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
