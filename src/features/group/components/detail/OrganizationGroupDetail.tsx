'use client'
import { useGetGroupByIdQuery } from '@/features/group/api/groupApi'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { Skeleton } from '@/components/shadcn/skeleton'
import { ArrowLeft, Users, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Group, GroupStatus } from '@/features/group/types/group.type'
import { formatDate } from '@/utils/index'
import { useLocale, useTranslations } from 'next-intl'

export default function OrganizationGroupDetail() {
  const router = useRouter()
  const locale = useLocale()
  const { groupId } = useParams()

  const tc = useTranslations('common')
  const to = useTranslations('organization.group')

  const { data, isLoading, isError } = useGetGroupByIdQuery(Number(groupId), { skip: !groupId })

  const groupData: Group | undefined = data?.data

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-7xl px-4 py-8'>
        <Skeleton className='mb-6 h-10 w-32' />
        <Skeleton className='mb-6 h-64 w-full' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (isError || !groupData) {
    return (
      <div className='container mx-auto max-w-7xl px-4 py-8'>
        <Card className='border-destructive'>
          <CardHeader>
            <CardTitle className='text-destructive'>Lỗi</CardTitle>
            <CardDescription>Không thể tải thông tin nhóm</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeStudents = groupData.students.filter((s) => s.isActive).length
  const totalStudents = groupData.students.length

  return (
    <div className='container mx-auto max-w-7xl px-4 pt-3'>
      {/* Header */}
      <div>
        <Button onClick={() => router.back()} variant='ghost' className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Quay lại
        </Button>
      </div>

      {/* Group Info Card */}
      <Card className='mb-6 py-4'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='mb-2 text-3xl'>{groupData.name}</CardTitle>
              <CardDescription className='text-base'>
                {to('groupCode')} <span className='font-mono'>{groupData.code}</span>
              </CardDescription>
            </div>
            <Badge
              variant={groupData.status === GroupStatus.ACTIVE ? 'default' : 'secondary'}
              className='px-3 py-1 text-sm'
            >
              {groupData.status === GroupStatus.ACTIVE ? tc('status.active') : tc('status.inactive')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='flex items-center gap-3'>
              <Users className='text-muted-foreground h-5 w-5' />
              <div>
                <p className='text-muted-foreground text-sm'>{to('totalStudents')}</p>
                <p className='text-xl font-semibold'>{totalStudents}</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              <div>
                <p className='text-muted-foreground text-sm'>{tc('status.active')}</p>
                <p className='text-xl font-semibold text-green-600'>{activeStudents}</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Calendar className='text-muted-foreground h-5 w-5' />
              <div>
                <p className='text-muted-foreground text-sm'>{to('createdDate')}</p>
                <p className='text-sm font-medium'>{formatDate(groupData.createdAt, { locale })}</p>
              </div>
            </div>
          </div>
          <hr className='my-3' />

          <div>
            <h2 className='my-3 text-lg font-semibold'>{to('groupList')}</h2>
          </div>

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
            {groupData.students.map((student) => (
              <div
                key={student.organizationUserId}
                className='hover:bg-accent/50 flex items-center justify-between rounded-lg border p-4 transition-colors'
              >
                <div className='flex items-center gap-4'>
                  <Avatar className='h-12 w-12'>
                    <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                      {getInitials(student.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className='text-lg font-semibold'>{student.fullName}</h4>
                    <p className='text-muted-foreground text-sm'>{student.email}</p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      Tham gia: {formatDate(student.joinedAt, { locale })}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  {student.isActive ? (
                    <Badge variant='default' className='gap-1'>
                      <CheckCircle2 className='h-3 w-3' />
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge variant='secondary' className='gap-1'>
                      <XCircle className='h-3 w-3' />
                      Không hoạt động
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
