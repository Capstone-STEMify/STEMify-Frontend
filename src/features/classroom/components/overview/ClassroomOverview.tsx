'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { TrendingUp, Clock, BarChart3 } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { StudentProgressStatistic } from '@/features/dashboard/components/table/StudentProgressStatistic'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import GradeAssignmentModal from '@/features/assignment/components/detail/dialog/GradeAssignmentModal'
import { useGetClassroomByIdQuery, useGetClassroomStatisticsQuery } from '../../api/classroomApi'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import Loading from 'app/[locale]/loading'
import { useTranslations } from 'next-intl'

// ChartJS Imports
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement } from 'chart.js'
import { Bar, Chart } from 'react-chartjs-2'
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BoxPlotController, BoxAndWiskers, BarElement)

export default function ClassroomOverview() {
  const t = useTranslations('dashboard.classroom')
  const tc = useTranslations('common')

  const params = useParams()
  const classroomId = Number(params.classroomId)

  const { data: classroomRes, isLoading: isLoadingClassroom } = useGetClassroomByIdQuery(classroomId, {
    skip: !classroomId
  })

  const classroom = classroomRes?.data
  const courseId = classroom?.course?.id

  const { data: courseRes, isLoading: isLoadingCourse } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId
  })

  const {
    data: statsRes,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useGetClassroomStatisticsQuery(
    { classroomId },
    {
      skip: !classroomId
    }
  )

  const [selectedStudentAssignmentId, setSelectedStudentAssignmentId] = useState<number | null>(null)

  const ungradedAssignments = statsRes?.data?.ungradedAssignments || []
  const lessons = courseRes?.data?.lessons || []
  const courseStats = statsRes?.data?.courseStats

  // --- Data Processing for Pie Charts ---
  const quizPassRate = statsRes?.data.quizStatistic.passRate || 0
  const quizNotPassRate = 100 - quizPassRate
  const quizSubmissions = statsRes?.data.quizStatistic.submissions || 0

  const asmPassRate = statsRes?.data.assignmentStatistic.passRate || 0
  const asmNotPassRate = 100 - asmPassRate
  const asmSubmissions = statsRes?.data.assignmentStatistic.submissions || 0

  const quizStatusData = [
    { name: t('passed'), value: quizPassRate, color: '#10b981' },
    { name: t('failed'), value: quizSubmissions ? quizNotPassRate : 0, color: '#F4320B' }
  ]

  const asmStatusData = [
    { name: t('passed'), value: asmPassRate, color: '#3b82f6' },
    { name: t('failed'), value: asmSubmissions ? asmNotPassRate : 0, color: '#F4320B' }
  ]

  // ---Data Processing for Histogram
  const histogramDataRaw = statsRes?.data?.courseStats?.studentScoreHistogram
  const bins = histogramDataRaw?.bins || []

  const histogramChartData = {
    labels: bins.map((bin) => `${bin.rangeStart}-${bin.rangeEnd}`),
    datasets: [
      {
        label: t('overview.histogram.number'),
        data: bins.map((bin) => bin.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.9,
        categoryPercentage: 0.9
      }
    ]
  }

  const histogramOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: t('overview.histogram.scoreDistribution'),
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          title: (context: any) => `${t('overview.histogram.scoreRange')}: ${context[0].label}`,
          label: (context: any) => `${t('overview.histogram.studentCount')}: ${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        title: {
          display: true,
          text: t('overview.histogram.studentCount')
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: t('overview.histogram.scoreRange')
        },
        grid: {
          display: false
        }
      }
    }
  }

  // --- Data Processing for Box Plot ---
  const boxPlotData = {
    labels: courseStats?.name,
    datasets: [
      // {
      //   label: 'Quiz Scores',
      //   backgroundColor: 'rgba(16, 185, 129, 0.5)',
      //   borderColor: '#10b981',
      //   borderWidth: 1,
      //   outlierColor: '#999999',
      //   padding: 10,
      //   itemRadius: 2,
      //   data: courseStats.map((c) => ({
      //     min: c.quizStats.min,
      //     q1: c.quizStats.q1,
      //     median: c.quizStats.median,
      //     q3: c.quizStats.q3,
      //     max: c.quizStats.max,
      //     outliers: c.quizStats.outliers
      //   }))
      // },
      // {
      //   label: 'Assignment Scores',
      //   backgroundColor: 'rgba(59, 130, 246, 0.5)',
      //   borderColor: '#3b82f6',
      //   borderWidth: 1,
      //   outlierColor: '#999999',
      //   padding: 10,
      //   itemRadius: 2,
      //   data: courseStats.map((c) => ({
      //     min: c.assignmentStats.min,
      //     q1: c.assignmentStats.q1,
      //     median: c.assignmentStats.median,
      //     q3: c.assignmentStats.q3,
      //     max: c.assignmentStats.max,
      //     outliers: c.assignmentStats.outliers
      //   }))
      // }
    ]
  }

  const boxPlotOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: false,
        text: 'Course Score Distribution'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            // Custom tooltip formatting if needed for boxplot
            const v = context.raw
            return `${context.dataset.label}: Min: ${v.min}, Q1: ${v.q1}, Med: ${v.median}, Q3: ${v.q3}, Max: ${v.max}`
          }
        }
      }
    }
  }

  if (isLoadingClassroom || isLoadingCourse || isLoadingStats) {
    return <Loading />
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
            <h1 className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text pb-2 text-4xl font-bold text-transparent'>
              {t('overview.title')}
            </h1>
            <p className='mt-1 text-slate-600'>{t('overview.subTitle')}</p>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        {/* Performance Overview (Double Pie Chart) */}
        <Card className='bg-gradient-to-br from-white to-purple-50/20 py-4 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100'>
                  <TrendingUp className='h-4 w-4 text-purple-600' />
                </div>
                {t('overview.performance')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              {/* Quiz Pie */}
              <div className='flex flex-col items-center justify-center'>
                <div className='relative h-[180px] w-[180px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={quizStatusData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey='value'
                      >
                        {quizStatusData.map((entry, index) => (
                          <Cell key={`cell-quiz-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='mb-1 text-xs font-medium text-slate-500'>{t('submission')}</p>
                      <p className='bg-clip-text text-3xl font-bold text-emerald-500'>{quizSubmissions}</p>
                    </div>
                  </div>
                </div>
                <p className='mt-2 text-sm font-medium text-slate-600'>{t('overview.quizStat')}</p>
              </div>

              {/* Assignment Pie */}
              <div className='flex flex-col items-center justify-center'>
                <div className='relative h-[180px] w-[180px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={asmStatusData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey='value'
                      >
                        {asmStatusData.map((entry, index) => (
                          <Cell key={`cell-asm-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='mb-1 text-xs font-medium text-slate-500'>{t('submission')}</p>
                      <p className='bg-clip-text text-3xl font-bold text-blue-500'>{asmSubmissions}</p>
                    </div>
                  </div>
                </div>
                <p className='mt-2 text-sm font-medium text-slate-600'>{t('overview.asmStat')}</p>
              </div>
            </div>

            {/* Legend/Summary */}
            <div className='mt-6 flex justify-center gap-6 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                <span className='text-slate-600'>{t('overview.legendSummary.quizPass')}</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-blue-500'></div>
                <span className='text-slate-600'>{t('overview.legendSummary.asmPass')}</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-red-500'></div>
                <span className='text-slate-600'>{t('overview.legendSummary.notPass')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Statistics (Box Plot) */}
        <Card className='bg-gradient-to-br from-white to-blue-50/20 py-4 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                  <BarChart3 className='h-4 w-4 text-blue-600' />
                </div>
                {t('overview.histogram.title')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='flex h-[350px] flex-col items-center justify-center p-4'>
            {/* TODO: Temporarily comment */}
            {/* <Chart type='boxplot' data={boxPlotData} options={boxPlotOptions} /> */}
            <Bar data={histogramChartData} options={histogramOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Ungraded Assignment */}
      <Card className='border-0 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-lg shadow-slate-200/50'>
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
                  <TableHead className='text-right font-semibold text-slate-700'>
                    {t('overview.ungraded.action')}
                  </TableHead>
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
                          onClick={() => setSelectedStudentAssignmentId(assignment.studentAssignmentId)}
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

      {/* <StudentProgressStatistic classroomId={classroomId} courses={lessons} /> */}

      <Dialog
        open={!!selectedStudentAssignmentId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedStudentAssignmentId(null)
        }}
      >
        <DialogTitle />
        <DialogContent className='w-[95%] rounded-xl p-4 sm:max-w-4xl'>
          {selectedStudentAssignmentId && (
            <GradeAssignmentModal
              studentAssignmentId={selectedStudentAssignmentId}
              onClose={() => setSelectedStudentAssignmentId(null)}
              onSuccess={() => {
                refetchStats?.()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
