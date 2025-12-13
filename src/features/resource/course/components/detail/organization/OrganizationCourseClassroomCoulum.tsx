import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteClassroomMutation } from '@/features/classroom/api/classroomApi'
import { Classroom, ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDate, formatDateV2, useStatusTranslation } from '@/utils/index'
import { ColumnDef } from '@tanstack/react-table'
import { GraduationCap, Users } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useGetOrganizationCourseClassroomColumn(): ColumnDef<Classroom>[] {
  const tc = useTranslations('common')
  const translateStatus = useStatusTranslation()

  const router = useRouter()
  const locale = useLocale()
  const [deleteClassroom] = useDeleteClassroomMutation()

  return [
    {
      accessorKey: 'className',
      header: tc('tableHeader.className'),
      cell: ({ row }) => {
        return <span>{row.original.name}</span>
      }
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {}
    },

    {
      accessorKey: 'grade',
      header: tc('tableHeader.grade')
    },

    {
      accessorKey: 'teacherNameAndEmail',
      header: () => <p className='text-center'>{tc('tableHeader.teacher')}</p>,
      cell: ({ row }) => {
        const teacher = row.original.teacher
        return (
          <div className='flex flex-col items-center'>
            <span className='font-medium'>{teacher.name}</span>
            <span className='text-muted-foreground text-sm'>{teacher.email}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'numberOfStudents',
      header: tc('tableHeader.numberOfStudents'),
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
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        const status = row.original.status
        return <Badge className={`${getStatusBadgeClass(status)} font-medium`}>{translateStatus(status)}</Badge>
      }
    },
    {
      accessorKey: 'startDate',
      header: tc('tableHeader.startDate'),
      cell: ({ row }) => {
        return <span>{formatDate(row.original.startDate, { locale })}</span>
      }
    },
    {
      accessorKey: 'endDate',
      header: tc('tableHeader.endDate'),
      cell: ({ row }) => {
        return <span>{formatDate(row.original.endDate, { locale })}</span>
      }
    },
    createActionsColumnFromItems<Classroom>([
      {
        label: tc('button.view'),
        onClick: (classroom) => {
          console.log('View details of', classroom)
        }
      },
      {
        label: tc('button.update'),
        onClick: (classroom) => {
          console.log('Edit class', classroom)
        }
      },
      {
        label: tc('button.delete'),
        onClick: ({ original }) => {
          deleteClassroom(original.id)
          toast.success('Classroom deleted successfully')
        }
      }
    ])
  ]
}
