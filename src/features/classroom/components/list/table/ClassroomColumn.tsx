import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Progress } from '@/components/shadcn/progress'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { Classroom, ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDateV2 } from '@/utils/index'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, Users } from 'lucide-react'
import Image from 'next/image'

export function useGetClassroomColumn(): ColumnDef<Classroom>[] {
  return [
    createSelectColumn<Classroom>(),
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'classCode',
      header: 'Class Code'
    },
    {
      accessorKey: 'numberOfStudents',
      header: 'No. Students',
      cell: ({ row }) => {
        const numberOfStudents = row.original.numberOfStudents
        return (
          <span className='flex items-center gap-1'>
            {numberOfStudents} <Users size={14} />
          </span>
        )
      }
    },

    {
      accessorKey: 'grade',
      header: 'Grade'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        return <Badge className={`${getStatusBadgeClass(status)} font-medium`}>{status}</Badge>
      }
    },
    {
      accessorKey: 'curriculum',
      header: () => <p className='text-center'>Curriculum</p>,
      cell: ({ row }) => {
        const curriculum = row.original.curriculum
        return (
          <div className='flex flex-col items-center'>
            <Image
              src={curriculum.imageUrl}
              alt={curriculum.title}
              width={32}
              height={32}
              className='size-8 rounded-full object-cover'
            />
            <p className='font-medium'>{curriculum.title}</p>
            <p className='mt-1 text-xs'>Courses: {curriculum.courseCount}</p>
          </div>
        )
      }
    },
    {
      accessorKey: 'teacherNameAndEmail',
      header: () => <p className='text-center'>Teacher</p>,
      cell: ({ row }) => {
        const teacher = row.original.teacher
        return (
          <div className='flex flex-col items-center'>
            <span className='font-medium'>{teacher.Name}</span>
            <span className='text-muted-foreground text-sm'>{teacher.Email}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        const startDate = row.original.startDate
        return <span>{formatDateV2(new Date(startDate))}</span>
      }
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const endDate = row.original.endDate
        return <span>{formatDateV2(new Date(endDate))}</span>
      }
    },
    createActionsColumnFromItems<Classroom>([
      {
        label: 'View Details',
        onClick: (classroom) => {
          console.log('View details of', classroom)
        }
      },
      {
        label: 'Edit Class',
        onClick: (classroom) => {
          console.log('Edit class', classroom)
        }
      },
      {
        label: 'Delete Class',
        onClick: (classroom) => {
          console.log('Delete class', classroom)
        }
      }
    ])
  ]
}
