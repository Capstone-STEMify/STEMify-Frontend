'use client'

import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'
import StemifyLogo from '@/components/shared/StemifyLogo'
import HeaderNavigation from '@/components/layout/header/HeaderNavigation'
import HeaderRightSection from '@/components/layout/header/HeaderAction'
import { Button } from '@/components/shadcn/button'
import { Menu } from 'lucide-react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className='flex w-full items-center justify-between'>
        <StemifyLogo className='h-8 w-auto' />
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon' aria-label='Open menu'>
            <Menu className='h-6 w-6 text-gray-700' />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent side='left' className='w-[80vw] p-4 sm:w-[360px]'>
        <SheetHeader className='pb-4'>
          <SheetTitle>
            <StemifyLogo className='mx-auto h-8 w-auto' />
          </SheetTitle>
        </SheetHeader>

        <div className='flex h-full flex-col space-y-6'>
          {/* Navigation Section */}
          <div className='flex-1'>
            <HeaderNavigation />
          </div>

          {/* Divider */}
          <div className='border-muted border-t' />

          {/* Right Section - Search & Account */}
          <div className='pb-6'>
            <HeaderRightSection />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
