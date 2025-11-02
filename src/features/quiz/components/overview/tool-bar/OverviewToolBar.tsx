import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { CalendarDays, Plus, Search, X } from 'lucide-react'

export function QuizOverviewToolbar() {
  return (
    <div>
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='secondary' className='bg-blue-100 text-blue-700 hover:bg-blue-200'>
            Total Question: 5 or more
            <X className='ml-2 h-3 w-3' />
          </Button>
          <Button variant='link' className='p-2 text-gray-600'>
            Reset
          </Button>
          <Button variant='outline'>
            <Plus className='mr-2 h-4 w-4' />
            Add Filter
          </Button>
        </div>
        <Button variant='outline'>
          <CalendarDays className='mr-2 h-4 w-4' />
          Date Created
        </Button>
      </div>
      <div className='mt-4 flex items-center gap-4'>
        <div className='relative flex-grow'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input placeholder='Search...' className='bg-white pl-9' />
        </div>
      </div>
    </div>
  )
}
