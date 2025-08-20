'use client'

import * as React from 'react'
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers
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

import { signOut, useSession } from 'next-auth/react'
import { useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '../shared/loading/LoadingComponent'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    // {
    //   title: 'Dashboard',
    //   url: 'dashboard',
    //   icon: IconDashboard
    // },
    {
      title: 'side_bar.course',
      url: '/admin/course',
      icon: IconListDetails
    },
    {
      title: 'side_bar.lesson',
      url: '/admin/lesson',
      icon: IconChartBar
    }
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#'
        },
        {
          title: 'Archived',
          url: '#'
        }
      ]
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#'
        },
        {
          title: 'Archived',
          url: '#'
        }
      ]
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#'
        },
        {
          title: 'Archived',
          url: '#'
        }
      ]
    }
  ],
  navSecondary: [
    {
      title: 'side_bar.setting',
      url: '#',
      icon: IconSettings
    },
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

  const navMainWithLocale = data.navMain.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`
  }))

  const documentsWithLocale = data.documents.map((item) => ({
    ...item,
    url: `/${locale}${item.url}`
  }))
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      // <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
      //   <LoadingComponent size={18} textShow={false} />
      // </div>
      <Sidebar collapsible='offcanvas' {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
                <Link href='#'>
                  <IconInnerShadowTop className='!size-5' />
                  <span className='text-base font-semibold'>STEMify</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMainWithLocale} />
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
                <span className='text-base font-semibold'>STEMify</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithLocale} />
        <NavDocuments items={documentsWithLocale} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
