import React from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import {
  Assignment,
  AssignmentQuestionType,
  AssignmentSubmission,
  AssignmentSubmissionStatus
} from '@/features/assignment/types/assignment.type'

interface AssignmentSubmissionPageProps {
  assignment: Assignment
  submission: AssignmentSubmission
  attemptsRemaining: number
  maxAttempts: number
}

export default function AssignmentSubmissionPage({
  assignment,
  submission,
  attemptsRemaining,
  maxAttempts
}: AssignmentSubmissionPageProps) {
  // Format date helper
  const formatDate = (dateString: string) => {
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

  // Calculate grade percentage
  const gradePercentage = ((submission.totalScore / assignment.totalScore) * 100).toFixed(2)
  const passingPercentage = ((assignment.passingScore / assignment.totalScore) * 100).toFixed(0)

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      {/* Header */}
      <div>
        <h1 className='mb-2 text-3xl font-semibold'>Agile & Lean Software Development</h1>
        <button className='text-sm font-medium text-blue-600 hover:underline'>Review Learning Objectives</button>
      </div>

      {/* Update Notice */}
      <Card className='border-l-4 border-l-orange-500 bg-orange-50'>
        <CardContent className='flex items-start gap-3 p-4'>
          <AlertTriangle className='mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600' />
          <p className='text-sm text-orange-900'>
            Course Staff updated this assessment. You'll see the changes when you start or edit.
          </p>
        </CardContent>
      </Card>

      {/* Assignment Details */}
      <Card className='bg-blue-50'>
        <CardContent className='p-6'>
          <h2 className='mb-4 text-lg font-semibold'>Assignment details</h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Left Column */}
            <div className='space-y-4'>
              <div>
                <div className='mb-1 text-sm font-medium text-gray-700'>Due</div>
                <div className='text-sm text-gray-900'>{assignment.durationDays} days</div>
              </div>

              <div>
                <div className='mb-1 text-sm font-medium text-gray-700'>Submitted</div>
                <div className='text-sm text-gray-900'>{formatDate(submission.submittedAt)}</div>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-4'>
              <div>
                <div className='mb-1 text-sm font-medium text-gray-700'>Attempts</div>
                <div className='text-sm text-gray-900'>
                  {attemptsRemaining} left ({maxAttempts} attempts every 8 hours)
                </div>
              </div>

              <div className='flex justify-end'>
                <Button variant='default' className='bg-blue-600 text-white hover:bg-blue-700'>
                  <RotateCcw className='mr-2 h-4 w-4' />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Display */}
      <Card className='bg-green-50'>
        <CardContent className='p-6'>
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='mb-1 text-lg font-semibold'>Your grade</h2>
              <p className='mb-4 text-sm text-gray-700'>
                To pass you need at least {passingPercentage}%. We keep your highest score.
              </p>
              <div className='text-5xl font-bold text-gray-900'>{gradePercentage}%</div>
            </div>

            <div className='flex gap-3'>
              <Button variant='outline' className='border-blue-600 text-blue-600 hover:bg-blue-50'>
                View submission
              </Button>
              <Button variant='outline' className='border-blue-600 text-blue-600 hover:bg-blue-50'>
                See feedback
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Example usage with mock data
export function AssignmentSubmissionPageDemo() {
  const mockAssignment: Assignment = {
    id: 1,
    contentId: 1,
    title: 'Agile & Lean Software Development',
    totalScore: 100,
    passingScore: 70,
    durationDays: 7,
    questions: {
      id: 1,
      type: AssignmentQuestionType.TEXT,
      orderIndex: 1,
      points: 10,
      content: 'Explain the principles of Agile development.',
      rubricCriterion: []
    }
  }

  const mockSubmission: AssignmentSubmission = {
    id: 1,
    assignmentId: 1,
    studentId: 1,
    gradedBy: 1,
    submittedAt: '2025-01-19T17:32:00+07:00',
    totalScore: 98.88,
    feedback: 'Great work!',
    attemptNumber: 1,
    status: AssignmentSubmissionStatus.GRADED,
    isPass: true,
    answers: []
  }

  return (
    <AssignmentSubmissionPage
      assignment={mockAssignment}
      submission={mockSubmission}
      attemptsRemaining={3}
      maxAttempts={3}
    />
  )
}
