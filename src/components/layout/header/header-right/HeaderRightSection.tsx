import HeaderEvent from '@/components/layout/header/header-right/HeaderEvent'
import { Button } from '@/components/shadcn/button'
import { DialogClose } from '@/components/shadcn/dialog'
import { Separator } from '@/components/shadcn/separator'
import { SDialog } from '@/components/shared/search/SDialog'
import SearchBar from '@/components/shared/search/SearchBar'
import SearchExperiencePanel from '@/components/shared/search/SearchExperiencePanel'
import { ArrowRightToLine, UserPlus } from 'lucide-react'
import React from 'react'

export default function HeaderRightSection() {
  const handleClick = () => alert('Clicked!')

  return (
    <div className='flex h-6 items-center justify-center gap-3'>
      {/* Search */}
      {/* <SearchBar /> */}
      <SDialog
        title='Search'
        description='Search for courses, activities, or lessons'
        trigger={
          <div>
            <SearchBar />
          </div>
        }
        content={<SearchExperiencePanel />}
        footer={
          <DialogClose asChild>
            <Button variant='secondary'>Close</Button>
          </DialogClose>
        }
      />

      {/* Separator */}
      <Separator orientation='vertical' className='h-6 w-px bg-gray-200 dark:bg-gray-700' />

      <HeaderEvent />

      {/* Account */}
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
