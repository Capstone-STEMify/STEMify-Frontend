import HeaderEvent from '@/components/layout/header/header-right/HeaderEvent'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import SToolTip from '@/components/shared/SToolTip'
import { ArrowRightToLine, Bell, Gift, UserPlus } from 'lucide-react'
import React from 'react'

export default function HeaderRightSection() {
  const handleClick = () => alert('Clicked!')

  return (
    <div className='flex h-6 items-center justify-center gap-3'>
      {/* Events */}
      <HeaderEvent />

      <Separator orientation='vertical' className='w-px' />

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
  )
}
