'use client'

import * as React from 'react'
import {
  Activity,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal
} from 'lucide-react'

import { NavProjects } from './nav-project'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from '@/components/shadcn/sidebar'
import { ClassroomSwitcher } from '@/features/classroom/components/classroom-detail/sidebar/team-switcher'
import { NavMain } from '@/features/classroom/components/classroom-detail/sidebar/nav-main'
import { NavSecondary } from '@/features/classroom/components/classroom-detail/sidebar/nav-secondary'
import { NavUser } from '@/features/classroom/components/classroom-detail/sidebar/nav-user'

const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],

  navMain: [
    {
      title: 'Course',
      url: '#',
      icon: SquareTerminal,
      isActive: true
    },
    {
      title: 'Lesson',
      url: '#',
      icon: Bot
    },
    {
      title: 'Activity',
      url: '#',
      icon: Activity
    },
    {
      title: 'Quiz',
      url: '#',
      icon: BookOpen
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2
    }
  ],
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
