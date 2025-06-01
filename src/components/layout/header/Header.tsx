'use client'

import HeaderNavigation from '@/components/layout/header/HeaderNavigation'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import StemifyLogo from '@/components/shared/StemifyLogo'
import SToolTip from '@/components/shared/SToolTip'
import { ArrowRightToLine, Bell, Gift, UserPlus } from 'lucide-react'

export default function Header() {
  const handleClick = () => alert('Clicked!')

  return (
    <div className='flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0'>
      {/* logo and navigation */}
      <div className='flex items-center gap-10'>
        <StemifyLogo />
        <HeaderNavigation />
      </div>

      <div className='flex h-6 items-center justify-center gap-3'>
        {/* icons */}
        <div className='flex items-center justify-center'>
          <SToolTip
            content='Notification'
            children={
              <Button
                size={'icon'}
                variant='ghost'
                className='hover:text-amber-custom-400 text-gray-400 transition-colors duration-200'
              >
                <Bell />
              </Button>
            }
          />

          <SToolTip
            content='Notification'
            children={
              <Button
                size={'icon'}
                variant='ghost'
                className='hover:text-amber-custom-400 text-gray-400 transition-colors duration-200'
              >
                <Gift />
              </Button>
            }
          />
        </div>
        <Separator orientation='vertical' className='w-px bg-gray-300' />

        {/* Sign up - Log in */}
        <Button
          size='sm'
          variant='ghost'
          onClick={handleClick}
          className='hover:text-amber-custom-400 transition-colors duration-200'
        >
          <UserPlus className='mr-2 h-4 w-4' />
          Sign Up
        </Button>
        <Button
          size='lg'
          onClick={handleClick}
          className='bg-amber-custom-400 transform items-center rounded-full shadow-lg transition-colors'
        >
          <ArrowRightToLine size={16} />
          Log In
        </Button>
      </div>
    </div>
  )
}
