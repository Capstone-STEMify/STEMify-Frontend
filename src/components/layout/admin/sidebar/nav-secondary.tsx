'use client'

import * as React from 'react'
import { type Icon } from '@tabler/icons-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from 'components/shadcn/sidebar'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/shadcn/collapsible'
import { ChevronDown } from 'lucide-react'

type NavItem = {
  title: string
  url: string
  icon: Icon
  children?: { title: string; url: string; icon: Icon }[]
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const t = useTranslations('Admin')

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) =>
            item.children ? (
              <Collapsible key={item.title} defaultOpen={false} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className='text-xs'>
                      <item.icon />
                      <span>{t(item.title)}</span>
                      <ChevronDown className='ml-auto size-4 opacity-50 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <Link href={sub.url}>
                            <span className='text-[12px]'>{t(sub.title)}</span>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{t(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
