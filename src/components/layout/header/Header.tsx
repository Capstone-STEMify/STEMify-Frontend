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
      <div className='flex items-center gap-10'>
        <StemifyLogo />
        <HeaderNavigation />
      </div>

      {/* button */}
      <div className='flex h-6 items-center justify-center gap-3'>
        <div>news</div>
        <div>news</div>
        <div>news</div>

        <Separator orientation='vertical' className='w-px bg-gray-300' />

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
          className='transform items-center rounded-full bg-amber-500 shadow-lg transition-colors'
        >
          <ArrowRightToLine size={16} />
          Login
        </Button>
      </div>
    </div>
  )
}
