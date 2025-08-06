'use client'

import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/shadcn/sidebar'
import Link from 'next/link'
import { cn } from '@/shadcn/utils'

export interface SidebarAction {
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
  isDanger?: boolean
}

export interface SidebarNavItemWithActions {
  title: string
  url: string
  icon?: React.ElementType<{ className?: string }>
  actions?: SidebarAction[]
}

interface SidebarNavWithActionsProps {
  label: string
  items: SidebarNavItemWithActions[]
  className?: string
}

export function SidebarNavWithActions({ label, items, className }: SidebarNavWithActionsProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className={cn(className)}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url} className='flex w-full items-center gap-2'>
                {item.icon && <item.icon className='h-4 w-4' />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>

            {item.actions && item.actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className='sr-only'>More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-48'
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  {item.actions.map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onSelect={action.onSelect}
                      className={cn(action.isDanger && 'text-destructive')}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </DropdownMenuItem>
                  ))}
                  {item.actions.some((a) => a.isDanger) && <DropdownMenuSeparator />}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
