import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import SearchBar from '@/components/shared/search/SearchBar'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Download, Folder, ListCollapse, Plus } from 'lucide-react'
import React from 'react'

export default function ClassroomDetailAction() {
  const isXL = useMediaQuery('(min-width: 1280px)')
  return (
    <div className='mt-5'>
      <div className='flex flex-col justify-between gap-y-3 sm:flex-row sm:items-center'>
        {isXL ? (
          <div className='flex space-x-3'>
            <Button>
              <Plus size={16} />
              Create
            </Button>

            <Button variant='outline'>
              <Download size={16} />
              Upload
            </Button>

            <Button variant='outline'>
              <Folder size={16} />
              Create Folder
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='ring-0 ring-offset-0 focus-visible:ring-0'>
              <Button variant='outline' className='w-fit'>
                <ListCollapse size={16} />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem>
                <Plus size={16} className='mr-2' />
                Create
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download size={16} className='mr-2' />
                Upload
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Folder size={16} className='mr-2' />
                Create Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div>
          <SearchBar placeholder='Search resources...' />
        </div>
      </div>
    </div>
  )
}
