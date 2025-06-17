'use client'

import * as React from 'react'

import { NavProjects } from './nav/nav-project'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from '@/components/shadcn/sidebar'
import { ClassroomSwitcher } from '@/features/classroom/components/classroom-detail/sidebar/nav/team-switcher'
import { NavMain } from '@/features/classroom/components/classroom-detail/sidebar/nav/nav-main'
import { NavSecondary } from '@/features/classroom/components/classroom-detail/sidebar/nav/nav-secondary'
import { NavUser } from '@/features/classroom/components/classroom-detail/sidebar/nav/nav-user'
import { UserRole } from '@/types/userRole'
import { getSidebarData } from '@/features/classroom/types/sidebar-data'

export function AppSidebar({
  role = UserRole.STUDENT,
  ...props
}: { role: UserRole } & React.ComponentProps<typeof Sidebar>) {
  const data = getSidebarData(role)
  return (
    <Sidebar className='top-(--header-height) h-[calc(100svh-var(--header-height))]!' collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <ClassroomSwitcher teams={data.teams} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.navProject} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
