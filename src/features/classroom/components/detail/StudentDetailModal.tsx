'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/shadcn/dialog'
import { Badge } from '@/components/shadcn/badge'
import { Card, CardContent } from '@/components/shadcn/card'
import { Separator } from '@/components/shadcn/separator'
import { Progress } from '@/components/shadcn/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { GraduationCap, BookOpen, FileCheck, ClipboardList, Mail } from 'lucide-react'
import { useGetClassroomStudentDetailQuery } from '../../api/classroomApi'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useTranslations } from 'next-intl'

type Props = {
  isOpen: boolean
  onClose: () => void
  studentId: string | null
  classroomId: number
}

export default function StudentDetailModal({ isOpen, onClose, studentId, classroomId }: Props) {
  const t = useTranslations('classroom.studentClassroom.detail')
  const { data, isLoading } = useGetClassroomStudentDetailQuery(
    { classroomId, studentId: studentId! },
    { skip: !studentId || !isOpen }
  )

  const student = data?.data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 hover:bg-green-600'
      case 'InProgress':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'Dropped':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const formatScore = (score: number) => Math.round(score * 100) / 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {isLoading || !student ? (
          <DetailSkeleton />
        ) : (
          <div className='flex flex-col gap-6 py-2'>
            <div className='flex items-start gap-4'>
              <Avatar className='h-16 w-16 border-2 border-white shadow-sm'>
                <AvatarImage src='' />
                <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white'>
                  {student.studentName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-bold text-gray-900'>{student.studentName}</h3>
                  <Badge className={`${getStatusColor(student.courseEnrollmentStatus)} text-white`}>
                    {student.courseEnrollmentStatus}
                  </Badge>
                </div>
                <div className='text-muted-foreground flex items-center text-sm'>
                  <Mail className='mr-2 h-3.5 w-3.5' />
                  {student.studentEmail}
                </div>
                <div className='text-muted-foreground w-fit rounded bg-slate-100 px-2 py-0.5 font-mono text-xs'>
                  ID: {student.studentId.split('-')[0]}...
                </div>
              </div>
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-4'>
              <Card className='border-slate-200 bg-slate-50 shadow-sm'>
                <CardContent className='flex flex-col gap-3 p-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-slate-600'>{t('quizScore')}</span>
                    <ClipboardList className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-slate-900'>
                      {formatScore(student.averageQuizScore)}
                      <span className='text-sm font-normal text-slate-400'>/100</span>
                    </div>
                    <Progress
                      value={student.averageQuizScore}
                      className='mt-2 h-2 bg-slate-200'
                      indicatorColor='bg-blue-600'
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className='border-slate-200 bg-slate-50 shadow-sm'>
                <CardContent className='flex flex-col gap-3 p-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-slate-600'>{t('asmScore')}</span>
                    <FileCheck className='h-4 w-4 text-indigo-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-slate-900'>
                      {formatScore(student.averageAssignmentScore)}
                      <span className='text-sm font-normal text-slate-400'>/100</span>
                    </div>
                    <Progress
                      value={student.averageAssignmentScore}
                      className='mt-2 h-2 bg-slate-200'
                      indicatorColor='bg-indigo-600'
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className='border-slate-200 shadow-sm'>
                <CardContent className='flex items-center gap-4 p-4'>
                  <div className='rounded-full bg-orange-100 p-2'>
                    <BookOpen className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm'>{t('quizTotal')}</p>
                    <p className='text-lg font-bold'>
                      {student.totalQuizzesTaken}{' '}
                      <span className='text-muted-foreground text-xs font-normal'>{t('submitted')}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-slate-200 shadow-sm'>
                <CardContent className='flex items-center gap-4 p-4'>
                  <div className='rounded-full bg-emerald-100 p-2'>
                    <GraduationCap className='h-5 w-5 text-emerald-600' />
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm'>{t('asmTotal')}</p>
                    <p className='text-lg font-bold'>
                      {student.totalAssignmentsSubmitted}{' '}
                      <span className='text-muted-foreground text-xs font-normal'>{t('submitted')}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Skeleton Loader Component
function DetailSkeleton() {
  return (
    <div className='flex flex-col gap-6 py-2'>
      <div className='flex items-center gap-4'>
        <Skeleton className='h-16 w-16 rounded-full' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-5 w-1/2' />
          <Skeleton className='h-4 w-1/3' />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
      </div>
    </div>
  )
}
