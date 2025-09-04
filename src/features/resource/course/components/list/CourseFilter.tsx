import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import React, { useState } from 'react'
import CourseListAction from '../list/CourseListAction'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { CourseStatus } from '../../types/course.type'
import { Button } from '@/components/shadcn/button'
import { IconPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export default function CourseFilter() {
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus>(CourseStatus.PUBLISHED)

  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/course/create')
  }
  return (
    <Tabs
      defaultValue={selectedStatus}
      value={selectedStatus}
      onValueChange={(val) => setSelectedStatus(val as CourseStatus)}
      className='w-full flex-col justify-start gap-6'
    >
      <CourseListAction />
      <div className='flex items-center justify-between'>
        <Select defaultValue='outline'>
          <SelectTrigger className='flex w-fit @4xl/main:hidden' size='sm' id='view-selector'>
            <SelectValue placeholder='Select a view' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CourseStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TabsList className='hidden @4xl/main:flex'>
          {Object.values(CourseStatus).map((status) => (
            <TabsTrigger key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='bg-amber-custom-400 cursor-pointer text-white'
            onClick={handleCreate}
          >
            <IconPlus />
            <span className='hidden lg:inline'>Add New</span>
          </Button>
        </div>
      </div>
    </Tabs>
  )
}
