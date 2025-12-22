import { QuizContent } from '@/features/resource/content/types/content.type'
import React, { useEffect, useState } from 'react'
import { Clock, Trophy, CheckCircle, AlertCircle, Loader2, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/shadcn/card'
import {
  useCreateQuizAttemptMutation,
  useGetQuizByIdQuery,
  useGetStudentQuizByIdQuery
} from '@/features/resource/quiz/api/quizApi'
import { Checkbox } from '@/components/shadcn/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { QuestionType } from '@/features/resource/question/types/question.type'
import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setMode } from '@/features/resource/lesson/slice/lessonDetailSlice'
import {
  setQuizAttemptId,
  setSelectedQuiz,
  setStudentQuizId,
  setStartedAt,
  setTimeRemaining
} from '@/features/resource/quiz/slice/quiz-player-slice'
import QuizAttemptComponent from '@/features/resource/quiz/components/viewer/QuizAttempt'
import { Attempt, QuizAttempt } from '@/features/resource/quiz/types/quiz.type'
import { LicenseType, UserRole } from '@/types/userRole'
import { useLocale, useTranslations } from 'next-intl'
import { PaginatedResult } from '@/types/baseModel'
import { StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { useParams, useRouter } from 'next/navigation'
import { formatDate } from '@/utils/index'

type QuizViewerProps = {
  quiz: QuizContent
  isShowQuestionAnswer?: boolean
  studentQuizId?: number
  sectionStatus?: PaginatedResult<StudentProgress>
}

export default function QuizViewer({ quiz, isShowQuestionAnswer, studentQuizId, sectionStatus }: QuizViewerProps) {
  const tq = useTranslations('quiz.detail')
  const tc = useTranslations('common')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const locale = useLocale()

  const { lessonId } = useParams()
  const selectedQuiz = useAppSelector((state) => state.quizPlayer.selectedQuiz)
  const {
    data: studentQuiz,
    isLoading: isLoadingStudentQuiz,
    refetch
  } = useGetStudentQuizByIdQuery(studentQuizId!, { skip: !studentQuizId })

  function isAllowedAttempt(studentQuiz?: QuizAttempt): boolean {
    const now = new Date()
    const attemptCount = studentQuiz?.attemptCount ?? 0
    const nextAvailableAt = studentQuiz?.nextAttemptAvailableAt ? new Date(studentQuiz.nextAttemptAvailableAt) : null

    if (!studentQuiz?.maxAttemptAllowed) return true
    if (attemptCount >= studentQuiz?.maxAttemptAllowed && (!nextAvailableAt || nextAvailableAt > now)) return false

    return true
  }

  const { data: quizData, isLoading } = useGetQuizByIdQuery(quiz.quizId, { skip: !quiz.quizId })
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null)
  const role = useAppSelector((state) => state.selectedOrganization.currentRole)
  if (role === LicenseType.TEACHER) {
    isShowQuestionAnswer = true
  }

  const [createQuizAttempt, { isLoading: isCreating }] = useCreateQuizAttemptMutation()

  useEffect(() => {
    if (studentQuizId) {
      dispatch(setStudentQuizId(studentQuizId))
      if (quizData?.data) {
        dispatch(setSelectedQuiz(quizData.data))
      }
    }
  }, [dispatch, studentQuizId, quizData?.data])

  if (isLoading) {
    return (
      <div className='space-y-5'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-48 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className='flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-8'>
        <div className='text-center'>
          <AlertCircle className='mx-auto mb-2 h-12 w-12 text-amber-500' />
          <p className='text-lg font-medium text-amber-900'>Không có dữ liệu bài kiểm tra</p>
        </div>
      </div>
    )
  }

  const questions = quizData.data.questions

  const handleAttemptQuiz = async () => {
    if (!studentQuizId) return
    const res = await createQuizAttempt({ studentQuizId }).unwrap()
    if (res) {
      dispatch(setStudentQuizId(studentQuizId))

      // Set startedAt and calculate timeRemaining from response
      if (res.data.startedAt) {
        const startedAtTimestamp = new Date(res.data.startedAt).getTime()
        const timeLimitSec = (quizData?.data?.timeLimitMinutes || 0) * 60
        const elapsed = Math.floor((Date.now() - startedAtTimestamp) / 1000)
        const remaining = Math.max(0, timeLimitSec - elapsed)

        dispatch(setStartedAt(startedAtTimestamp))
        dispatch(setTimeRemaining(remaining))
      }

      router.push(`/${locale}/resource/lesson/${lessonId}/quiz/${res.data.id}`)
    }
  }

  // TODDO: fix later
  // const canStartQuiz = !isShowQuestionAnswer && quizStatus !== 'Completed' && quizStatus !== 'Locked'

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-8'>
      {/* Quiz Header */}
      <div className='space-y-4'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>{quiz.quizTitle}</h1>
          {
            <p className='text-base text-gray-600'>
              {tq('dueDate')}: {formatDate(studentQuiz?.data.dueDate, { locale })}
            </p>
          }
        </div>

        {/* Quiz Stats Card */}
        <Card className='border-gray-200 shadow-sm'>
          <CardContent className='p-0'>
            <div className='grid grid-cols-4 divide-x divide-gray-200'>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-amber-100 p-3'>
                  <Trophy className='h-6 w-6 text-amber-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{tq('passingMarks')}</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {quiz.passingMarks}/{quiz.totalMarks}
                </p>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-green-100 p-3'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{tq('maxAttempt')}</p>
                <p className='text-2xl font-bold text-gray-900'>{quiz.maxAttempt ?? '3'}</p>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-sky-100 p-3'>
                  <Clock className='h-6 w-6 text-sky-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{tq('timeLimit')}</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {quiz.timeLimitInMinutes ? `${quiz.timeLimitInMinutes} ${tq('mins')}` : '-'}
                </p>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 p-6'>
                <div className='rounded-full bg-red-100 p-3'>
                  <Target className='h-6 w-6 text-red-600' />
                </div>
                <p className='text-sm font-medium text-gray-600'>{tq('length')}</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {questions.length} {tq('question.question')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attempt Limit Reached Card */}
      {isAllowedAttempt(studentQuiz?.data) && !isShowQuestionAnswer ? (
        <div className='flex justify-center'>
          <Button onClick={handleAttemptQuiz} className='text-md px-6 py-5 font-medium' disabled={isCreating}>
            {isCreating ? <Loader2 className='mr-2 h-5 w-5 animate-spin' /> : tc('button.startQuiz')}
          </Button>
        </div>
      ) : (
        studentQuiz && (
          <Card className='border-orange-200 bg-orange-50 shadow-md'>
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <div className='rounded-full bg-orange-100 p-3'>
                  <AlertCircle className='h-6 w-6 text-orange-600' />
                </div>
                <div className='flex-1 space-y-2'>
                  <h3 className='text-lg font-semibold text-orange-900'>Đã đạt giới hạn số lần làm bài</h3>
                  <p className='text-sm text-orange-800'>
                    Bạn đã hoàn thành {studentQuiz.data.attemptCount}/{studentQuiz.data.maxAttemptAllowed} lần làm bài.
                  </p>
                  {studentQuiz.data.nextAttemptAvailableAt && (
                    <p className='text-sm font-medium text-orange-900'>
                      Bạn có thể làm lại lúc:{' '}
                      <span className='font-bold'>
                        {new Date(studentQuiz.data.nextAttemptAvailableAt).toLocaleString('vi-VN', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Questions Section */}
      {isShowQuestionAnswer ? (
        <div className='space-y-4'>
          <div className='flex items-center gap-2 border-b border-gray-200 pb-3'>
            <h2 className='text-xl font-semibold text-gray-900'>{tq('question.question')}</h2>
            <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'>
              {questions.length}
            </span>
          </div>

          <div className='space-y-4'>
            {questions.map((question, index) => {
              const isMultipleChoice = question.questionType === QuestionType.MULTIPLE_CHOICE
              const correctAnswers = question.answers.filter((a) => a.isCorrect)

              return (
                <Card key={question.id} className='border-gray-200 shadow-sm transition-shadow hover:shadow-md'>
                  <CardContent className='space-y-4 p-6'>
                    {/* Question Header */}
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='mb-1 flex items-start gap-2'>
                          <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700'>
                            {index + 1}
                          </span>
                          <h3 className='flex-1 pt-0.5 text-lg leading-relaxed font-medium text-gray-900'>
                            {question.content}
                          </h3>
                        </div>
                      </div>
                      <div className='flex shrink-0 items-center gap-2 rounded-full bg-purple-100 px-3 py-1'>
                        <Trophy className='h-4 w-4 text-purple-600' />
                        <span className='text-sm font-semibold text-purple-700'>
                          {question.points} {tq('question.pts')}
                        </span>
                      </div>
                    </div>

                    {/* Question Type Badge */}
                    <div className='flex items-center gap-2'>
                      <span className='inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700'>
                        {tq(`question.${question.questionType.toLowerCase()}`)}
                      </span>
                      {correctAnswers.length > 1 && (
                        <span className='text-xs text-gray-500'>({correctAnswers.length} câu đúng)</span>
                      )}
                    </div>

                    {/* Answer Options */}
                    <div className='space-y-2.5 pl-1'>
                      {isMultipleChoice ? (
                        question.answers.map((answer) => (
                          <div
                            key={answer.id}
                            className={`flex items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                              answer.isCorrect
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <Checkbox
                              id={`answer-${answer.id}`}
                              checked={answer.isCorrect}
                              disabled
                              className='mt-0.5 disabled:cursor-default disabled:opacity-100'
                            />
                            <Label
                              htmlFor={`answer-${answer.id}`}
                              className={`flex-1 cursor-default text-base leading-relaxed ${
                                answer.isCorrect ? 'font-medium text-green-900' : 'text-gray-700'
                              }`}
                            >
                              {answer.content}
                              {answer.isCorrect && <CheckCircle className='ml-2 inline h-4 w-4 text-green-600' />}
                            </Label>
                          </div>
                        ))
                      ) : (
                        // Single choice - use radio buttons
                        <RadioGroup value={question.answers.find((a) => a.isCorrect)?.id.toString()} disabled>
                          {question.answers.map((answer) => (
                            <div
                              key={answer.id}
                              className={`flex items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                                answer.isCorrect
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <RadioGroupItem
                                value={answer.id.toString()}
                                id={`answer-${answer.id}`}
                                disabled
                                className='mt-0.5 disabled:cursor-default disabled:opacity-100'
                              />
                              <Label
                                htmlFor={`answer-${answer.id}`}
                                className={`flex-1 cursor-default text-base leading-relaxed ${
                                  answer.isCorrect ? 'font-medium text-green-900' : 'text-gray-700'
                                }`}
                              >
                                {answer.content}
                                {answer.isCorrect && <CheckCircle className='ml-2 inline h-4 w-4 text-green-600' />}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>

                    {/* Explanation */}
                    {question.answerExplanation && (
                      <div className='rounded-lg bg-blue-50 p-4'>
                        <div className='mb-1.5 flex items-center gap-2'>
                          <AlertCircle className='h-4 w-4 text-blue-600' />
                          <h4 className='text-sm font-semibold text-blue-900'>Giải thích</h4>
                        </div>
                        <p className='text-sm leading-relaxed text-blue-800'>{question.answerExplanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ) : null}

      {studentQuizId && (
        <QuizAttemptComponent
          studentQuizId={studentQuizId}
          selectedAttempt={selectedAttempt}
          onSelectAttempt={setSelectedAttempt}
          totalQuestions={questions.length}
        />
      )}
    </div>
  )
}
