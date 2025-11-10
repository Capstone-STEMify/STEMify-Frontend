import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteClassroomMutation } from '@/features/classroom/api/classroomApi'
import { Classroom, ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDateV2 } from '@/utils/index'
import { ColumnDef } from '@tanstack/react-table'
import { GraduationCap, Users } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useGetClassroomColumn(): ColumnDef<Classroom>[] {
  const router = useRouter()
  const locale = useLocale()
  const [deleteClassroom] = useDeleteClassroomMutation()

  return [
    createSelectColumn<Classroom>(),
    {
      accessorKey: 'curriculum',
      header: 'Curriculum',
      cell: ({ row }) => {
        const curriculum = row.original.curriculum
        const classroomId = row.original.id
        return (
          <div className='flex items-center gap-3 py-4'>
            {curriculum.imageUrl ? (
              <img
                src={curriculum.imageUrl}
                alt={curriculum.title}
                className='h-12 w-12 flex-shrink-0 rounded object-cover'
              />
            ) : (
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gradient-to-br from-sky-50 to-sky-400'>
                <GraduationCap width={16} height={16} className='text-blue-500' />
              </div>
            )}
            <div className='flex flex-col'>
              <p
                className='cursor-pointer font-medium hover:underline'
                onClick={() => {
                  router.push(`/${locale}/organization/classroom/${classroomId}`)
                }}
              >
                {curriculum.title}
              </p>
              <p className='mt-1 text-xs text-gray-600'>Number of courses: {curriculum.courseCount}</p>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'classCode',
      header: 'Class Code'
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {}
    },

    {
      accessorKey: 'grade',
      header: 'Grade'
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
      accessorKey: 'numberOfStudents',
      header: 'No. Students',
      cell: ({ row }) => {
        const numberOfStudents = row.original.numberOfStudents

        // Nếu không có học viên, hiển thị dấu gạch ngang
        if (numberOfStudents === 0) {
          return (
            <div className='flex items-center justify-center gap-1 text-gray-500'>
              <Users width={16} height={16} /> <span className='text-gray-800'>0</span>
            </div>
          )
        }

        return (
          <div className='flex -space-x-2'>
            {/* Hiển thị tối đa 3 avatar mặc định */}
            {[...Array(Math.min(3, numberOfStudents))].map((_, index) => (
              <Avatar key={index} className='h-8 w-8 border-2 border-white'>
                <AvatarImage src='/placeholder.svg' alt='Student' />
                <AvatarFallback className='bg-gradient-to-br from-sky-400 to-sky-600 text-xs text-white'>
                  S{index + 1}
                </AvatarFallback>
              </Avatar>
            ))}

            {/* Hiển thị +số nếu có hơn 3 học viên */}
            {numberOfStudents > 3 && (
              <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-semibold text-gray-700'>
                +{numberOfStudents - 3}
              </div>
            )}
          </div>
        )
      }
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
        onClick: ({ original }) => {
          deleteClassroom(original.id)
          toast.success('Classroom deleted successfully')
        }
      }
    ])
  ]
}
