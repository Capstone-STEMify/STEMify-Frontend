'use client'

import { ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar'
import { ElementType, useState } from 'react'

export interface SwitcherItem {
  name: string
  logo: ElementType<{ className?: string }>
  plan: string
}

interface SidebarSwitcherProps {
  label?: string
  items: SwitcherItem[]
  defaultIndex?: number
  onSelect?: (item: SwitcherItem) => void
  onCreateNew?: () => void
}

export function SidebarSwitcher({
  label = 'Workspace',
  items,
  defaultIndex = 0,
  onSelect,
  onCreateNew
}: SidebarSwitcherProps) {
  const { isMobile } = useSidebar()
  const [active, setActive] = useState(items[defaultIndex])

  if (!active) return null

  const handleSelect = (item: SwitcherItem) => {
    setActive(item)
    onSelect?.(item)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <active.logo className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{active.name}</span>
                <span className='truncate text-xs'>{active.plan}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>{label}</DropdownMenuLabel>
            {items.map((item, index) => (
              <DropdownMenuItem key={item.name} onClick={() => handleSelect(item)} className='gap-2 p-2'>
                <div className='flex size-6 items-center justify-center rounded-md border'>
                  <item.logo className='size-3.5 shrink-0' />
                </div>
                {item.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCreateNew} className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>Add {label.toLowerCase()}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
