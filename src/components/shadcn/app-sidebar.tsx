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
  IconSearch,
  IconSettings
} from '@tabler/icons-react'

import { NavDocuments } from 'components/shadcn/nav-documents'
import { NavMain } from 'components/shadcn/nav-main'
import { NavSecondary } from 'components/shadcn/nav-secondary'
import { NavUser } from 'components/shadcn/nav-user'
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

import { useSession } from 'next-auth/react'
import LoadingComponent from '../shared/loading/LoadingComponent'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { NavDesign } from '@/components/shadcn/nav-design'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale()
  const pathname = usePathname()

  const userRole = useAppSelector((state) => state?.auth?.user?.role)

  const navMainWithLocale = data.navMain.map((item) => ({
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
  const { data: session, status } = useSession()

  if (status === 'loading') {
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
          <NavMain items={navMainWithLocale} />
          <NavDesign items={navDesignWithLocale} />
          <NavDocuments items={documentsWithLocale} />
          <NavSecondary items={data.navSecondary} className='mt-auto' />
        </SidebarContent>
        <SidebarFooter>
          <div>
            <LoadingComponent size={18} textShow={false} />
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }

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
        <NavMain items={navMainWithLocale} />
        {/* <NavDesign items={navDesignWithLocale} /> */}
        {userRole && userRole === UserRole.ADMIN && <NavDocuments items={documentsWithLocale} />}
        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
