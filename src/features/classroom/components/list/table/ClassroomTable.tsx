'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { Progress } from '@/components/shadcn/progress'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetClassroomColumn } from '@/features/classroom/components/list/table/ClassroomColumn'
import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { ClassroomStatus } from '@/features/classroom/types/classroom.type'
import UpsertClassroomModal from '@/features/classroom/components/upsert/UpsertClassroomModal'
import { useModal } from '@/providers/ModalProvider'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

// Mock data
type Classroom = {
  id: number
  title: string
  students: string[]
  category: string
  duration: string
  status: 'In progress' | 'Completed' | 'Pending'
  completedTasks: number
  totalTasks: number
}

const mockClassrooms: Classroom[] = [
  {
    id: 1,
    title: 'UI/UX fundamental',
    students: ['/avatars/1.png', '/avatars/2.png', '/avatars/3.png', '/avatars/4.png'],
    category: 'UI/UX',
    duration: '14 Hours',
    status: 'In progress',
    completedTasks: 3,
    totalTasks: 16
  },
  {
    id: 2,
    title: 'Basic research',
    students: ['/avatars/5.png', '/avatars/6.png', '/avatars/7.png'],
    category: 'Research',
    duration: '20 Hours',
    status: 'In progress',
    completedTasks: 10,
    totalTasks: 16
  },
  {
    id: 3,
    title: 'Fullstack Web Design',
    students: ['/avatars/8.png', '/avatars/9.png', '/avatars/10.png'],
    category: 'Engineer',
    duration: '24 Hours',
    status: 'Pending',
    completedTasks: 4,
    totalTasks: 20
  },
  {
    id: 4,
    title: 'Graphic design skill',
    students: ['/avatars/1.png', '/avatars/2.png', '/avatars/3.png'],
    category: 'Design',
    duration: '10 Hours',
    status: 'Completed',
    completedTasks: 16,
    totalTasks: 16
  },
  {
    id: 5,
    title: 'Basic Illustration',
    students: ['/avatars/5.png', '/avatars/6.png'],
    category: 'Illustration',
    duration: '12 Hours',
    status: 'Completed',
    completedTasks: 20,
    totalTasks: 20
  }
]

// Columns

export default function ClassroomTable() {
  const { openModal } = useModal()
  const router = useRouter()
  const locale = useLocale()

  const { data } = useSearchClassroomsQuery({ status: ClassroomStatus.PENDING })
  const rows = React.useMemo(() => data?.data.items ?? [], [data])
  const columns = useGetClassroomColumn()
  return (
    <div className='mt-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Classroom</h1>
        </div>
        <Button
          className='bg-sky-600 text-white hover:bg-sky-700'
          onClick={() => router.push(`/${locale}/organization/classroom/create`)}
        >
          + Create class
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex gap-2'>
          <select className='border-border bg-background text-muted-foreground rounded-md border px-3 py-2 text-sm'>
            <option>All category</option>
            <option>Design</option>
            <option>Research</option>
            <option>Engineering</option>
          </select>
          <select className='border-border bg-background text-muted-foreground rounded-md border px-3 py-2 text-sm'>
            <option>All status</option>
            <option>Completed</option>
            <option>In progress</option>
            <option>Pending</option>
          </select>
        </div>
        <div className='flex gap-2'>
          <input
            type='text'
            placeholder='Search...'
            className='border-border bg-background text-muted-foreground w-64 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none'
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        enableRowSelection={true}
        data={rows}
        columns={columns}
        pagingData={{
          data: { totalPages: 24, totalItems: 120 }
        }}
        pagingParams={{ pageNumber: 1, pageSize: 5 }}
        handlePageChange={() => {}}
      />
    </div>
  )
}
