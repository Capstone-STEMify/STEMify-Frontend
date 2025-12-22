'use client'

import * as React from 'react'
import { Download, CheckCircle2, Circle, Clock, Bot, AlertTriangle, Sparkles, BrainCircuit } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion'

import {
  useGetClassroomByIdQuery,
  useGetClassroomStudentProgressQuery,
  useAnalyzeClassroomProgressMutation
} from '@/features/classroom/api/classroomApi'
import {
  StudentProgressItem,
  AiStudentAnalysisResult,
  LessonStructure
} from '@/features/classroom/types/classroom.type'
import { useTranslations, useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import Loading from 'app/[locale]/loading'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { toast } from 'sonner'
import { truncateLabel, useStatusTranslation } from '@/utils/index'

interface CourseType {
  id: number
  title: string
}

interface StudentProgressStatisticProps {
  classroomId: number
  courses: CourseType[]
  courseId?: number
}

const COLUMN_WIDTH = 'w-[100px] min-w-[100px]'

type LessonDetailModalProps = {
  studentName: string
  lessonTitle: string
  sectionIds: number[]
  studentProgress: any
}

export function StudentProgressStatistic({ classroomId, courses, courseId }: StudentProgressStatisticProps) {
  const t = useTranslations('dashboard.classroom')
  const locale = useLocale()

  // const [selectedCourseId, setSelectedCourseId] = React.useState<string>('')

  const [aiData, setAiData] = React.useState<{
    overviewText: string
    aiInsightsText?: string
    students: AiStudentAnalysisResult[]
  } | null>(null)

  const [filterAtRisk, setFilterAtRisk] = React.useState(false)
  const [selectedAnalysisStudent, setSelectedAnalysisStudent] = React.useState<AiStudentAnalysisResult | null>(null)

  const [selectedLessonDetail, setSelectedLessonDetail] = React.useState<LessonDetailModalProps | null>(null)

  const { data: session } = useSession()
  const { data: classroomRes } = useGetClassroomByIdQuery(classroomId, {
    skip: !classroomId
  })
  const curriculum = classroomRes?.data?.course
  const organizationSubscriptionOrderId = classroomRes?.data?.organizationSubscriptionOrderId

  const statusTranslate = useStatusTranslation()

  const teacherId = React.useMemo(() => {
    if (!session?.user?.organizations || !organizationSubscriptionOrderId) {
      return undefined
    }
    const organizations = session.user.organizations.organizations || []
    for (const org of organizations) {
      if (org.roles && org.roles.length > 0) {
        const matchingRole = org.roles.find((role) => role.subscriptionId === organizationSubscriptionOrderId)
        if (matchingRole) {
          const orgUserId = (org as any).organizationUserId
          return Array.isArray(orgUserId) ? orgUserId[0] : orgUserId
        }
      }
    }
    return undefined
  }, [session?.user?.organizations, organizationSubscriptionOrderId])

  const [analyzeTrigger, { isLoading: isAnalyzing }] = useAnalyzeClassroomProgressMutation()

  // React.useEffect(() => {
  //   if (courses.length > 0 && !selectedCourseId) {
  //     setSelectedCourseId(String(courses[0].id))
  //   }
  // }, [courses, selectedCourseId])

  const { data: progressRes, isFetching } = useGetClassroomStudentProgressQuery(
    { classroomId, courseId: Number(courseId) },
    { skip: !classroomId || !courseId }
  )

  // Data progress
  const lessons = progressRes?.data?.lessons || []
  const students = progressRes?.data?.StudentProgress || []

  // const currentCourseTitle = courses.find((c) => String(c.id) === selectedCourseId)?.title || ''

  const handleAnalyzeClassroom = async () => {
    try {
      const response = await analyzeTrigger({
        teacher_id: teacherId,
        classroom_id: classroomId,
        force_mock: false,
        analysis_period_days: 7,
        lang: locale
      }).unwrap()

      const payload = response.data || response

      if (!payload || !payload.students) {
        toast.error(t('toast.errorResponse'))
        return
      }

      setAiData({
        overviewText: payload.overviewText || payload.aiInsightsText || '',
        aiInsightsText: payload.aiInsightsText,
        students: payload.students
      })

      const atRiskCount = payload.students.filter((s: any) => s.currentStatus === 'AtRisk').length
      if (atRiskCount > 0) {
        toast.success(t('toast.hasAtRisk'))
      } else {
        toast.info(t('toast.noHasAtRisk'))
      }
    } catch (error) {
      toast.error(t('toast.aiError'))
    }
  }

  // --- Helpers render status ---

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'Completed':
      case 'Passed':
        return <CheckCircle2 className='mx-auto h-5 w-5 text-green-500' />
      case 'InProgress':
        return <Clock className='mx-auto h-5 w-5 text-blue-500' />
      case 'Failed':
        return <Circle className='mx-auto h-5 w-5 border-red-400 text-red-400' />
      case 'Locked':
        return <Circle className='mx-auto h-5 w-5 rounded-full bg-slate-100 text-slate-300' />
      default:
        return <Circle className='mx-auto h-5 w-5 text-slate-200' />
    }
  }

  const displayedStudents = React.useMemo(() => {
    if (!aiData || !filterAtRisk) return students
    const aiAtRiskIds = aiData.students.filter((s) => s.currentStatus === 'AtRisk').map((s) => s.studentId)
    return students.filter((s) => aiAtRiskIds.includes(s.studentId))
  }, [students, filterAtRisk, aiData])

  const visibleAtRiskCount = React.useMemo(() => {
    if (!aiData) return 0
    const aiAtRiskIds = aiData.students.filter((s) => s.currentStatus === 'AtRisk').map((s) => s.studentId)
    return students.filter((s) => aiAtRiskIds.includes(s.studentId)).length
  }, [aiData, students])

  const handleLessonCellClick = (student: StudentProgressItem, lesson: LessonStructure) => {
    // Tìm progress của lesson này
    const lessonProgress = student.lessonProgresses?.find((l) => l.lessonId === lesson.lessonId)

    setSelectedLessonDetail({
      studentName: student.studentName,
      lessonTitle: lesson.lessonTitle,
      sectionIds: lesson.sectionIds,
      studentProgress: lessonProgress
    })
  }

  return (
    <div className='mt-8 rounded-xl border bg-white p-4 shadow-sm md:p-8'>
      <header className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-semibold'>{t('overview.progress.title')}</h2>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleAnalyzeClassroom}
                disabled={isAnalyzing}
                className={`gap-2 transition-all ${aiData ? 'border border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90'}`}
                variant={aiData ? 'outline' : 'default'}
              >
                {isAnalyzing ? (
                  <>
                    <Clock className='h-4 w-4 animate-spin' /> {t('overview.progress.analyzing')}
                  </>
                ) : (
                  <>
                    <Sparkles className='h-4 w-4' />{' '}
                    {aiData ? t('overview.progress.reAnalyzeAi') : t('overview.progress.askAiInsights')}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('overview.progress.aiAnalysisTimeNote')}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2 text-sm'>
            <Select value={curriculum?.code || ''} disabled>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder={curriculum?.title || t('overview.progress.curriculum')} />
              </SelectTrigger>
              <SelectContent>
                {curriculum && <SelectItem value={curriculum.code}>{curriculum.title}</SelectItem>}
              </SelectContent>
            </Select>
            {/* <div className="font-medium text-slate-700 bg-slate-100 px-3 py-2 rounded-md border text-sm">
                <span className="text-slate-500 mr-1">{t('overview.progress.course')}</span> 
                {currentCourseTitle}
            </div> */}
          </div>
          {/* <Button variant='outline' size='icon'>
            <Download className='h-4 w-4' />
          </Button> */}
        </div>
      </header>

      {aiData && (
        <Card className='animate-in fade-in slide-in-from-top-4 mb-6 border-purple-100 bg-slate-50/50 duration-500'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-lg text-purple-900'>
              <Bot className='h-5 w-5 text-purple-600' />
              {t('overview.progress.aiClassroomAssessment')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-6'>
              {/* Hiển thị overviewText nếu có */}
              {aiData.overviewText && (
                <div className='flex-1'>
                  <h3 className='mb-2 text-sm font-semibold text-slate-700'>
                    {t('overview.progress.overview') || 'Overview'}
                  </h3>
                  <div className='prose prose-sm prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-li:text-slate-700 max-w-none border-l-4 border-purple-300 pl-3 text-sm leading-relaxed text-slate-700'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiData.overviewText}</ReactMarkdown>
                  </div>
                </div>
              )}

              {aiData.aiInsightsText && aiData.aiInsightsText !== aiData.overviewText && (
                <div className='flex-1'>
                  <h3 className='mb-2 text-sm font-semibold text-slate-700'>
                    {t('overview.progress.aiInsights') || 'AI Insights'}
                  </h3>
                  <div className='prose prose-sm prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-li:text-slate-700 max-w-none border-l-4 border-blue-300 pl-3 text-sm leading-relaxed text-slate-700'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiData.aiInsightsText}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div className='item-center mb-5 flex min-w-[200px] flex-col gap-2 md:flex-row md:justify-end'>
                <Button
                  variant={filterAtRisk ? 'destructive' : 'outline'}
                  className={`group justify-between border-red-200 ${!filterAtRisk && 'text-red-600 hover:bg-red-50'}`}
                  onClick={() => setFilterAtRisk(!filterAtRisk)}
                >
                  <span className='flex items-center gap-2'>
                    <AlertTriangle className='h-4 w-4' />
                    {t('overview.progress.studentsAtRisk')}
                  </span>

                  <Badge variant={filterAtRisk ? null : 'destructive'} className='ml-2'>
                    {visibleAtRiskCount}
                  </Badge>
                </Button>
                {filterAtRisk && (
                  <p className='animate-pulse text-center text-xs text-slate-500'>
                    {t('overview.progress.showingStudents', { count: displayedStudents.length })}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- TABLE CONTENT --- */}
      {isFetching && lessons.length === 0 ? (
        <Loading />
      ) : lessons.length === 0 ? (
        <div className='rounded-lg border py-10 text-center text-slate-500'>{t('overview.progress.noLesson')}</div>
      ) : (
        <div className='overflow-hidden rounded-lg border bg-white'>
          <div className='overflow-x-auto'>
            <Table className='min-w-[900px]'>
              <TableHeader>
                <TableRow>
                  <TableHead className='bg-background sticky left-0 z-20 w-[250px] min-w-[250px] border-r align-top shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'>
                    <div className='flex flex-col gap-2 px-2 py-4'>
                      <label className='text-sm font-medium'>{t('overview.progress.sort')}</label>
                      <Select defaultValue='display-name'>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Sort by' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='display-name'>{t('overview.progress.disName')}</SelectItem>
                          <SelectItem value='first-name'>{t('overview.progress.firstName')}</SelectItem>
                          <SelectItem value='last-name'>{t('overview.progress.lastName')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>

                  {lessons.map((lesson, index) => (
                    <TableHead
                      key={lesson.lessonId}
                      className={`h-auto border-r bg-blue-500 text-center align-middle font-semibold text-white ${COLUMN_WIDTH}`}
                    >
                      <div className='flex flex-col items-center justify-center px-1 py-1'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='mb-1 text-xs text-white uppercase'>
                              {t('overview.progress.lessonHeader', { index: index + 1 })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{lesson.lessonTitle}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {displayedStudents.length > 0 ? (
                  displayedStudents.map((student) => {
                    const atRiskInfo = aiData?.students.find(
                      (s) => s.studentId === student.studentId && s.currentStatus === 'AtRisk'
                    )

                    return (
                      <TableRow
                        key={student.studentId}
                        className={`group hover:bg-slate-50/50 ${atRiskInfo ? 'bg-red-50/30' : ''}`}
                      >
                        {/* CỘT HỌC SINH (Sticky Left) */}
                        <TableCell
                          className={`bg-background sticky left-0 z-10 border-r group-hover:bg-slate-50 ${atRiskInfo ? 'bg-red-50/30' : ''}`}
                        >
                          <div className='flex items-center justify-between pr-2'>
                            <Accordion type='single' collapsible className='w-full'>
                              <AccordionItem value={student.studentId} className='border-b-0'>
                                <AccordionTrigger className='p-2 py-4 hover:no-underline'>
                                  <div className='flex flex-col items-start text-left'>
                                    <span className={`font-medium ${atRiskInfo ? 'text-red-700' : 'text-slate-700'}`}>
                                      {student.studentName}
                                    </span>
                                    {/* <span className='text-xs font-normal text-slate-400'>
                                      ID: {student.studentId.substring(0, 6)}...
                                    </span> */}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className='px-2 text-xs text-slate-500'>
                                    {t('overview.progress.detailsFor', { name: student.studentName })}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {atRiskInfo && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    className='animate-in zoom-in h-8 w-8 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700'
                                    onClick={() => setSelectedAnalysisStudent(atRiskInfo)}
                                  >
                                    <BrainCircuit className='h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('overview.progress.viewAiAnalysis')}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>

                        {/* CÁC CỘT LESSON (Clickable) */}
                        {lessons.map((lesson) => {
                          const lessonProgress = student.lessonProgresses?.find((l) => l.lessonId === lesson.lessonId)
                          return (
                            <TableCell
                              key={`${student.studentId}-${lesson.lessonId}`}
                              className={`h-[70px] cursor-pointer border-r p-2 text-center transition-colors hover:bg-slate-100 ${COLUMN_WIDTH}`}
                              onClick={() => handleLessonCellClick(student, lesson)}
                            >
                              {getStatusIcon(lessonProgress?.status)}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={lessons.length + 1} className='h-24 text-center text-slate-500'>
                      {filterAtRisk ? t('overview.progress.noStudentsRisk') : t('overview.progress.noStudentsEnrolled')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={!!selectedAnalysisStudent} onOpenChange={(open) => !open && setSelectedAnalysisStudent(null)}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-red-600'>
              <AlertTriangle className='h-5 w-5' />
              {t('overview.progress.riskAnalysis')}
            </DialogTitle>
          </DialogHeader>

          {selectedAnalysisStudent && (
            <div className='space-y-4 py-2'>
              <div className='flex items-center justify-between rounded-lg border bg-slate-50 p-3'>
                <span className='text-sm font-medium text-slate-500'>{t('overview.progress.riskSeverity')}</span>
                <Badge variant='destructive' className='bg-orange-500 hover:bg-orange-600'>
                  {selectedAnalysisStudent.currentStatus === 'AtRisk'
                    ? t('overview.progress.high')
                    : t('overview.progress.medium')}{' '}
                  {t('overview.progress.priority')}
                </Badge>
              </div>

              <div className='space-y-2'>
                <h4 className='flex items-center gap-2 text-sm font-semibold'>
                  <div className='h-2 w-2 rounded-full bg-red-400' />
                  {t('overview.progress.identifiedIssues')}
                </h4>
                <div className='prose prose-sm prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-900 prose-ul:text-slate-600 prose-li:text-slate-600 max-w-none rounded-md border border-red-100 bg-red-50 p-3 text-sm text-slate-600'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedAnalysisStudent.statusText}</ReactMarkdown>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='flex items-center gap-2 text-sm font-semibold'>
                  <div className='h-2 w-2 rounded-full bg-green-400' />
                  {t('overview.progress.recommendedAction')}
                </h4>
                <div className='prose prose-sm prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-900 prose-ul:text-slate-600 prose-li:text-slate-600 max-w-none rounded-md border border-green-100 bg-green-50 p-3 text-sm text-slate-600'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedAnalysisStudent.interventionText}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setSelectedAnalysisStudent(null)}>
              {t('overview.progress.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedLessonDetail} onOpenChange={(open) => !open && setSelectedLessonDetail(null)}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{t('overview.progress.lessonDetailTitle')}</DialogTitle>
            <DialogDescription>
              {selectedLessonDetail &&
                t('overview.progress.lessonDetailDesc', {
                  student: selectedLessonDetail.studentName,
                  lesson: selectedLessonDetail.lessonTitle
                })}
            </DialogDescription>
          </DialogHeader>

          <div className='grid grid-cols-1 gap-4 py-4'>
            <div className='max-h-[300px] space-y-3 overflow-y-auto pr-2'>
              {selectedLessonDetail?.sectionIds.map((sectionId, index) => {
                const sectionProg = selectedLessonDetail.studentProgress?.sectionProgresses?.find(
                  (sp: any) => sp.sectionId === sectionId
                )
                const status = sectionProg?.status || 'NotStarted'

                return (
                  <div key={sectionId} className='flex items-center justify-between rounded-lg border bg-slate-50 p-3'>
                    <span className='text-sm font-medium text-slate-700'>
                      {t('overview.progress.sectionItem', { index: index + 1 })}
                    </span>
                    <div className='flex items-center gap-2'>
                      {getStatusIcon(status)}
                      <span className='w-20 text-right text-xs font-medium text-slate-500'>
                        {statusTranslate(status)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='flex justify-end'>
            <Button variant='outline' onClick={() => setSelectedLessonDetail(null)}>
              {t('overview.progress.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
