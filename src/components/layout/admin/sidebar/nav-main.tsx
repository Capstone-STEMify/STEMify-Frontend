'use client'

import { cn } from '@/utils/shadcn/utils'
import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from 'components/shadcn/sidebar'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavMain({
  items,
  label
}: {
  label?: string
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  const t = useTranslations('Admin')
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{t(label)}</SidebarGroupLabel>}
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    href={item.url}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                      // khi hover (chưa active)
                      !isActive && 'hover:bg-blue-100 hover:text-blue-600',
                      // khi active (như hover)
                      isActive && 'bg-blue-100 text-blue-600',
                      // khi active + hover -> màu khác
                      isActive && 'hover:bg-blue-200 hover:text-blue-700',
                      // mặc định
                      !isActive && 'text-black'
                    )}
                  >
                    {item.icon && <item.icon size={20} />}
                    <span>{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
