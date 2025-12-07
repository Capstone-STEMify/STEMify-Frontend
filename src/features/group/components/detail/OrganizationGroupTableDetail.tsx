'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useGetGroupByIdQuery } from '@/features/group/api/groupApi'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetGroupColumn } from '@/features/group/components/detail/GroupColumn'
import { useMemo } from 'react'
import BackButton from '@/components/shared/button/BackButton'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Users, Calendar, Hash, Activity } from 'lucide-react'
import { formatDate } from '@/utils/index'

export default function OrganizationGroupTable() {
  const { groupId } = useParams()
  const to = useTranslations('organization.group')
  const tc = useTranslations('common')
  const columns = useGetGroupColumn()
  const { data, isLoading } = useGetGroupByIdQuery(Number(groupId), { skip: !groupId })

  const groupData = data?.data

  const rows = useMemo(
    () => groupData?.students?.map((student) => ({ ...student, id: student.organizationUserId })) ?? [],
    [groupData]
  )

  const stats = useMemo(() => {
    if (!groupData?.students) return { total: 0, active: 0, inactive: 0 }

    const total = groupData.students.length
    const active = groupData.students.filter((s) => s.isActive).length
    const inactive = total - active

    return { total, active, inactive }
  }, [groupData])

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-7xl px-4 pt-3'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-lg'>{tc('loading')}</div>
        </div>
      </div>
    )
  }

  if (!groupData) {
    return (
      <div className='container mx-auto max-w-7xl px-4 pt-3'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-lg text-gray-500'>{tc('noData')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto max-w-7xl px-4 pt-3 pb-8'>
      {/* Header Section */}
      <div className='mb-6 flex flex-wrap items-center gap-3'>
        <BackButton />
        <div className='flex-1'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-bold'>{groupData.name}</h1>
            <Badge
              className={groupData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            >
              {groupData.status}
            </Badge>
          </div>
          <p className='mt-1 text-sm text-gray-600'>{to('subTitle')}</p>
        </div>
      </div>

      {/* Group Information Cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{to('totalStudents')}</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {stats.active} {tc('status.active')} • {stats.inactive} {tc('status.inactive')}
            </p>
          </CardContent>
        </Card>

        <Card className='py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{to('groupCode')}</CardTitle>
            <Hash className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='font-mono text-lg font-semibold'>{groupData.code}</div>
          </CardContent>
        </Card>

        <Card className='py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{to('createdDate')}</CardTitle>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-sm font-medium'>{formatDate(groupData.createdAt)}</div>
          </CardContent>
        </Card>

        <Card className='py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{to('updatedAt')}</CardTitle>
            <Activity className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-sm font-medium'>{formatDate(groupData.updatedAt)}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable data={rows} columns={columns as any} />
    </div>
  )
}
