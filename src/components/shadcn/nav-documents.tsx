'use client'

import { cn } from '@/utils/shadcn/utils'
import { IconDots, IconFolder, IconShare3, IconTrash, type Icon } from '@tabler/icons-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/shadcn/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from 'components/shadcn/sidebar'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavDocuments({
  items
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()
  const t = useTranslations('Admin')
  const pathname = usePathname()

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>{t('side_bar.catalog')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname.startsWith(item.url)

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <item.icon size={20} />
                  <span>{t(item.name)}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover className='data-[state=open]:bg-accent rounded-sm'>
                    <IconDots />
                    <span className='sr-only'>More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-24 rounded-lg'
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <IconFolder />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconShare3 />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant='destructive'>
                    <IconTrash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
