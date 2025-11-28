'use client'
import React, { useEffect, useMemo, useState } from 'react'
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
import { Clock, HelpCircle, X } from 'lucide-react'
import { format } from 'date-fns'

type Props = {
  studentAssignmentId: number | null
  onClose: () => void
  onSuccess?: () => void
}

export default function GradeAssignmentModal({ studentAssignmentId, onClose, onSuccess }: Props) {
  // --- API QUERIES ---
  const { data: detailResponse, isLoading: isLoadingDetail } = useGetStudentAssignmentByIdQuery(
    studentAssignmentId ?? undefined,
    { skip: !studentAssignmentId }
  )

  const attemptData = detailResponse?.data ? detailResponse.data.attempts[0] : undefined
  const assignmentId = detailResponse?.data?.assignmentId

  const { data: assignmentRes, isLoading: isLoadingAssignment } = useGetAssignmentByIdQuery(
    assignmentId as string | number,
    { skip: !assignmentId }
  )

  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(
    detailResponse?.data.studentId as string | number,
    { skip: !detailResponse?.data.studentId }
  )

  const [gradeAssignment, { isLoading: isGrading }] = useGradeAssignmentAttemptMutation()

  const [scores, setScores] = useState<Record<number, Record<number, number | null>>>({})
  const [feedbackText, setFeedbackText] = useState('')

  const questionMap = useMemo(() => {
    if (!assignmentRes?.data?.questions) return {}
    return assignmentRes.data.questions.reduce(
      (acc, q) => {
        acc[q.id] = q
        return acc
      },
      {} as Record<number, any>
    )
  }, [assignmentRes])

  useEffect(() => {
    if (!attemptData || !attemptData.questionAttempts) return

    const initialScores: Record<number, Record<number, number | null>> = {}
    attemptData.questionAttempts.forEach((qAttempt) => {
      initialScores[qAttempt.id] = {}
      qAttempt.rubricScore.forEach((criterion) => {
        // accept either `currentPoints` or `points` depending on API response
        initialScores[qAttempt.id][criterion.rubricCriterionId] = (criterion as any).currentPoints ?? (criterion as any).points ?? null
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
        [qAttemptId]: { ...prev[qAttemptId], [criterionId]: null }
      }))
      return
    }

    const numPoints = parseInt(points, 10)
    if (isNaN(numPoints) || numPoints < 0) return

    setScores((prev) => ({
      ...prev,
      [qAttemptId]: { ...prev[qAttemptId], [criterionId]: numPoints }
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
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit grading')
    }
  }

  const calculateQuestionTotal = (qAttemptId: number) => {
    const questionScores = scores[qAttemptId]
    if (!questionScores) return 0
    return Object.values(questionScores).reduce((acc, curr) => (acc || 0) + (curr || 0), 0) || 0
  }

  const calculateMaxPoints = (rubricScores: any[]) => {
    return rubricScores.reduce((acc, curr) => acc + curr.maxPoints, 0)
  }

  if (isLoadingDetail || isLoadingAssignment || userLoading) return <Loading />

  if (!attemptData)
    return (
      <div className='p-6 text-center text-red-500'>
        Missing attempt data. <Button onClick={onClose} variant="link">Close</Button>
      </div>
    )

  const userName = userData?.data ? userData.data.firstName + ' ' + userData.data.lastName : 'Student'
  const studentInitials = userName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
  const assignmentTitle = assignmentRes?.data?.title || 'Assignment'
  const submittedDate = attemptData.submittedAt ? new Date(attemptData.submittedAt).toLocaleString() : 'N/A'
  const totalQuestions = assignmentRes?.data?.questions?.length || 0

  return (
    <div className='flex h-[90vh] w-full flex-col bg-white'>
      {/* --- HEADER --- */}
      <div className='flex-none border-b px-6 py-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10 border bg-gray-100'>
              <AvatarFallback className='text-sm font-semibold text-slate-600'>{studentInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className='font-bold text-slate-900'>{userName}</div>
              <div className='text-xs text-slate-500'>Student</div>
            </div>
          </div>
          <button onClick={onClose} className='rounded-full p-1 hover:bg-slate-100'>
            <X className='h-5 w-5 text-slate-500' />
          </button>
        </div>

        <div className='mt-4'>
          <h1 className='text-2xl font-bold text-slate-900'>{assignmentTitle}</h1>
          <div className='mt-2 flex items-center gap-4 text-sm text-slate-500'>
            <span className='flex items-center gap-1'>
               Submitted: <span className='font-medium text-slate-700'>{submittedDate}</span>
            </span>
            <span className='flex items-center gap-1'>
              <HelpCircle className='h-4 w-4' /> {totalQuestions} Questions
            </span>
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className='flex-1 overflow-y-auto bg-gray-50/50 p-6'>
        <div className='mx-auto max-w-5xl space-y-6'>
          {attemptData.questionAttempts.map((qAttempt, index) => {
            // Lấy thông tin câu hỏi gốc từ map
            const originalQuestion = questionMap[qAttempt.assignmentQuestionId]
            const questionTitle = originalQuestion 
                ? `Câu hỏi ${originalQuestion.orderIndex}` 
                : `Question #${index + 1}`
            const questionContent = originalQuestion?.content || ''
            
            const currentTotalScore = (() => {
              const questionScores = scores[qAttempt.id]
              if (questionScores) {
                return Object.values(questionScores).reduce((acc, curr) => (acc || 0) + (curr || 0), 0) || 0
              }
              // fallback to API values
              return qAttempt.rubricScore.reduce((acc: number, c: any) => acc + ((c.currentPoints ?? c.points) || 0), 0)
            })()
            const maxQuestionScore = calculateMaxPoints(qAttempt.rubricScore)

            return (
              <div key={qAttempt.id} className='overflow-hidden rounded-lg border bg-white shadow-sm'>
                {/* Question Header */}
                <div className='border-b bg-slate-50 px-6 py-3 text-base font-bold text-slate-800'>
                  {questionTitle}
                </div>

                <div className='grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0'>
                  {/* Left Column: Answer */}
                  <div className='p-6'>
                    <div className='mb-3 text-xs font-bold uppercase text-slate-400'>CÂU TRẢ LỜI</div>
                    {questionContent && (
                        <div className='mb-4 text-sm font-medium text-slate-700 italic border-l-2 border-slate-200 pl-3'>
                            {questionContent}
                        </div>
                    )}
                    <div className='text-slate-800 whitespace-pre-wrap'>
                      {qAttempt.answerText || <span className='text-gray-400 italic'>No answer provided</span>}
                    </div>
                  </div>

                  {/* Right Column: Rubric */}
                  <div className='flex flex-col p-6'>
                    <div className='mb-4 flex items-center justify-between'>
                        <div className='text-xs font-bold uppercase text-slate-400'>RUBRIC</div>
                        <div className='text-xs font-semibold text-slate-500'>{maxQuestionScore} Points</div>
                    </div>
                    
                    <div className='flex-1 space-y-5'>
                      {qAttempt.rubricScore.map((criterion) => (
                        <div key={criterion.rubricCriterionId} className='space-y-1.5'>
                          <div className='flex items-center justify-between'>
                             <span className='text-sm font-medium text-slate-700'>{criterion.criterionName}</span>
                             <span className='text-xs text-slate-400 italic'>(Điểm tối đa: {criterion.maxPoints})</span>
                          </div>
                          
                          <div className='relative'>
                            <Input
                              type="number"
                              className='h-10 w-full rounded-md border-slate-200 bg-slate-50 pr-4 text-slate-900 focus:bg-white'
                              value={
                                // prefer edited state, otherwise fallback to API fields
                                scores[qAttempt.id] && scores[qAttempt.id][criterion.rubricCriterionId] != null
                                  ? String(scores[qAttempt.id][criterion.rubricCriterionId])
                                  : String((criterion as any).currentPoints ?? (criterion as any).points ?? '')
                              }
                              onChange={(e) => handleScoreChange(qAttempt.id, criterion.rubricCriterionId, e.target.value)}
                              placeholder="Nhập điểm"
                              min={0}
                              max={criterion.maxPoints}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='mt-6 border-t pt-4'>
                        <div className='flex items-center justify-between text-sm'>
                             <span className='font-medium text-slate-600'>Tổng điểm cho câu hỏi:</span>
                             <span className='font-bold text-slate-900'>{currentTotalScore} / {maxQuestionScore}</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Feedback Section */}
          <div className='mt-8'>
            <h3 className='mb-2 text-lg font-bold text-slate-800'>Nhận xét</h3>
            <p className='mb-3 text-sm text-slate-500'>
              Các nhận xét dành cho học viên chỉ được hiển thị với học viên đó và người đã để lại nhận xét.
            </p>
            <Textarea 
                className='min-h-[120px] resize-y rounded-lg border-slate-200 p-4 text-slate-800 focus:ring-primary'
                value={feedbackText} 
                onChange={(e) => setFeedbackText(e.target.value)} 
                placeholder="Chia sẻ suy nghĩ của bạn..."
            />
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className='flex-none border-t bg-white p-4 md:px-8'>
        <div className='mx-auto flex max-w-5xl justify-end gap-3'>
          <Button variant='outline' onClick={onClose} disabled={isGrading} className="h-10 min-w-[80px]">
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isGrading} className="h-10 bg-blue-500 hover:bg-blue-600 text-white min-w-[120px]">
            {isGrading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
          </Button>
        </div>
      </div>
    </div>
  )
}