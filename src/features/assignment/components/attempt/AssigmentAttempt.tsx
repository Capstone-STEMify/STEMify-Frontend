'use client'
import React, { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { ExternalLink, FileText, RotateCcw } from 'lucide-react'
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
import { StudentAssignmentDetail } from '../../types/assigmentlistdetail.type'

// --- Helper Functions ---

const formatDate = (dateString: string) => {
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
    <div className='max-h-[90vh] overflow-y-auto p-6 w-5xl'>
      {/* Header */}
      <div className='flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-3xl font-semibold'>{assignmentTitle}</h1>
        <div className='w-full flex-shrink-0 text-left sm:w-auto sm:text-right'>
          <span className='text-sm text-gray-500'>Final Score</span>
          <p className='text-4xl font-bold'>{studentAssignmentData.finalScore}</p>
          <StatusBadge status={studentAssignmentData.status} />
        </div>
      </div>

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
        <h2 className='text-2xl font-semibold'>Submission Details</h2>
        {latestAttempt.questionAttempts.map((question, index) => (
          <Card key={question.id} className='overflow-hidden'>
            <CardHeader className='border-b bg-gray-50'>
              <CardTitle className='text-lg'>Question {index + 1}</CardTitle>
            </CardHeader>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='p-6 md:border-r'>
                <h4 className='mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase'>Your Answer</h4>
                <p className='prose prose-sm max-w-none text-gray-700'>
                  {question.answerText || 'No text answer provided.'}
                </p>
                {question.answerFileUrl && (
                  <Button variant='link' className='p-0 text-sm mt-4' asChild>
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
  studentAssignmentId: number | string
}

export default function AssignmentAttempt({ studentAssignmentId }: AssignmentAttemptProps) {
  const [isSubmissionOpen, setSubmissionOpen] = useState(false)
  const [isFeedbackOpen, setFeedbackOpen] = useState(false)

  const {
    data: studentAssignmentResponse,
    isLoading: isLoadingStudent,
    isError: isErrorStudent
  } = useGetStudentAssignmentByIdQuery(studentAssignmentId, {
    skip: !studentAssignmentId
  })

  const { data: assignmentDetail, isLoading: isLoadingAssignment } = useGetAssignmentByIdQuery(
    Number(studentAssignmentResponse?.data?.assignmentId),
    {
      skip: !studentAssignmentResponse?.data?.assignmentId
    }
  )

  const assignmentTitle = assignmentDetail?.data?.title ?? 'Assignment'
  const passingScore = assignmentDetail?.data?.passingScore ?? 80

  if (isLoadingStudent || (isLoadingAssignment && studentAssignmentResponse?.data?.assignmentId)) {
    return <LoadingComponent />
  }

  if (isErrorStudent || !studentAssignmentResponse?.data) {
    return <div className='p-6 text-center text-red-500'>Error loading assignment data.</div>
  }

  const studentAssignmentData = studentAssignmentResponse.data
  const latestAttempt =
    studentAssignmentData.attempts.length > 0
      ? [...studentAssignmentData.attempts].sort((a, b) => b.attemptNumber - a.attemptNumber)[0]
      : null

  const maxAttempts = 3
  const attemptsMade = studentAssignmentData.attempts.length
  const attemptsRemaining = maxAttempts - attemptsMade
  
  const isGraded = latestAttempt && (latestAttempt.status === 'Graded' || latestAttempt.status === 'Failed' || latestAttempt.status === 'Passed')

  const isPassed = studentAssignmentData.status === 'Passed'

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      <Card className='bg-blue-50 py-4'>
        <CardHeader>
          <CardTitle className='text-lg font-semibold'>Assignment details</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <div className='mb-1 text-sm font-medium text-gray-700'>Due</div>
              <div className='text-sm text-gray-900'>{formatDate(studentAssignmentData.dueDate)}</div>
            </div>
            {latestAttempt && (
              <div>
                <div className='mb-1 text-sm font-medium text-gray-700'>Submitted</div>
                <div className='text-sm text-gray-900'>{formatDate(latestAttempt.submittedAt)}</div>
              </div>
            )}
          </div>
          <div className='space-y-4'>
            <div>
              <div className='mb-1 text-sm font-medium text-gray-700'>Attempts</div>
              <div className='text-sm text-gray-900'>
                {attemptsRemaining} left ({maxAttempts} attempts every 8 hours)
              </div>
            </div>
            <div className='flex justify-end'>
              {attemptsMade === 0 ? (
                <Button asChild className='bg-blue-600 text-white hover:bg-blue-700'>
                  <Link
                    href={`/student-assignment/${studentAssignmentData.assignmentId}?studentAssignmentId=${studentAssignmentData.id}`}
                  >
                    Attempt Now
                  </Link>
                </Button>
              ) : attemptsMade > 0 && attemptsMade < maxAttempts ? (
                <Button asChild variant='outline' className='border-blue-600 text-blue-600 hover:bg-blue-50'>
                  <Link
                    href={`/student-assignment/${studentAssignmentData.assignmentId}?studentAssignmentId=${studentAssignmentData.id}`}
                  >
                    <RotateCcw className='mr-2 h-4 w-4' />
                    Retry
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {isGraded && (
        <Card className={isPassed ? 'bg-green-50 py-4' : 'bg-red-50 py-4'}>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>Your grade</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                To pass you need at least {passingScore}%. We keep your highest score.
              </p>
              <p className={`text-6xl font-bold ${isPassed ? 'text-green-700' : 'text-red-700'}`}>{studentAssignmentData.finalScore}%</p>
            </div>
            <div className='flex w-full flex-shrink-0 gap-3 md:w-auto'>
              <Button variant='outline' className='w-1/2 bg-white md:w-auto' onClick={() => setSubmissionOpen(true)}>
                View submission
              </Button>
              <Button variant='outline' className='w-1/2 bg-white md:w-auto' onClick={() => setFeedbackOpen(true)}>
                See feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {latestAttempt && (latestAttempt.status === 'Submitted' || latestAttempt.status === 'UnderReview') && (
        <Card className='bg-yellow-50'>
          <CardContent className='p-6'>
            <h2 className='mb-1 text-lg font-semibold'>Pending Review</h2>
            <p className='text-sm text-gray-700'>
              Your submission from {formatDate(latestAttempt.submittedAt)} is currently being reviewed.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isSubmissionOpen} onOpenChange={setSubmissionOpen}>
        <DialogContent className='max-w-full sm:-w-[80rem] p-0'>
          <SubmissionDetailViewer
            assignmentTitle={assignmentTitle}
            studentAssignmentData={studentAssignmentData}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFeedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher's Feedback</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-sm text-gray-700 italic'>
              "{latestAttempt?.feedback || 'No feedback provided.'}"
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button'>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}