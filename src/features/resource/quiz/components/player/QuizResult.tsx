'use client'

import { CheckCircle, XCircle, Award, TrendingUp, RotateCcw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Attempt, Quiz, QuizAttempt } from '@/features/resource/quiz/types/quiz.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetQuiz, setQuizAttemptId } from '@/features/resource/quiz/slice/quiz-player-slice'
import { setMode } from '@/features/resource/lesson/slice/lessonDetailSlice'
import { Progress } from '@/components/shadcn/progress'
import { useCreateQuizAttemptMutation, useGetQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import { useGetStudentQuizByIdQuery } from '@/features/quiz/api/studentQuizApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { formatDate } from '@/utils/index'
import { useLocale, useTranslations } from 'next-intl'

type QuizResultProps = {
  quizId: number
  studentQuizAttempt: Attempt
}

export default function QuizResult({ quizId, studentQuizAttempt }: QuizResultProps) {
  const locale = useLocale()

  const tq = useTranslations('quiz.detail')

  const dispatch = useAppDispatch()
  const [reAttemptQuiz] = useCreateQuizAttemptMutation()

  const { data: quizData, isLoading } = useGetQuizByIdQuery(quizId)
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  }

  const questions = quizData?.data?.questions ?? []

  if (!studentQuizAttempt || !quizData?.data) {
    return null
  }

  const correctAnswersCount = questions.filter((q) => {
    const questionAttempt = studentQuizAttempt.questionAttempts?.find((qa) => qa.questionId === q.id)

    const selectedAnswerIds = questionAttempt?.answerAttempts?.filter((a) => a.isSelected).map((a) => a.answerId) ?? []

    const correctIds = q.answers.filter((a) => a.isCorrect).map((a) => a.id)

    return selectedAnswerIds.length === correctIds.length && selectedAnswerIds.every((id) => correctIds.includes(id))
  }).length

  const scorePercent = Math.round((correctAnswersCount / questions.length) * 100)
  const isPassed = scorePercent >= 70

  const handleRetryAttemptQuiz = async () => {
    const res = await reAttemptQuiz({ studentQuizId: studentQuizAttempt.studentQuizId }).unwrap()
    if (res) {
      dispatch(setQuizAttemptId(res.data.id))
      dispatch(resetQuiz())
    }
  }

  const calculateDuration = (startedAt: string, completedAt?: string) => {
    if (!completedAt) return '00:00'

    const start = new Date(startedAt).getTime()
    const end = new Date(completedAt).getTime()

    const totalSeconds = Math.max(0, Math.floor((end - start) / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return (
    <div className='min-h-screen p-6'>
      <div className='animate-in fade-in-0 slide-in-from-bottom-8 mx-auto w-full max-w-4xl duration-700'>
        {/* Score Card */}
        <Card className='mb-8 overflow-hidden border border-gray-200 bg-white shadow-sm'>
          <div className='divide-y divide-gray-200'>
            <div className='flex items-center justify-between bg-gray-50 px-6 py-3'>
              <span className='text-sm font-medium text-gray-700'>{tq('startedAt')}</span>
              <span className='text-sm text-gray-600'>{formatDate(studentQuizAttempt.startedAt, { locale })}</span>
            </div>
            <div className='flex items-center justify-between px-6 py-3'>
              <span className='text-sm font-medium text-gray-700'>{tq('status')}</span>
              <span className='text-sm text-gray-600'>{tq('complete')}</span>
            </div>
            <div className='flex items-center justify-between bg-gray-50 px-6 py-3'>
              <span className='text-sm font-medium text-gray-700'>{tq('completedAt')}</span>
              <span className='text-sm text-gray-600'>
                {studentQuizAttempt.completedAt ? formatDate(studentQuizAttempt.completedAt, { locale }) : '-'}
              </span>
            </div>
            <div className='flex items-center justify-between px-6 py-3'>
              <span className='text-sm font-medium text-gray-700'>{tq('duration')}</span>
              <span className='text-sm text-gray-600'>
                {calculateDuration(studentQuizAttempt.startedAt, studentQuizAttempt.completedAt)}
              </span>
            </div>
            <div className='flex items-center justify-between bg-gray-50 px-6 py-3'>
              <span className='text-sm font-medium text-gray-700'>{tq('correctAnswers')}</span>
              <span className='text-sm text-gray-600'>
                {correctAnswersCount} / {questions.length}
              </span>
            </div>
            <div className='flex items-center justify-between px-6 py-3'>
              <span className='text-sm font-medium text-gray-700'>{tq('score')}</span>
              <span className='text-sm font-semibold text-gray-900'>{scorePercent}%</span>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className='mb-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-800'>{tq('resultDetail')}</h2>
          <div className='space-y-6'>
            {questions.map((question, index) => {
              const questionAttempt = studentQuizAttempt.questionAttempts?.find((qa) => qa.questionId === question.id)

              const selectedAnswerIds =
                questionAttempt?.answerAttempts?.filter((a) => a.isSelected).map((a) => a.answerId) ?? []

              const correctAnswerIds = question.answers.filter((a) => a.isCorrect).map((a) => a.id)

              const isCorrect =
                selectedAnswerIds.length === correctAnswerIds.length &&
                selectedAnswerIds.every((id) => correctAnswerIds.includes(id))

              return (
                <Card key={index} className='overflow-hidden border border-gray-200 bg-white shadow-sm'>
                  <div className='bg-gray-50 px-6 py-3'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-base font-semibold text-gray-700'>
                        {tq('question.question')} {index + 1}
                      </h3>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm text-gray-500'>{isCorrect ? tq('complete') : tq('incomplete')}</span>
                        <span className='text-sm text-gray-500'> {isCorrect ? '1' : '0'}/1</span>
                        {/* TODO */}
                      </div>
                    </div>
                  </div>

                  <div className='p-6'>
                    {/* Câu hỏi */}
                    <p className='mb-4 text-base text-gray-800'>{question.content}</p>

                    {/* Danh sách đáp án */}
                    <div className='space-y-3'>
                      {question.answers.map((answer) => {
                        const isSelected = selectedAnswerIds.includes(answer.id)
                        const isCorrectAnswer = answer.isCorrect

                        return (
                          <div
                            key={answer.id}
                            className={`flex items-start gap-3 rounded-lg border p-3 ${
                              isSelected && isCorrectAnswer
                                ? 'border-green-300 bg-green-50'
                                : isSelected && !isCorrectAnswer
                                  ? 'border-red-300 bg-red-50'
                                  : isCorrectAnswer
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 bg-white'
                            }`}
                          >
                            {/* Radio button */}
                            <div className='mt-0.5 flex-shrink-0'>
                              <div
                                className={`h-5 w-5 rounded-full border-2 ${
                                  isSelected
                                    ? isCorrectAnswer
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-red-500 bg-red-500'
                                    : isCorrectAnswer
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-gray-300 bg-white'
                                }`}
                              >
                                {(isSelected || isCorrectAnswer) && (
                                  <div className='flex h-full items-center justify-center'>
                                    <div className='h-2 w-2 rounded-full bg-white'></div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Nội dung đáp án */}
                            <div className='flex-1'>
                              <p className='text-sm text-gray-800'>{answer.content}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Giải thích (nếu có) */}
                    {question.answerExplanation && (
                      <div className='mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3'>
                        <p className='text-sm text-blue-900'>{question.answerExplanation}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
