'use client'

import * as React from 'react'
import {
  IconBook,
  IconBox,
  IconCamera,
  IconChalkboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconPuzzle,
  IconReport,
  IconSearch
} from '@tabler/icons-react'

import { NavDocuments } from '@/components/layout/admin/sidebar/nav-documents'
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
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { UserRole } from '@/types/userRole'
import { title } from 'process'

// thay /admin thành /organization
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
    }
  ],
  operationsCenter: [
    {
      title: 'side_bar.dashboard',
      url: '/admin/dashboard',
      icon: IconCamera
    },
    {
      title: 'side_bar.user',
      url: '/admin/user',
      icon: IconDatabase
    },
    {
      title: 'side_bar.organization',
      url: '/admin/organization',
      icon: IconCamera
    },
    {
      title: 'side_bar.plan',
      url: '/admin/plan',
      icon: IconFileDescription
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
      url: '#',
      icon: IconHelp
    },
    {
      title: 'side_bar.search',
      url: '#',
      icon: IconSearch
    }
  ],
  documents: [
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

export function AdminAppSidebar({ user, ...props }: AppSidebarProps) {
  const locale = useLocale()
  const pathname = usePathname()

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
    url: `/${locale}${item.url}`,
    isActive: pathname === `/${locale}${item.url}`
  }))

  const operationsCenterWithLocale = data.operationsCenter.map((item) => ({
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
        <NavMain items={navResourceWithLocale} />
        {/* <NavDesign items={navDesignWithLocale} /> */}
        {user.role && user.role === UserRole.ADMIN && <NavDocuments items={documentsWithLocale} />}
        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
