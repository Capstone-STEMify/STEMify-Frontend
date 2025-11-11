'use client'
import React from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'
import { useGetStudentAssignmentByIdQuery } from '@/features/assignment/api/studentAssignmentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useGetAssignmentByIdQuery } from '../../api/assignmentApi'

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

interface AssignmentAttemptProps {
  studentAssignmentId: number | string
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

export default function AssignmentAttempt({ studentAssignmentId }: AssignmentAttemptProps) {
  const {
    data: studentAssignmentResponse,
    isLoading: isLoadingStudent,
    isError: isErrorStudent
  } = useGetStudentAssignmentByIdQuery(studentAssignmentId, {
    skip: !studentAssignmentId
  })

  const {
    data: assignmentDetail,
  } = useGetAssignmentByIdQuery(Number(studentAssignmentResponse?.data?.assignmentId), {
    skip: !studentAssignmentResponse?.data?.assignmentId
  })

  const assignmentTitle = assignmentDetail?.data?.title ?? 'Assignment'

  if (isLoadingStudent) {
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

  const attemptsRemaining = 3
  const maxAttempts = 3

  if (!latestAttempt) {
    return (
      <div className='mx-auto max-w-4xl space-y-6 p-6'>
        <div>
          <h1 className='mb-2 text-3xl font-semibold'>Assignment</h1>
          <button className='text-sm font-medium text-blue-600 hover:underline'>Review Learning Objectives</button>
        </div>

        <Card className='bg-blue-50'>
          <CardContent className='p-6'>
            <h2 className='mb-4 text-lg font-semibold'>Assignment details</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div>
                  <div className='mb-1 text-sm font-medium text-gray-700'>Due</div>
                  <div className='text-sm text-gray-900'>{formatDate(studentAssignmentData.dueDate)}</div>
                </div>
              </div>
              <div className='space-y-4'>
                <div>
                  <div className='mb-1 text-sm font-medium text-gray-700'>Attempts</div>
                  <div className='text-sm text-gray-900'>
                    {attemptsRemaining} left ({maxAttempts} attempts every 8 hours)
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button asChild className='bg-blue-600 text-white hover:bg-blue-700'>
                      Attempt Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (latestAttempt.status === 'Submitted' || latestAttempt.status === 'UnderReview') {
     return (
       <div className='mx-auto max-w-4xl space-y-6 p-6'>
         <h1 className='mb-2 text-3xl font-semibold'>{assignmentTitle}</h1>
         <Card className='bg-yellow-50'>
           <CardContent className='p-6'>
             <h2 className='mb-1 text-lg font-semibold'>Pending Review</h2>
             <p className='text-sm text-gray-700'>
               Your submission from {formatDate(latestAttempt.submittedAt)} is currently being reviewed.
             </p>
           </CardContent>
         </Card>
       </div>
     )
  }

  if (latestAttempt.status === 'Graded' || latestAttempt.status === 'Failed' || latestAttempt.status === 'Passed') {
    return (
      <div className='mx-auto max-w-5xl space-y-6 p-6'>
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
          <Card className='py-4'>
            <CardHeader>
              <CardTitle className='text-lg'>Teacher's Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-700 italic'>"{latestAttempt.feedback}"</p>
            </CardContent>
          </Card>
        )}

        {/* Loop Questions */}
        <div className='space-y-6'>
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
                    {question.rubricScore.map(criterion => (
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
  
  return <div className='p-6'>Unhandled attempt status: {latestAttempt.status}</div>
}