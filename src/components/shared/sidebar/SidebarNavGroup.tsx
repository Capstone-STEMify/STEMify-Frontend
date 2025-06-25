import { type LucideIcon } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/shadcn/sidebar'
import Link from 'next/link'
import { cn } from '@/shadcn/utils'
export interface SidebarNavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
}

interface SidebarNavGroupProps {
  label: string
  items: SidebarNavItem[]
  className?: string
}

export function SidebarNavGroup({ label, items, className }: SidebarNavGroupProps) {
  return (
    <SidebarGroup className={cn(className)}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link
                href={item.url}
                className={cn('flex w-full items-center gap-2', item.isActive && 'text-primary font-semibold')}
              >
                {item.icon && <item.icon className='h-4 w-4' />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
