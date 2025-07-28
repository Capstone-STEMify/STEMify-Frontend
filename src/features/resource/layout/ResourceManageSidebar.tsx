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
import { useAppSelector } from '@/hooks/redux-hooks'

export function ResourceManageSidebar({
  role = UserRole.STAFF,
  ...props
}: { role: UserRole } & React.ComponentProps<typeof Sidebar>) {
  const auth = useAppSelector((state) => state.auth)
  const data = getSidebarData(role, auth)
  return (
    <Sidebar className='top-(--header-height) h-[calc(100svh-var(--header-height))]!' collapsible='icon' {...props}>
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarSwitcher label='Resource' items={data.teams} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <SidbarNavGeneral items={data.navGenral} />
        <SidebarNavGroup label='Course' items={data.navCourse} />
        <SidebarNavGroup label='Lesson' items={data.navLesson} />
        <SidebarNavGroup label='Section & Content' items={data.navSectionContent} />
        <SidebarNavWithActions label='Straw Lab' items={data.navProject} />
        <SidebarNavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserDropdown
          user={{
            name: data.user.name ?? '',
            email: data.user.email ?? '',
            avatar: data.user.avatar ?? ''
          }}
          onLogout={() => {
            console.log('User logged out')
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
