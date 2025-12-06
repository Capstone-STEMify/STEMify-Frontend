'use client'
import React, { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { CheckCircle, Clock, ExternalLink, FileText, Loader2, RotateCcw, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useGetStudentAssignmentByIdQuery } from '@/features/assignment/api/studentAssignmentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useGetAssignmentByIdQuery } from '../../api/assignmentApi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/shadcn/dialog'
import { StudentAssignmentDetail, StudentAssignmentStatus } from '../../types/assigmentlistdetail.type'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setSelectedAssignment, setSelectedStudentAssignment } from '@/features/assignment/slice/studentAssignmentSlice'
import { Separator } from 'radix-ui'
import { useTranslations } from 'next-intl'

// --- Helper Functions ---

export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  })
}

const StatusBadge = ({ status }: { status: string }) => {
  let colorClasses = 'bg-gray-100 text-gray-800'
  if (status === 'Passed' || status === 'Graded') {
    colorClasses = 'bg-green-100 text-green-800'
  } else if (status === 'Failed') {
    colorClasses = 'bg-red-100 text-red-800'
  } else if (status === 'Submitted' || status === 'UnderReview') {
    colorClasses = 'bg-yellow-100 text-yellow-800'
  }
  return <Badge className={`capitalize ${colorClasses}`}>{status.toLowerCase()}</Badge>
}

type SubmissionDetailViewerProps = {
  assignmentTitle: string
  studentAssignmentData: StudentAssignmentDetail
}

function SubmissionDetailViewer({ assignmentTitle, studentAssignmentData }: SubmissionDetailViewerProps) {
  const latestAttempt =
    studentAssignmentData.attempts.length > 0
      ? [...studentAssignmentData.attempts].sort((a, b) => b.attemptNumber - a.attemptNumber)[0]
      : null

  if (!latestAttempt) return null

  return (
    <div className='max-h-[90vh] w-5xl overflow-y-auto p-6'>
      {/* Header */}
      <div className='flex flex-col items-start justify-between gap-2 text-sm'>
        <h1 className='mb-2 text-2xl font-semibold'>{assignmentTitle}</h1>
        <p>Submitted: {formatDate(latestAttempt.submittedAt)}</p>
        <p>
          Status: <StatusBadge status={latestAttempt.status} />
        </p>
        <p>Final Score: {latestAttempt.totalScore}%</p>
      </div>
      <hr className='my-6' />

      {/* Overall Feedback */}
      {latestAttempt.feedback && (
        <Card className='mt-6 py-4'>
          <CardHeader>
            <CardTitle className='text-lg'>Teacher's Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-700 italic'>"{latestAttempt.feedback}"</p>
          </CardContent>
        </Card>
      )}

      {/* Loop Questions */}
      <div className='mt-6 space-y-6'>
        <h2 className='text-xl font-semibold'>Submission Details</h2>
        {latestAttempt.questionAttempts.map((question, index) => (
          <Card key={question.id} className='overflow-hidden'>
            <CardHeader className='flex items-center border-b bg-gray-50'>
              <CardTitle className='text-lg'>Question {index + 1}</CardTitle>
            </CardHeader>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='p-6 md:border-r'>
                <h4 className='mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase'>Your Answer</h4>
                <p className='prose prose-sm max-w-none text-gray-700'>
                  {question.answerText || 'No text answer provided.'}
                </p>
                {question.answerFileUrl && (
                  <Button variant='link' className='mt-4 p-0 text-sm' asChild>
                    <a href={question.answerFileUrl} target='_blank' rel='noopener noreferrer'>
                      <FileText className='mr-2 h-4 w-4' />
                      View Submitted File
                      <ExternalLink className='ml-1 h-3 w-3' />
                    </a>
                  </Button>
                )}
              </div>
              <div className='p-6'>
                <h4 className='mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase'>Grading Rubric</h4>
                <div className='space-y-4'>
                  {question.rubricScore.map((criterion) => (
                    <div key={criterion.rubricCriterionId} className='flex items-center justify-between'>
                      <p className='text-sm font-medium'>{criterion.criterionName}</p>
                      <span className='flex-shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium'>
                        {criterion.currentPoints} / {criterion.maxPoints} pts
                      </span>
                    </div>
                  ))}
                  <div className='flex items-center justify-between border-t pt-4 font-semibold'>
                    <span>Total for Question:</span>
                    <span>{question.points} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface AssignmentAttemptProps {
  studentAssignmentId?: number | string
  assignmentId: number
}

export default function AssignmentAttempt({ studentAssignmentId, assignmentId }: AssignmentAttemptProps) {
  const t = useTranslations('assignment.student')
  const tc = useTranslations('common')

  const [isSubmissionOpen, setSubmissionOpen] = useState(false)
  const [isFeedbackOpen, setFeedbackOpen] = useState(false)
  const { lessonId } = useParams()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    data: studentAssignmentResponse,
    isLoading: isLoadingStudent,
    isError: isErrorStudent
  } = useGetStudentAssignmentByIdQuery(studentAssignmentId, {
    skip: !studentAssignmentId
  })

  const { data: assignmentDetail, isLoading: isLoadingAssignment } = useGetAssignmentByIdQuery(assignmentId, {
    skip: !assignmentId
  })

  const assignmentTitle = assignmentDetail?.data?.title ?? 'Assignment'
  const passingScore = assignmentDetail?.data?.passingScore ?? 80

  const handleAttemptAssignment = () => {
    if (!assignmentDetail?.data || !studentAssignmentResponse?.data) return

    dispatch(setSelectedAssignment(assignmentDetail.data))
    dispatch(setSelectedStudentAssignment(studentAssignmentResponse.data))

    router.push(`${lessonId}/assignment/${assignmentId}`)
  }

  if (isLoadingStudent || (isLoadingAssignment && studentAssignmentResponse?.data?.assignmentId)) {
    return <LoadingComponent />
  }

  if (isErrorStudent || !studentAssignmentResponse?.data) {
    return (
      <div className='space-y-4 p-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>{assignmentDetail?.data?.title}</h1>
        </div>

        {/* Asm Stats Card */}
        <Card className='border-gray-200 shadow-sm'>
          <CardContent className='p-0'>
            <div className='grid grid-cols-4 divide-x divide-gray-200'>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-amber-100 p-3'>
                  <Trophy className='h-6 w-6 text-amber-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{t('firstAttempt.totalMark')}</p>
                <p className='text-2xl font-bold text-gray-900'>{assignmentDetail?.data?.totalScore}</p>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-green-100 p-3'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{t('firstAttempt.passingMark')}</p>
                <p className='text-2xl font-bold text-gray-900'>{assignmentDetail?.data?.passingScore}</p>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-sky-100 p-3'>
                  <Clock className='h-6 w-6 text-sky-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{t('firstAttempt.time')}</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {assignmentDetail?.data?.durationDays} {t('firstAttempt.day')}
                </p>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-sky-100 p-3'>
                  <Clock className='h-6 w-6 text-sky-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{t('firstAttempt.quesLength')}</p>
                <p className='text-2xl font-bold text-gray-900'>{assignmentDetail?.data?.questions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='flex justify-center'>
          {/* loading button when creating quiz attempt */}
          <Button asChild className='bg-blue-600 text-white hover:bg-blue-700'>
            <Link href={`/student-assignment/${assignmentDetail?.data?.id}`}>{tc('button.attempt')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const studentAssignmentData = studentAssignmentResponse.data
  const latestAttempt =
    studentAssignmentData.attempts.length > 0
      ? [...studentAssignmentData.attempts].sort((a, b) => b.attemptNumber - a.attemptNumber)[0]
      : null

  const maxAttempts = studentAssignmentData.maxAttemptAllowed
  const attemptsMade = studentAssignmentData.attempts.length
  const attemptsRemaining = maxAttempts - attemptsMade

  const isGraded =
    latestAttempt &&
    (latestAttempt.status === StudentAssignmentStatus.PASSED || latestAttempt.status === StudentAssignmentStatus.FAILED)

  const isPassed = latestAttempt && latestAttempt.status === StudentAssignmentStatus.PASSED

  // Conditions for showing retry button
  const nextAttemptCondition =
    studentAssignmentData.nextAttemptAvailableAt && new Date() < new Date(studentAssignmentData.nextAttemptAvailableAt)
  const attemptMadeCondition = attemptsMade > 0 && attemptsMade < maxAttempts
  const statusCondition = studentAssignmentData.status !== 'Passed' && studentAssignmentData.status !== 'Expired'

  const retryCondition = attemptMadeCondition && statusCondition
  const retryCondition2 = nextAttemptCondition && statusCondition

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      <Card className='bg-blue-50 py-4'>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>{assignmentTitle}</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <div className='mb-1 text-sm font-medium text-gray-700'>{t('alreadyAttempted.due')}</div>
              <div className='text-sm text-gray-900'>{formatDate(studentAssignmentData.dueDate)}</div>
            </div>
            {latestAttempt && (
              <div>
                <div className='mb-1 text-sm font-medium text-gray-700'>{t('alreadyAttempted.submitted')}</div>
                <div className='text-sm text-gray-900'>{formatDate(latestAttempt.submittedAt)}</div>
              </div>
            )}
          </div>
          <div className='space-y-4'>
            <div>
              {retryCondition || retryCondition2 ? (
                <>
                  {attemptsRemaining && maxAttempts ? (
                    <>
                      <div className='mb-1 text-sm font-medium text-gray-700'>{t('alreadyAttempted.attempt')}</div>
                      <div className='text-sm text-gray-900'>
                        {attemptsRemaining} {t('alreadyAttempted.left')} ({maxAttempts} {t('alreadyAttempted.allow')})
                      </div>
                    </>
                  ) : studentAssignmentData.nextAttemptAvailableAt ? (
                    <p className='text-sm text-gray-900'>
                      {t('alreadyAttempted.nextAttempt')}: {formatDate(studentAssignmentData.nextAttemptAvailableAt)}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
            <div className='flex justify-end'>
              {attemptsMade === 0 ? (
                <Button onClick={handleAttemptAssignment} className='bg-blue-500 text-white hover:bg-blue-600'>
                  {tc('button.attempt')}
                </Button>
              ) : retryCondition || retryCondition2 ? (
                <Button
                  onClick={handleAttemptAssignment}
                  variant='outline'
                  className='border-blue-600 text-blue-600 hover:bg-blue-50'
                >
                  <RotateCcw className='mr-2 h-4 w-4' />
                  {tc('button.retry')}
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {isGraded && (
        <Card className={isPassed ? 'bg-green-50 py-4' : 'bg-red-50 py-4'}>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>{t('graded.title')}</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>{t('graded.description', { passingScore: passingScore })}</p>
              <p className={`text-4xl font-bold ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
                {studentAssignmentData.finalScore}%
              </p>
            </div>
            <div className='flex w-full flex-shrink-0 gap-3 md:w-auto'>
              <Button variant='outline' className='w-1/2 bg-white md:w-auto' onClick={() => setSubmissionOpen(true)}>
                {tc('button.viewSub')}
              </Button>
              <Button variant='outline' className='w-1/2 bg-white md:w-auto' onClick={() => setFeedbackOpen(true)}>
                {tc('button.seeFeedback')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {latestAttempt && latestAttempt.status === StudentAssignmentStatus.UNDER_REVIEW && (
        <Card className='bg-yellow-50'>
          <CardContent className='p-6'>
            <h2 className='mb-1 text-lg font-semibold'>{t('alreadyAttempted.pending')}</h2>
            <p className='text-sm text-gray-700'>
              {t('alreadyAttempted.description', { date: formatDate(latestAttempt.submittedAt) })}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isSubmissionOpen} onOpenChange={setSubmissionOpen}>
        <DialogContent className='sm:-w-[80rem] max-w-full p-0'>
          <SubmissionDetailViewer assignmentTitle={assignmentTitle} studentAssignmentData={studentAssignmentData} />
        </DialogContent>
      </Dialog>

      <Dialog open={isFeedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('alreadyAttempted.title')}</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-sm text-gray-700 italic'>"{latestAttempt?.feedback || 'No feedback provided.'}"</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button'>{tc('button.close')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
