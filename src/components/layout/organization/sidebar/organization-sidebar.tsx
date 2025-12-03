'use client'

import * as React from 'react'
import { IconBook, IconChalkboard, IconListDetails, IconReceipt, IconUser, IconUsersGroup } from '@tabler/icons-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from 'components/shadcn/sidebar'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { NavMain } from '@/components/layout/admin/sidebar/nav-main'
import { NavUser } from '@/components/layout/admin/sidebar/nav-user'
import { OrganizationSwitcher } from '@/components/layout/organization/sidebar/organization-switcher'

// thay /admin thành /organization
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'side_bar.dashboard',
      url: '/organization/dashboard',
      icon: IconListDetails
    },
    {
      title: 'side_bar.subscription',
      url: '/organization/subscriptions',
      icon: IconReceipt
    },
    {
      title: 'side_bar.classroom',
      url: '/organization/classroom',
      icon: IconChalkboard
    },
    {
      title: 'side_bar.group',
      url: '/organization/group',
      icon: IconUsersGroup
    },
    {
      title: 'side_bar.curriculum',
      url: '/organization/curriculum',
      icon: IconBook
    },
    {
      title: 'side_bar.user',
      url: '/organization/user',
      icon: IconUser
    }
  ]
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    username?: string | undefined
    role?: string | undefined
    userId?: string | undefined
  } & {
    name?: string | null | undefined
    email?: string | null | undefined
    image?: string | null | undefined
  }
}

export function OrganizationSidebar({ user, ...props }: AppSidebarProps) {
  const locale = useLocale()
  const pathname = usePathname()

  // const userRole = useAppSelector((state) => state?.auth?.user?.role)

  const navMainWithLocale = data.navMain.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`,
    isActive: pathname === `/${locale}${item.url}`
  }))

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <OrganizationSwitcher />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithLocale} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
