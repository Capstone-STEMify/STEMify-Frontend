'use client'

import * as React from 'react'
import {
  IconAddressBook,
  IconBook,
  IconBox,
  IconBuilding,
  IconCamera,
  IconCell,
  IconChalkboard,
  IconChartAreaLine,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconPuzzle,
  IconReport,
  IconSearch,
  IconUser,
  IconVip
} from '@tabler/icons-react'

import { NavMain } from '@/components/layout/admin/sidebar/nav-main'
import { NavUser } from '@/components/layout/admin/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from 'components/shadcn/sidebar'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { UserRole } from '@/types/userRole'
import { NavSecondary } from '@/components/layout/admin/sidebar/nav-secondary'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navResource: [
    {
      title: 'side_bar.curriculum',
      url: '/admin/curriculum',
      icon: IconListDetails
    },
    {
      title: 'side_bar.course',
      url: '/admin/course',
      icon: IconBook
    },
    {
      title: 'side_bar.lesson',
      url: '/admin/lesson',
      icon: IconChalkboard
    },
    {
      title: 'side_bar.kit',
      url: '/admin/kit',
      icon: IconBox
    },
    {
      title: 'side_bar.component',
      url: '/admin/component',
      icon: IconPuzzle
    },
    {
      title: 'side_bar.straw_labs',
      url: '/admin/straw-lab',
      icon: IconCell
    }
  ],
  operationsCenter: [
    {
      title: 'side_bar.dashboard',
      url: '/admin/dashboard',
      icon: IconChartAreaLine
    },
    {
      title: 'side_bar.user',
      url: '/admin/user',
      icon: IconUser
    },
    {
      title: 'side_bar.organizationSubscription',
      url: '/admin/organization',
      icon: IconBuilding
    },
    {
      title: 'side_bar.plan',
      url: '/admin/plan',
      icon: IconVip
    },
    {
      title: 'side_bar.contact',
      url: '/admin/contact',
      icon: IconAddressBook
    }
  ],
  navDesign: [
    {
      title: 'side_bar.makecode',
      icon: IconCamera,
      url: '#'
    },
    {
      title: 'side_bar.makecode_creator',
      icon: IconFileDescription,
      url: '#'
    },
    {
      title: 'side_bar.straw_labs',
      icon: IconFileAi,
      url: '/admin/design/straw-lab'
    },
    {
      title: 'side_bar.straw_labs_creator',
      icon: IconFileAi,
      url: '/admin/design/straw-lab/create'
    }
  ],
  navSecondary: [
    {
      title: 'side_bar.help',
      icon: IconHelp,
      children: [
        { title: 'side_bar.organization.list', url: '/admin/organization/list', icon: IconListDetails },
        { title: 'side_bar.organization.create', url: '/admin/organization/create', icon: IconFileDescription }
      ]
    },
    {
      title: 'side_bar.search',
      url: '#',
      icon: IconSearch
    }
  ],
  documents: [
    {
      name: 'side_bar.catalog',
      url: '/admin/course-management',
      icon: IconDatabase,
      children: [
        {
          name: 'side_bar.topic',
          url: '/admin/topic',
          icon: IconDatabase
        },
        {
          name: 'side_bar.skill',
          url: '/admin/skill',
          icon: IconReport
        },
        {
          name: 'side_bar.ageRange',
          url: '/admin/age-range',
          icon: IconReport
        },
        {
          name: 'side_bar.standard',
          url: '/admin/standard',
          icon: IconFileWord
        }
      ]
    }
  ]
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    userName?: string | undefined
    userRole?: string | undefined
    userId?: string | undefined
  } & {
    name?: string | null | undefined
    email?: string | null | undefined
    image?: string | null | undefined
  }
}

export function AdminAppSidebar({ user, ...props }: AppSidebarProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('Admin')

  // const userRole = useAppSelector((state) => state?.auth?.user?.role)

  const navResourceWithLocale = data.navResource.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`,
    isActive: pathname === `/${locale}${item.url}`
  }))

  const navDesignWithLocale = data.navDesign.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`,
    isActive: pathname === `/${locale}${item.url}`
  }))

  const documentsWithLocale = data.documents.map((item) => ({
    ...item,
    title: item.name,
    url: `/${locale}${item.url}`,
    isActive: pathname === `/${locale}${item.url}`,
    children: item.children
      ? item.children.map((child) => ({
          ...child,
          title: child.name
        }))
      : undefined
  }))

  const operationsCenterWithLocale = data.operationsCenter.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`,
    isActive: pathname === `/${locale}${item.url}`
  }))

  const secondaryWithLocale = data.navSecondary.map((item) => ({
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
              <Link href='#'>
                <IconInnerShadowTop className='!size-5' />
                <span className='text-base font-semibold'>Stemify</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {user.userRole === UserRole.ADMIN && (
          <NavMain label='side_bar.operationCenter' items={operationsCenterWithLocale} />
        )}
        <NavMain label='side_bar.resource' items={navResourceWithLocale} />

        {/* <NavDesign items={navDesignWithLocale} /> */}
        {user.userRole === UserRole.STAFF && <NavSecondary items={documentsWithLocale} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
