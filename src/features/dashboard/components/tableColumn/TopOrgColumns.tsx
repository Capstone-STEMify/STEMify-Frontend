import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { useTranslations } from 'next-intl'
import { GraduationCap, Users, CreditCard } from 'lucide-react'
import { TopOrganization } from '../../types/systemDashboard.type'

export type TopOrganizationTableItem = TopOrganization & {
  id: number | string
}

export const useTopOrgColumns = (): ColumnDef<TopOrganizationTableItem>[] => {
  const t = useTranslations('dashboard.admin.tables.headers')

  return [
    {
      accessorKey: 'organizationName',
      header: t('orgName'),
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='font-semibold text-gray-900'>{row.original.organizationName}</span>
          <span className='text-xs text-muted-foreground'>ID: {row.original.organizationId}</span>
        </div>
      )
    },
    {
      accessorKey: 'totalStudents',
      header: t('students'),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Users className='h-4 w-4 text-blue-500' />
          <span className='font-medium'>{row.original.totalStudents}</span>
        </div>
      )
    },
    {
      accessorKey: 'totalEnrollments',
      header: t('enrollments'),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <GraduationCap className='h-4 w-4 text-orange-500' />
          <span className='font-medium'>{row.original.totalEnrollments}</span>
        </div>
      )
    },
    {
      accessorKey: 'passRate',
      header: t('passRate'),
      cell: ({ row }) => {
        const rate = row.original.passRate
        return (
          <Badge variant={rate >= 50 ? 'success' : 'destructive'} className='rounded-sm'>
            {rate}%
          </Badge>
        )
      }
    },
    {
      accessorKey: 'activeSubscriptions',
      header: t('activeSub'),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <CreditCard className='h-4 w-4 text-purple-500' />
          <span className='font-medium'>{row.original.activeSubscriptions}</span>
        </div>
      )
    }
  ]
}