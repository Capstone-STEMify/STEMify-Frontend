'use client'
import { useLocale, useTranslations } from 'next-intl'
import {
  useAddStudentToGroupMutation,
  useGetGroupByIdQuery,
  useRemoveStudentFromGroupMutation
} from '@/features/group/api/groupApi'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetGroupColumn } from '@/features/group/components/detail/GroupColumn'
import { useMemo, useState } from 'react'
import BackButton from '@/components/shared/button/BackButton'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Users, Calendar, Hash, Copy } from 'lucide-react'
import { formatDate, useOrgUserStatusTranslation } from '@/utils/index'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'

export default function OrganizationGroupTable() {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])

  const { openModal } = useModal()
  const { groupId } = useParams()
  const locale = useLocale()
  const to = useTranslations('organization.group')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const columns = useGetGroupColumn()
  const orgUserStatusTranslation = useOrgUserStatusTranslation()
  const { data, isLoading } = useGetGroupByIdQuery(Number(groupId), { skip: !groupId })
  const [deleteStudents] = useRemoveStudentFromGroupMutation()

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

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(tt('successMessage.copiedToClipboard'))
  }

  const handleRemoveStudents = () => {
    deleteStudents({ groupId: Number(groupId), studentIds: selectedStudentIds })
    setSelectedStudentIds([])
  }

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
              className={
                groupData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }
            >
              {orgUserStatusTranslation(groupData.status)}
            </Badge>
          </div>
          <p className='mt-1 text-sm text-gray-600'>{to('subTitle')}</p>
        </div>
      </div>
      {/* Group Information Cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {/* Large Card: Statistics - Spans 1 column */}
        <Card className='py-4 lg:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{to('totalStudents')}</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='mb-4 text-3xl font-bold'>{stats.total}</div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between rounded-md border border-green-100 bg-green-50 p-2'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                  <span className='text-xs font-medium text-green-900'>{orgUserStatusTranslation('active')}</span>
                </div>
                <span className='text-sm font-bold text-green-700'>{stats.active}</span>
              </div>
              <div className='flex items-center justify-between rounded-md border border-yellow-100 bg-yellow-50 p-2'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-yellow-500' />
                  <span className='text-xs font-medium text-yellow-700'>{orgUserStatusTranslation('inactive')}</span>
                </div>
                <span className='text-sm font-bold text-yellow-700'>{stats.inactive}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Stacked Cards - Spans 2 columns */}
        <div className='space-y-4 lg:col-span-2'>
          <Card className='py-4'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{to('groupCode')}</CardTitle>
              <Hash className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='flex font-mono text-lg font-semibold'>
                <p>{groupData.code}</p>
                <button onClick={() => handleCopyToClipboard(groupData.code)} className='ml-2 rounded-md'>
                  <Copy className='h-4 w-4' />
                </button>
              </div>
            </CardContent>
          </Card>

          <div className='grid grid-cols-2 gap-4'>
            <Card className='py-4'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{to('createdDate')}</CardTitle>
                <Calendar className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-sm font-medium'>{formatDate(groupData.createdAt, { locale })}</div>
              </CardContent>
            </Card>

            <Card className='py-4'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{to('updatedAt')}</CardTitle>
                <Calendar className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-sm font-medium'>{formatDate(groupData.updatedAt)}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className='mb-4 flex justify-end gap-2'>
        {selectedStudentIds.length > 0 && (
          <Button variant={'destructive'} onClick={handleRemoveStudents}>
            {tc('button.removeStudents', { student: selectedStudentIds.length })}
          </Button>
        )}

        <Button onClick={() => openModal('addStudentToGroup')}>{tc('button.addStudents')}</Button>
      </div>
      <DataTable
        data={rows}
        columns={columns as any}
        enableRowSelection
        onSelectionChange={(ids) => setSelectedStudentIds(ids.map(String))}
      />
    </div>
  )
}
