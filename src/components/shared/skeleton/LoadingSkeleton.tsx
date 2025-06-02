import { Skeleton } from '@/components/shadcn/skeleton'
import { Star } from 'lucide-react'
import React from 'react'

export default function LoadingSkeleton() {
  return (
    <section className='shadow-6 flex w-full max-w-md flex-col gap-2 rounded-md bg-white p-5 duration-150 hover:scale-105 hover:duration-150 dark:bg-neutral-900 dark:text-white'>
      <div className='flex w-full flex-row items-center justify-between'>
        <div className='flex w-full flex-row justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-4 w-20 rounded-md' />
          </div>
          <Skeleton className='h-4 w-12 rounded-md' />
        </div>
      </div>
      <div className='flex w-full flex-row justify-between'>
        <Skeleton className='w-40 rounded-md' />

        <div className='text-xs'>
          <div className='flex flex-row'>
            <Star className='h-4 w-4 animate-pulse text-gray-200 dark:text-neutral-400' />
            <Star className='h-4 w-4 animate-pulse text-gray-200 dark:text-neutral-400' />
            <Star className='h-4 w-4 animate-pulse text-gray-200 dark:text-neutral-400' />
            <Star className='h-4 w-4 animate-pulse text-gray-200 dark:text-neutral-400' />
            <Star className='h-4 w-4 animate-pulse text-gray-200 dark:text-neutral-400' />
          </div>
        </div>
      </div>

      <Skeleton className='h-20 w-full rounded-md' />
    </section>
  )
}
