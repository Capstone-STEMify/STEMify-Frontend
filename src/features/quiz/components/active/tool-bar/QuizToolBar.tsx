import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { ChevronDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function QuizToolbar() {
  const t = useTranslations('dashboard.classroom.quiz')
  const tc = useTranslations('common')

  return (
    <div className='mt-6 flex flex-col items-center justify-between gap-4 md:flex-row'>
      <div className='flex w-full items-center gap-2 md:w-auto'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full justify-between md:w-auto'>
              {tc('tableHeader.status')} <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{/* Dropdown items go here */}</DropdownMenuContent>
        </DropdownMenu>
        <Button variant='outline'>
          <Plus className='mr-2 h-4 w-4' />
          {tc('button.filter')}
        </Button>
      </div>
      <div className='flex w-full items-center gap-2 md:w-auto'>
        <div className='relative w-full md:w-auto'>
          <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
          <Input type='search' placeholder='Search...' className='w-full pl-8 md:w-[250px]' />
        </div>
        <Button>{tc('button.export')}</Button>
        <Button variant='outline' size='icon'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
