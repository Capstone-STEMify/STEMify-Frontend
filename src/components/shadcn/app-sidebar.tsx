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
      title: 'Course',
      url: '/admin/course',
      icon: IconListDetails
    },
    {
      title: 'Lesson',
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
      title: 'Settings',
      url: '#',
      icon: IconSettings
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch
    }
  ],
  documents: [
    {
      name: 'Topic',
      url: '/admin/topic',
      icon: IconDatabase
    },
    {
      name: 'Skill',
      url: '/admin/skill',
      icon: IconReport
    },
    {
      name: 'Age range',
      url: '/admin/age-range',
      icon: IconReport
    },
    {
      name: 'Standard',
      url: '/admin/standard',
      icon: IconFileWord
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
