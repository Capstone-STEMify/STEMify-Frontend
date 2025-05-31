'use client'

import HeaderNavigation from '@/components/layout/header/HeaderNavigation'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import StemifyLogo from '@/components/shared/StemifyLogo'
import { ArrowRightToLine, UserPlus } from 'lucide-react'

export default function Header() {
  const handleClick = () => alert('Clicked!')

  return (
    <div className='flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0'>
      {/* logo and navigation */}
      <div className='flex items-center gap-6'>
        <StemifyLogo />
        <Separator
          orientation='vertical'
          className='via-slay-custom-200 hidden h-8 w-px bg-gradient-to-b from-transparent to-transparent sm:block'
        />
        <HeaderNavigation />
      </div>

      {/* button */}
      <div className='flex items-center'>
        <Button
          size='lg'
          variant='ghost'
          onClick={handleClick}
          className='hover:text-amber-custom-400 font-medium transition-all duration-200'
        >
          <UserPlus className='mr-2 h-4 w-4' />
          Sign Up
        </Button>
        <Button
          size='lg'
          onClick={handleClick}
          className='transform items-center bg-amber-500 shadow-lg transition-all'
        >
          <ArrowRightToLine size={16} />
          Login
        </Button>
      </div>
    </div>
  )
}
