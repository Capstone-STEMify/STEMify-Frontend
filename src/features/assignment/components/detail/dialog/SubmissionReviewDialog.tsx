import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Textarea } from '@/components/shadcn/textarea'
import { Download, Printer, Share2, HelpCircle, ExternalLink } from 'lucide-react'
import { Submission } from '../table/AssignmentTable'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import {
  useGetStudentAssignmentByIdQuery,
  useGradeAssignmentAttemptMutation
} from '@/features/assignment/api/studentAssignmentApi'
import { Input } from '@/components/shadcn/input'
import { useState, useEffect } from 'react'
import {
  GradeSubmissionPayload,
  QuestionGradePayload,
  RubricScorePayload
} from '@/features/assignment/types/assigmentlistdetail.type'

import { toast } from 'sonner'
import { useModal } from '@/providers/ModalProvider'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useTranslations } from 'next-intl'
interface SubmissionReviewDialogProps {
  submission: Submission
  studentAssignmentId: number | null
  onSuccess?: () => void
  onClose?: () => void
}

export function SubmissionReviewDialog({
  submission,
  studentAssignmentId,
  onSuccess,
  onClose
}: SubmissionReviewDialogProps) {
  const { closeModal } = useModal()

  const t = useTranslations('assignment.teacher')
  const tc = useTranslations('common')

  // Helper function to translate submission status
  const getStatusTranslation = (status: string): string => {
    const statusMap: Record<string, string> = {
      Passed: 'modal.subStatus.passed',
      Failed: 'modal.subStatus.failed',
      'Not Submitted': 'modal.subStatus.notSubmitted',
      Submitted: 'modal.subStatus.submitted',
      Pending: 'modal.subStatus.pending',
      UnderReview: 'modal.subStatus.underReview',
      Graded: 'modal.subStatus.graded'
    }
    return t(statusMap[status] || 'modal.subStatus.pending')
  }

  const {
    data: detailResponse,
    isLoading,
    isError
  } = useGetStudentAssignmentByIdQuery(studentAssignmentId ?? undefined, {
    skip: !studentAssignmentId
  })

  const [gradeAssignment, { isLoading: isGrading }] = useGradeAssignmentAttemptMutation()

  const [scores, setScores] = useState<Record<number, Record<number, number | null>>>({})
  const [feedbackText, setFeedbackText] = useState('')

  const attemptData = detailResponse?.data
    ? detailResponse.data.attempts[detailResponse.data.attempts.length - 1]
    : submission.attempts[submission.attempts.length - 1]

  const isReviewed = submission.status === 'Passed' || submission.status === 'Failed' || submission.status === 'Graded'
  const totalScore = attemptData ? attemptData.totalScore : submission.point
  const feedback = attemptData ? attemptData.feedback : submission.comment

  useEffect(() => {
    if (feedback) {
      setFeedbackText(feedback)
    }
  }, [feedback])

  useEffect(() => {
    if (!attemptData || !attemptData.questionAttempts) return

    const initialScores: Record<number, Record<number, number | null>> = {}

    attemptData.questionAttempts.forEach((qAttempt) => {
      initialScores[qAttempt.id] = {}
      qAttempt.rubricScore.forEach((criterion) => {
        // accept either `currentPoints` (server-side naming) or `points` (alternate payload)
        initialScores[qAttempt.id][criterion.rubricCriterionId] =
          (criterion as any).currentPoints ?? (criterion as any).points ?? null
      })
    })

    setScores(initialScores)
  }, [attemptData?.id])

  useEffect(() => {
    if (!attemptData?.feedback) {
      setFeedbackText('')
    } else {
      setFeedbackText(attemptData.feedback)
    }
  }, [attemptData?.id])

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

  const handleSubmitReview = async () => {
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
      questionGrades: questionGrades
    }

    try {
      await gradeAssignment({
        attemptId: attemptId,
        studentAssignmentId: studentAssignmentId,
        body: payload
      }).unwrap()

      toast.success('Review submitted successfully!')
      // close both global modal (if used) and parent-controlled dialog
      closeModal()
      onClose?.()
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to submit review.')
      console.error(err)
    }
  }

  return (
    <div className='max-h-[90vh] w-5xl overflow-y-auto p-6 md:p-8'>
      <header className='flex flex-col justify-between sm:flex-row sm:items-start'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src={submission.imageUrl} alt={submission.studentName} />
            <AvatarFallback>
              {submission.studentName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className='flex items-center gap-2 text-lg font-semibold'>{submission.studentName}</h2>
            <p className='text-sm text-gray-500'>{submission.studentRole}</p>
          </div>
        </div>
      </header>

      <div className='mt-6'>
        <h1 className='text-3xl font-bold'>{submission.quizTitle}</h1>
        <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
          <span>
            {t('modal.submit')}: {submission.quizFinishedDate}
          </span>
          <span className='flex items-center gap-1.5'>
            <HelpCircle className='h-4 w-4' />
            {submission.quizQuestionCount} {t('question')}
          </span>
        </div>
      </div>

      {isReviewed && (
        <div className='mt-6 grid grid-cols-3 gap-4 border-b pb-6'>
          <div>
            <span className='text-sm text-gray-500'>{t('modal.point')}</span>
            <p className='text-2xl font-semibold text-green-600'>{totalScore || '0'}%</p>
          </div>
          <div>
            <span className='text-sm text-gray-500'>{t('modal.status')}</span>
            <div>
              <Badge className={getStatusBadgeClass(submission.status)}>
                {getStatusTranslation(submission.status)}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingComponent />
      ) : isError ? (
        <div className='my-10 text-center text-red-500'>Lỗi</div>
      ) : (
        <>
          <div className='my-10 space-y-8'>
            {attemptData &&
              attemptData.questionAttempts.map((question, index) => (
                <div key={question.id} className='rounded-lg border'>
                  <h3 className='border-b bg-gray-50 px-6 py-3 text-lg font-semibold'>
                    {t('modal.question')} {index + 1}
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2'>
                    <div className='p-6 md:border-r'>
                      <h4 className='mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase'>
                        {t('modal.answer')}
                      </h4>
                      <div className='prose prose-sm max-w-none text-gray-700'>
                        {question.answerText ? (
                          <p>{question.answerText}</p>
                        ) : (
                          <div className='mt-6'>
                            <h5 className='mb-2 text-sm font-medium text-gray-600'>{t('modal.submitFile')}</h5>
                            <Button variant='link' className='p-0 text-sm' asChild>
                              <a
                                href={
                                  question.answerFileUrl ||
                                  'https://res.cloudinary.com/dms8gue1c/video/upload/v1765229933/asm_sub_tair43.mp4'
                                }
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <p className='text-blue-500'>{t('modal.viewFile')}</p>{' '}
                                <ExternalLink className='ml-1 h-3 w-3' />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='p-6'>
                      <div className='flex justify-between'>
                        <h4 className='mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase'>
                          {t('modal.rubric')}
                        </h4>
                        <p className='text-xs text-gray-800'>
                          {question.rubricScore.reduce((sum, c) => sum + c.maxPoints, 0)} {t('modal.point')}
                        </p>
                      </div>
                      <div className='space-y-6'>
                        {question.rubricScore.length > 0 ? (
                          question.rubricScore.map((criterion) => (
                            <div key={criterion.rubricCriterionId}>
                              <p className='text-sm font-medium'>{criterion.criterionName}</p>
                              <div className='mt-2 flex items-center gap-1'>
                                <Input
                                  type='number'
                                  placeholder={t('modal.point')}
                                  className='w-24'
                                  max={criterion.maxPoints}
                                  min={0}
                                  disabled={isReviewed || isGrading}
                                  value={
                                    // prefer edited state, otherwise fallback to API fields
                                    scores[question.id]?.[criterion.rubricCriterionId] ??
                                    (criterion as any).currentPoints ??
                                    (criterion as any).points ??
                                    ''
                                  }
                                  onChange={(e) =>
                                    handleScoreChange(question.id, criterion.rubricCriterionId, e.target.value)
                                  }
                                />
                                <span className='ml-2 text-xs text-gray-500 italic'>
                                  ({t('modal.max')}: {criterion.maxPoints})
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className='text-sm text-gray-500'>Không có tiêu chí đánh giá cho câu hỏi này.</p>
                        )}

                        <div className='mt-6 border-t pt-4'>
                          <p className='text-sm font-medium text-gray-700'>
                            {t('modal.total')}:{' '}
                            {question.rubricScore.reduce((sum, c) => {
                              const key = c.rubricCriterionId
                              const scoreFromState = scores[question.id]?.[key]
                              const scoreFromApi = (c as any).currentPoints ?? (c as any).points
                              const score = scoreFromState !== undefined ? scoreFromState || 0 : (scoreFromApi ?? 0)
                              return sum + score
                            }, 0)}{' '}
                            / {question.rubricScore.reduce((sum, c) => sum + c.maxPoints, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className='mt-8 border-t pt-6'>
            <h3 className='text-lg font-semibold'>{t('modal.comment')}</h3>

            {isReviewed ? (
              <div className='mt-4 rounded-md border bg-sky-50 p-4'>
                <p className='text-sm text-gray-700 italic'>{feedback || 'Không có nhận xét nào'}</p>
              </div>
            ) : (
              <div className='mt-4'>
                <p className='mb-3 text-sm text-gray-500'>{t('modal.commentSubTitle')}</p>
                <div className='flex items-start gap-3'>
                  <Textarea
                    placeholder={t('modal.commentPlaceholder')}
                    className='flex-1'
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    disabled={isGrading}
                  />
                </div>
                <div className='mt-4 flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    disabled={isGrading}
                    onClick={() => {
                      closeModal()
                      onClose?.()
                    }}
                  >
                    {tc('button.cancel')}
                  </Button>
                  <Button onClick={handleSubmitReview} disabled={isGrading}>
                    {isGrading ? tc('button.submitting') : tc('button.submitReview')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
