'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Progress } from '@/components/shadcn/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { ChevronRight, Info, TrendingUp, BookOpen, Award, Clock, CheckCircle2 } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'
import { StudentProgressStatistic } from '@/features/dashboard/components/table/StudentProgressStatistic'
import { useParams } from 'next/navigation'
import { useGetClassroomByIdQuery } from '../../api/classroomApi'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'

export default function ClassroomOverview() {
  const contentStatusData = [
    { name: 'Passed', value: 84, color: '#10b981' },
    { name: 'Failed', value: 6, color: '#ef4444' },
    { name: 'Overdue', value: 5, color: '#f59e0b' },
    { name: 'In Progress', value: 3, color: '#3b82f6' },
    { name: 'Not Started', value: 2, color: '#6b7280' }
  ]

  const trendData = [{ value: 12 }, { value: 14 }, { value: 13 }, { value: 15 }, { value: 16 }]

  const topLearners = [
    { rank: 1, name: 'Mon Bagstion', role: 'Jr UI/UX Designer', points: 100, avatar: '' },
    { rank: 2, name: 'Fauzon Ardhionsy', role: 'Jr UI/UX Designer', points: 80, avatar: '' },
    { rank: 3, name: 'Friza Dipo', role: 'Jr Animation', points: 75, avatar: '' }
  ]

  const ungradedQuizzes = [
    {
      id: 1,
      title: 'How to be great and good UI/UX designer',
      questions: '6 open ended',
      learner: 'Adit Irwan',
      avatar: ''
    },
    {
      id: 2,
      title: 'Applications, tools, and plugins to make yo...',
      questions: '10 open ended',
      learner: 'Arif Brata',
      avatar: ''
    },
    {
      id: 3,
      title: 'Great designer must know the best for clie...',
      questions: '3 open ended',
      learner: 'Andhi Irwandi',
      avatar: ''
    }
  ]

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

  const courses = curriculumRes?.data?.courses || []

  return (
    <div className='container mx-auto px-6 pb-8'>
      {/* Header Section */}
      <div className='mb-10'>
        <div className='mb-3 flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20'>
            <TrendingUp className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold text-transparent'>
              Dashboard Overview
            </h1>
            <p className='mt-1 text-slate-600'>Track learning progress and quiz performance</p>
          </div>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Most Issued Content */}
        <Card className='bg-gradient-to-br from-white to-slate-50/50 py-4 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100'>
                  <BookOpen className='h-4 w-4 text-orange-600' />
                </div>
                Most issued content
              </CardTitle>
              <Badge variant='secondary' className='border-0 bg-slate-100 text-xs text-slate-600'>
                This week
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-5'>
              <div className='flex items-start gap-3 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 p-3'>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-md'>
                  <BookOpen className='h-5 w-5 text-white' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold text-slate-700'>How to be great UI/UX desig...</p>
                  <p className='mt-1 flex items-center gap-1 text-xs font-medium text-red-600'>
                    <span>🔥</span> 48 issues last week
                  </p>
                </div>
              </div>
              <div className='flex items-end justify-between'>
                <div>
                  <p className='bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-4xl font-bold text-transparent'>
                    16
                  </p>
                  <p className='mt-1 text-sm text-slate-500'>Issues this week</p>
                </div>
                <div className='h-16 w-28 rounded-lg bg-gradient-to-br from-orange-50 to-transparent p-2'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={trendData}>
                      <Line type='monotone' dataKey='value' stroke='#ea580c' strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              className='mt-5 w-full text-sm font-medium text-orange-600 hover:bg-orange-50 hover:text-orange-700'
              size='sm'
            >
              See all issued contents
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card className='bg-gradient-to-br from-white to-blue-50/30 py-4 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-base font-semibold'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                <CheckCircle2 className='h-4 w-4 text-blue-600' />
              </div>
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-5'>
              <div className='rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4'>
                <div className='mb-3 flex items-end gap-3'>
                  <p className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent'>
                    80
                  </p>
                  <p className='mb-2 text-sm font-medium text-slate-600'>submitted</p>
                  <p className='mb-2 ml-auto text-sm text-slate-500'>100 remaining</p>
                </div>
                <div className='relative'>
                  <Progress value={44} className='h-3 bg-slate-200' />
                  <div
                    className='absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500'
                    style={{ width: '44%' }}
                  />
                </div>
                <p className='mt-2 text-xs font-medium text-slate-600'>40 Assignment in total</p>
              </div>
              <div className='pt-2'>
                <Button
                  variant='ghost'
                  className='w-full justify-between font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                >
                  <div className='flex items-center gap-2'>
                    <BookOpen className='h-4 w-4' />
                    <span className='text-sm'>See all assignment</span>
                  </div>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Learner */}
        <Card className='bg-gradient-to-br from-white to-amber-50/30 py-4 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-base font-semibold'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100'>
                <Award className='h-4 w-4 text-amber-600' />
              </div>
              Top Learner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {topLearners.map((learner) => (
                <div
                  key={learner.rank}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:scale-[1.02] ${
                    learner.rank === 1
                      ? 'border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      learner.rank === 1
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md'
                        : learner.rank === 2
                          ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                          : 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                    }`}
                  >
                    #{learner.rank}
                  </div>
                  <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                    <AvatarImage src={learner.avatar} />
                    <AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-semibold text-blue-700'>
                      {learner.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-700'>{learner.name}</p>
                    <p className='text-xs text-slate-500'>{learner.role}</p>
                  </div>
                  <Badge
                    variant='secondary'
                    className={`gap-1 border-0 font-semibold ${
                      learner.rank === 1
                        ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className='text-yellow-500'>★</span>
                    {learner.points}pts
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant='link'
              className='mt-5 w-full text-sm font-medium text-amber-600 hover:text-amber-700'
              size='sm'
            >
              View all learners
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </CardContent>
        </Card>
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
                Learning Content
              </CardTitle>
              <Button
                variant='ghost'
                size='sm'
                className='text-xs text-purple-600 hover:bg-purple-50 hover:text-purple-700'
              >
                By status
                <ChevronRight className='ml-1 h-4 w-4' />
              </Button>
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
                    <p className='mb-1 text-xs font-medium text-slate-500'>Total Contents</p>
                    <p className='bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent'>
                      140
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
        <Card className='bg-gradient-to-br from-white to-emerald-50/20 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl'>
          <CardContent className='flex h-full min-h-[300px] flex-col items-center justify-center gap-6 p-8'>
            <div className='grid w-full grid-cols-2 gap-6'>
              <div className='rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20'>
                  <CheckCircle2 className='h-6 w-6 text-white' />
                </div>
                <p className='text-3xl font-bold text-emerald-700'>94%</p>
                <p className='mt-2 text-sm text-slate-600'>Completion Rate</p>
              </div>
              <div className='rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20'>
                  <Clock className='h-6 w-6 text-white' />
                </div>
                <p className='text-3xl font-bold text-blue-700'>24h</p>
                <p className='mt-2 text-sm text-slate-600'>Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ungraded Quiz */}
      <Card className='border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-base font-semibold'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
                <Clock className='h-4 w-4 text-rose-600' />
              </div>
              Ungraded Quiz
              <Badge variant='secondary' className='ml-2 border-0 bg-rose-100 text-rose-700'>
                {ungradedQuizzes.length} pending
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-hidden rounded-xl border border-slate-200'>
            <Table>
              <TableHeader>
                <TableRow className='bg-slate-50 hover:bg-slate-50'>
                  <TableHead className='w-16 font-semibold text-slate-700'>#</TableHead>
                  <TableHead className='font-semibold text-slate-700'>Quiz title</TableHead>
                  <TableHead className='font-semibold text-slate-700'>Questions</TableHead>
                  <TableHead className='font-semibold text-slate-700'>Learner</TableHead>
                  <TableHead className='text-right font-semibold text-slate-700'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ungradedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id} className='transition-colors hover:bg-slate-50'>
                    <TableCell className='font-semibold text-slate-600'>{quiz.id}</TableCell>
                    <TableCell className='max-w-xs'>
                      <p className='truncate font-medium text-slate-700'>{quiz.title}</p>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2 text-slate-600'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50'>
                          <BookOpen className='h-4 w-4 text-blue-600' />
                        </div>
                        <span className='text-sm font-medium'>{quiz.questions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-8 w-8 border-2 border-white shadow-sm'>
                          <AvatarImage src={quiz.avatar} />
                          <AvatarFallback className='bg-gradient-to-br from-indigo-100 to-purple-100 text-xs font-semibold text-indigo-700'>
                            {quiz.learner
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-sm font-medium text-slate-700'>{quiz.learner}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        size='sm'
                        className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
                      >
                        Grade Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StudentProgressStatistic classroomId={classroomId} courses={courses} />
    </div>
  )
}
