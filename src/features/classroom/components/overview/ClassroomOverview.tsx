'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Progress } from '@/components/shadcn/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { ChevronRight, Info, TrendingUp, Clock, CheckCircle2, BookOpenCheck, FileQuestion } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { StudentProgressStatistic } from '@/features/dashboard/components/table/StudentProgressStatistic'
import { useParams } from 'next/navigation'
import { useGetClassroomByIdQuery, useGetClassroomStatisticsQuery } from '../../api/classroomApi'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import Loading from 'app/[locale]/loading'
import { useTranslations } from 'next-intl'

export default function ClassroomOverview() {

  const t = useTranslations('dashboard.classroom')
  const tc = useTranslations('common')

  const params = useParams()
  const classroomId = Number(params.classroomId)

  const { data: classroomRes, isLoading: isLoadingClassroom } = useGetClassroomByIdQuery(classroomId, {
    skip: !classroomId
  })

  const classroom = classroomRes?.data
  const curriculumId = classroom?.curriculum?.id

  const { data: curriculumRes, isLoading: isLoadingCurriculum } = useGetCurriculumByIdQuery(curriculumId!, {
    skip: !curriculumId
  })

  const { data: statsRes, isLoading: isLoadingStats } = useGetClassroomStatisticsQuery(
    { classroomId },
    {
      skip: !classroomId
    }
  )

  const ungradedAssignments = statsRes?.data?.ungradedAssignments || []
  const courses = curriculumRes?.data?.courses || []

  const PassRate = statsRes?.data.quizStatistic.passRate || 0
  const NotPassRate = 100 - (statsRes?.data.quizStatistic.passRate || 0)

    const contentStatusData = [
    { name: t('passed'), value: PassRate, color: '#10b981' },
    { name: t('failed'), value: statsRes?.data.quizStatistic.submissions ? NotPassRate : 0, color: '#ef4444' },
  ]

  if (isLoadingClassroom || isLoadingCurriculum || isLoadingStats) {
    return (
      <Loading/>
    )
  }

  return (
    <div className='container mx-auto p-6 pb-8'>
      {/* Header Section */}
      <div className='mb-10'>
        <div className='mb-3 flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20'>
            <TrendingUp className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold text-transparent pb-2'>
              {t('overview.title')}
            </h1>
            <p className='mt-1 text-slate-600'>{t('overview.subTitle')}</p>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        {/* Learning Content */}
        <Card className='bg-gradient-to-br from-white to-purple-50/20 py-4 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100'>
                  <TrendingUp className='h-4 w-4 text-purple-600' />
                </div>
                {t('overview.quizStat')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-center gap-12 py-4'>
              <div className='relative'>
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={contentStatusData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey='value'
                    >
                      {contentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center'>
                    <p className='mb-1 text-xs font-medium text-slate-500'>{t('submission')}</p>
                    <p className='text-sky-500 bg-clip-text text-4xl font-bold'>
                      {statsRes?.data.quizStatistic.submissions || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className='space-y-3'>
                {contentStatusData.map((item) => (
                  <div key={item.name} className='flex items-center gap-3 text-sm'>
                    <div className='h-4 w-4 rounded-full shadow-sm' style={{ backgroundColor: item.color }} />
                    <span className='min-w-[90px] font-medium text-slate-600'>{item.name}</span>
                    <span className='ml-auto font-bold text-slate-700'>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className='py-4 bg-gradient-to-br from-white to-emerald-50/20 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100'>
                  <FileQuestion className='h-4 w-4 text-purple-600' />
                </div>
                {t('overview.asmStat')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='flex h-full min-h-[300px] flex-col items-center justify-center gap-6 p-8'>
            <div className='grid w-full grid-cols-2 gap-6'>
              <div className='rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20'>
                  <CheckCircle2 className='h-6 w-6 text-white' />
                </div>
                <p className='text-3xl font-bold text-emerald-700'>{statsRes?.data.assignmentStatistic.passRate}%</p>
                <p className='mt-2 text-sm text-slate-600'>{t('passRate')}</p>
              </div>
              <div className='rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20'>
                  <BookOpenCheck className='h-6 w-6 text-white' />
                </div>
                <p className='text-3xl font-bold text-blue-700'>{statsRes?.data.assignmentStatistic.submissions}</p>
                <p className='mt-2 text-sm text-slate-600'>{t('submission')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ungraded Assignment */}
      <Card className='border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 p-4'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-base font-semibold'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
                <Clock className='h-4 w-4 text-rose-600' />
              </div>
              {t('overview.ungraded.title')}
              <Badge variant='secondary' className='ml-2 border-0 bg-rose-100 text-rose-700'>
                {ungradedAssignments.length} {t('overview.ungraded.pending')}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-hidden rounded-xl border border-slate-200'>
            <Table>
              <TableHeader>
                <TableRow className='bg-slate-50 hover:bg-slate-50'>
                  <TableHead className='w-16 font-semibold text-slate-700'>{t('overview.ungraded.id')}</TableHead>
                  <TableHead className='font-semibold text-slate-700'>{t('overview.ungraded.asmTitle')}</TableHead>
                  <TableHead className='font-semibold text-slate-700'>{t('overview.ungraded.learner')}</TableHead>
                  <TableHead className='text-right font-semibold text-slate-700'>{t('overview.ungraded.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ungradedAssignments.length > 0 ? (
                  ungradedAssignments.map((assignment) => (
                    <TableRow key={assignment.studentAssignmentId} className='transition-colors hover:bg-slate-50'>
                      <TableCell className='font-semibold text-slate-600'>{assignment.studentAssignmentId}</TableCell>
                      <TableCell className='max-w-xs'>
                        <p className='truncate font-medium text-slate-700'>{assignment.assignmentTitle}</p>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Avatar className='h-8 w-8 border-2 border-white shadow-sm'>
                            <AvatarFallback className='bg-gradient-to-br from-indigo-100 to-purple-100 text-xs font-semibold text-indigo-700'>
                              {assignment.studentName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className='text-sm font-medium text-slate-700'>{assignment.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          size='sm'
                          className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
                        >
                          {tc('button.grade')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className='h-24 text-center text-slate-500'>
                      {t('overview.ungraded.noAsm')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StudentProgressStatistic classroomId={classroomId} courses={courses} />
    </div>
  )
}