import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { Users, School } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TopCourse } from '../../types/systemDashboard.type'

export type TopCourseTableItem = TopCourse & {
  id: number | string
}

export const useTopCourseColumns = (): ColumnDef<TopCourseTableItem>[] => {
  const t = useTranslations('dashboard.admin.tables.headers')

  return [
    {
      accessorKey: 'courseName',
      header: t('courseName'),
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='font-semibold text-gray-900 line-clamp-1' title={row.original.courseName}>
            {row.original.courseName}
          </span>
          <span className='text-xs text-muted-foreground'>
            {row.original.courseCode}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'totalEnrollments',
      header: t('enrollments'),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Users className='h-4 w-4 text-blue-500' />
          <span className='font-medium'>{row.original.totalEnrollments}</span>
        </div>
      )
    },
    {
      accessorKey: 'totalClassrooms',
      header: t('classrooms'),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <School className='h-4 w-4 text-indigo-500' />
          <span className='font-medium'>{row.original.totalClassrooms}</span>
        </div>
      )
    },
    {
      accessorKey: 'averageScore',
      header: t('avgScore'),
      cell: ({ row }) => (
        <div className='font-medium text-gray-700'>
          {row.original.averageScore.toFixed(1)}
        </div>
      )
    },
    {
      accessorKey: 'completionRate',
      header: t('completion'),
      cell: ({ row }) => {
        const rate = row.original.completionRate
        return (
          <div className='flex items-center gap-2'>
            <Badge variant={rate >= 70 ? 'success' : 'secondary'} className='whitespace-nowrap rounded-sm'>
              {rate}%
            </Badge>
          </div>
        )
      }
    }
  ]
}