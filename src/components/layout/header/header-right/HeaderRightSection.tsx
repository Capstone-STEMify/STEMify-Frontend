'use client'
import HeaderEvent from '@/components/layout/header/header-right/HeaderEvent'
import { Button } from '@/components/shadcn/button'
import SDrawer from '@/components/shared/SDrawer'
import { SDialog } from '@/components/shared/SDialog'
import SearchBar from '@/components/shared/search/SearchBar'
import SearchExperiencePanel from '@/components/layout/header/header-right/SearchExperiencePanel'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ArrowRightToLine, UserPlus, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function HeaderRightSection() {
  const handleClick = () => alert('Clicked!')
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const searchComponent = isDesktop ? (
    <SDialog
      open={open}
      setOpen={setOpen}
      title='Search'
      description='Search for courses, activities, or lessons'
      trigger={
        <div>
          <SearchBar />
        </div>
      }
      content={<SearchExperiencePanel />}
      footer={<Button variant='secondary'>Close</Button>}
    />
  ) : (
    <SDrawer
      open={open}
      setOpen={setOpen}
      title='Search'
      description='Search for courses, activities, or lessons'
      trigger={
        <div>
          <SearchBar />
        </div>
      }
      content={<SearchExperiencePanel />}
      close={<Button variant='secondary'>Close</Button>}
    />
  )

  return (
    <>
      {/* Desktop Layout */}
      <div className='hidden h-8 items-center justify-center gap-4 lg:flex'>
        {/* Search with enhanced styling */}
        <div className='group relative'>{searchComponent}</div>

        {/* Enhanced Separator with gradient */}
        <div className='relative h-8 w-px'>
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600' />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100' />
        </div>

        <HeaderEvent />

        {/* Enhanced Account Buttons */}
        <div className='flex items-center gap-3'>
          {/* Sign Up Button with subtle animation */}
          <Button
            size='sm'
            variant='ghost'
            onClick={handleClick}
            className='group relative overflow-hidden rounded-lg px-4 py-2 transition-all duration-300 hover:text-sky-500 dark:hover:bg-amber-950/20'
          >
            <UserPlus className='mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
            <span className='relative font-medium'>Sign Up</span>
          </Button>

          {/* Premium Log In Button */}
          <Button
            size='lg'
            onClick={() => signIn('oidc')}
            className='group relative overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 px-6 py-2.5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:scale-95'
          >
            <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/20 to-white/0 transition-transform duration-500 group-hover:translate-x-[100%]' />
            <div className='flex items-center gap-2'>
              <ArrowRightToLine size={16} className='transition-transform duration-200 group-hover:translate-x-1' />
              <span className='font-semibold'>Log In</span>
              <Sparkles size={14} className='opacity-70 transition-opacity duration-200 group-hover:opacity-100' />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Layout - Enhanced Vertical Stack */}
      <div className='flex w-full flex-col space-y-4 lg:hidden'>
        <div className='flex w-full flex-col space-y-3 pt-2'>
          {/* 🔍 Search trigger for mobile */}
          <div className='px-4'>{searchComponent}</div>

          <HeaderEvent />

          {/* Mobile Sign Up Button */}
          <Button
            size='default'
            variant='ghost'
            onClick={handleClick}
            className='group w-full justify-center rounded-xl border border-gray-200/50 bg-white/50 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-amber-50 hover:text-amber-500 dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:bg-amber-950/20'
          >
            <UserPlus className='mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
            <span className='font-medium'>Sign Up</span>
          </Button>

          {/* Mobile Log In Button */}
          <Button
            size='default'
            onClick={handleClick}
            className='group w-full justify-center rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95'
          >
            <div className='flex items-center gap-2'>
              <ArrowRightToLine size={16} className='transition-transform duration-200 group-hover:translate-x-1' />
              <span className='font-semibold'>Log In</span>
              <Sparkles size={14} className='opacity-70 transition-opacity duration-200 group-hover:opacity-100' />
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}
