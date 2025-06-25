'use client'

import { Bell, SidebarIcon } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import { useSidebar } from '@/components/shadcn/sidebar'
import SBreadcrumb from '@/components/shared/SBreadcrumb'

export function ClassroomDetailHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className='bg-background sticky top-0 z-50 flex w-full items-center border-b'>
      <div className='flex h-(--header-height) w-full items-center gap-2 px-4'>
        <Button className='h-8 w-8' variant='ghost' size='icon' onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation='vertical' className='mr-2 h-4' />
        <div className='hidden sm:block'>
          <SBreadcrumb size={'sm'} />
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <Bell size={18} />
        </div>
      </div>
    </header>
  )
}
