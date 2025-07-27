'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'
import { getSidebarData } from '@/utils/sidebar-data'
import { SidbarNavGeneral } from '@/components/shared/sidebar/SidbarNavGeneral'
import { SidebarSwitcher } from '@/components/shared/sidebar/SidebarSwitcher'
import { SidebarNavWithActions } from '@/components/shared/sidebar/SidebarNavWithActions'
import { SidebarNavGroup } from '@/components/shared/sidebar/SidebarNavGroup'
import { SidebarUserDropdown } from '@/components/shared/sidebar/SidebarUserDropdown'
import { SidebarNavSecondary } from '@/components/shared/sidebar/SidebarNavSecondary'

export function ClassroomSidebar({
  role = UserRole.STUDENT,
  ...props
}: { role: UserRole } & React.ComponentProps<typeof Sidebar>) {
  // const data = getSidebarData(role)
  return (
    <Sidebar className='top-(--header-height) h-[calc(100svh-var(--header-height))]!' collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>{/* <SidebarSwitcher label='Classroom' items={data.teams} /> */}</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <SidbarNavGeneral items={data.navGenral} />
        <SidebarNavGroup label='Resources' items={data.navMain} />
        <SidebarNavWithActions label='Projects' items={data.navProject} />
        <SidebarNavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <SidebarUserDropdown
          user={data.user}
          onLogout={() => {
            console.log('User logged out')
          }}
        /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
