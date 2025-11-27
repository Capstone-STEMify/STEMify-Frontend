'use client'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { Textarea } from '@/components/shadcn/textarea'
import { Input } from '@/components/shadcn/input'
import {
  useGetStudentAssignmentByIdQuery,
  useGradeAssignmentAttemptMutation
} from '@/features/assignment/api/studentAssignmentApi'
import { useGetAssignmentByIdQuery } from '@/features/assignment/api/assignmentApi'
import {
  GradeSubmissionPayload,
  QuestionGradePayload,
  RubricScorePayload
} from '@/features/assignment/types/assigmentlistdetail.type'
import { toast } from 'sonner'
import { useGetUserByIdQuery } from '@/features/user/api/userApi'
import Loading from 'app/[locale]/loading'

type Props = {
  studentAssignmentId: number | null
  onClose: () => void
}

export default function GradeAssignmentModal({ studentAssignmentId, onClose }: Props) {
  const { data: detailResponse, isLoading: isLoadingDetail } = useGetStudentAssignmentByIdQuery(
    studentAssignmentId ?? undefined,
    { skip: !studentAssignmentId }
  )

  const attemptData = detailResponse?.data ? detailResponse.data.attempts[0] : undefined
  const assignmentId = detailResponse?.data?.assignmentId

  const { data: assignmentRes, isLoading: isLoadingAssignment } = useGetAssignmentByIdQuery(
    assignmentId as string | number,
    {
      skip: !assignmentId
    }
  )

  const { data: userData, isLoading: userLoading} = useGetUserByIdQuery(detailResponse?.data.studentId as string | number, {
    skip: !detailResponse?.data.studentId
  })

  const [gradeAssignment, { isLoading: isGrading }] = useGradeAssignmentAttemptMutation()

  const [scores, setScores] = useState<Record<number, Record<number, number | null>>>({})
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    if (!attemptData || !attemptData.questionAttempts) return

    const initialScores: Record<number, Record<number, number | null>> = {}
    attemptData.questionAttempts.forEach((qAttempt) => {
      initialScores[qAttempt.id] = {}
      qAttempt.rubricScore.forEach((criterion) => {
        initialScores[qAttempt.id][criterion.rubricCriterionId] = (criterion as any).currentPoints ?? null
      })
    })

    setScores(initialScores)
  }, [attemptData])

  useEffect(() => {
    if (attemptData?.feedback) setFeedbackText(attemptData.feedback)
  }, [attemptData])

  const handleScoreChange = (qAttemptId: number, criterionId: number, points: string) => {
    if (points === '') {
      setScores((prev) => ({
        ...prev,
        [qAttemptId]: {
          ...prev[qAttemptId],
          [criterionId]: null
        }
      }))
      return
    }

    const numPoints = parseInt(points, 10)
    if (isNaN(numPoints) || numPoints < 0) return

    setScores((prev) => ({
      ...prev,
      [qAttemptId]: {
        ...prev[qAttemptId],
        [criterionId]: numPoints
      }
    }))
  }

  const handleSubmit = async () => {
    if (!attemptData || !studentAssignmentId) {
      toast.error('Missing assignment data.')
      return
    }

    const attemptId = attemptData.id

    const questionGrades: QuestionGradePayload[] = attemptData.questionAttempts.map((qAttempt) => {
      const questionScores = scores[qAttempt.id] || {}

      const rubricScores: RubricScorePayload[] = qAttempt.rubricScore.map((criterion) => ({
        rubricCriterionId: criterion.rubricCriterionId,
        points: questionScores[criterion.rubricCriterionId] || 0
      }))

      return {
        assignmentQuestionAttemptId: qAttempt.id,
        rubricScores: rubricScores
      }
    })

    const payload: GradeSubmissionPayload = {
      feedback: feedbackText,
      questionGrades
    }

    try {
      await gradeAssignment({ attemptId, studentAssignmentId, body: payload }).unwrap()
      toast.success('Grading submitted')
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit grading')
    }
  }

  if (isLoadingDetail || isLoadingAssignment || userLoading) return <Loading />

  if (!attemptData)
    return (
      <div className='p-6'>
        <p className='text-sm text-red-500'>Missing attempt data.</p>
        <div className='mt-4 text-right'>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    )

    const userName = userData?.data ? userData.data.firstName + ' ' + userData.data.lastName : 'Student'

  return (
    <div className='max-h-[80vh] w-full overflow-y-auto p-6 md:p-8'>
      <header className='flex items-center gap-3'>
        <Avatar className='h-12 w-12'>
          {/** student image may not exist in this payload; show initials fallback */}
          <AvatarFallback className='bg-gradient-to-br from-indigo-100 to-purple-100 text-xs font-semibold text-indigo-700'>
            {userName
              ? userName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
              : ''}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className='text-lg font-semibold text-slate-700'>{userName}</div>
          <div className='text-sm text-slate-500'>{assignmentRes?.data?.title || 'Assignment'}</div>
        </div>
      </header>

      <div className='mt-6 space-y-6'>
        {attemptData.questionAttempts.map((qAttempt) => (
          <div key={qAttempt.id} className='rounded-lg border p-4'>
            <div className='mb-3 text-sm font-medium text-slate-700'>Question Attempt #{qAttempt.id}</div>
            <div className='grid gap-2'>
              {qAttempt.rubricScore.map((criterion) => (
                <div key={criterion.rubricCriterionId} className='flex items-center gap-3'>
                  <div className='flex-1 text-sm'>{criterion.criterionName}</div>
                  <div className='w-28'>
                    <Input
                      value={
                        scores[qAttempt.id] && scores[qAttempt.id][criterion.rubricCriterionId] != null
                          ? String(scores[qAttempt.id][criterion.rubricCriterionId])
                          : ''
                      }
                      onChange={(e) => handleScoreChange(qAttempt.id, criterion.rubricCriterionId, e.target.value)}
                      placeholder={`/ ${criterion.maxPoints}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className='mb-2 text-sm font-medium text-slate-700'>Feedback</div>
          <Textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
        </div>

        <div className='flex justify-end gap-3'>
          <Button variant='ghost' onClick={onClose} disabled={isGrading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isGrading}>
            {isGrading ? 'Submitting...' : 'Submit Grade'}
          </Button>
        </div>
      </div>
    </div>
  )
}
