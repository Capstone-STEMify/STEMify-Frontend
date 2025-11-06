'use client'

import { CheckCircle, XCircle, Award, TrendingUp, RotateCcw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetQuiz, setQuizAttemptId } from '@/features/resource/quiz/slice/quiz-player-slice'
import { setMode } from '@/features/resource/lesson/slice/lessonDetailSlice'
import { Progress } from '@/components/shadcn/progress'
import { useCreateQuizAttemptMutation } from '@/features/resource/quiz/api/quizApi'

type QuizResultProps = {
  quiz: Quiz
}

export default function QuizResult({ quiz }: QuizResultProps) {
  const dispatch = useAppDispatch()
  const { userAnswers, studentQuizId } = useAppSelector((state) => state.quizPlayer)
  const questions = quiz.questions
  const [reAttemptQuiz] = useCreateQuizAttemptMutation()

  const correctAnswersCount = questions.filter((q) => {
    const chosen = userAnswers[q.id] ?? []
    const chosenArray = Array.isArray(chosen) ? chosen : [chosen]
    const correctIds = q.answers.filter((a) => a.isCorrect).map((a) => a.id)
    return chosenArray.length === correctIds.length && chosenArray.map(Number).every((id) => correctIds.includes(id))
  }).length

  const scorePercent = Math.round((correctAnswersCount / questions.length) * 100)
  const isPassed = scorePercent >= 70

  const handleRetryAttemptQuiz = async () => {
    const res = await reAttemptQuiz({ studentQuizId: studentQuizId! }).unwrap()
    if (res) {
      dispatch(setQuizAttemptId(res.data.id))
      dispatch(resetQuiz())
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6'>
      <div className='animate-in fade-in-0 slide-in-from-bottom-8 mx-auto w-full max-w-4xl duration-700'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div
            className={`mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full shadow-2xl ${
              isPassed
                ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                : 'bg-gradient-to-br from-orange-400 to-amber-600'
            }`}
          >
            {isPassed ? <Award className='h-12 w-12 text-white' /> : <TrendingUp className='h-12 w-12 text-white' />}
          </div>
          <h1 className='mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-5xl font-bold text-transparent'>
            {isPassed ? 'Xuất sắc! 🎉' : 'Hoàn thành! 👍'}
          </h1>
          <p className='text-lg text-gray-600'>{isPassed ? 'Bạn đã vượt qua bài kiểm tra' : 'Tiếp tục cố gắng nhé!'}</p>
        </div>

        {/* Score Card */}
        <Card className='mb-8 overflow-hidden border-none bg-white shadow-2xl'>
          <div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white'>
            <p className='mb-2 text-sm tracking-wide uppercase opacity-90'>Điểm của bạn</p>
            <div className='mb-4 text-7xl font-bold'>{scorePercent}%</div>
            <div className='flex items-center justify-center gap-8'>
              <div>
                <p className='text-2xl font-bold'>{correctAnswersCount}</p>
                <p className='text-sm opacity-90'>Câu đúng</p>
              </div>
              <div className='h-12 w-px bg-white/30' />
              <div>
                <p className='text-2xl font-bold'>{questions.length - correctAnswersCount}</p>
                <p className='text-sm opacity-90'>Câu sai</p>
              </div>
              <div className='h-12 w-px bg-white/30' />
              <div>
                <p className='text-2xl font-bold'>{questions.length}</p>
                <p className='text-sm opacity-90'>Tổng số câu</p>
              </div>
            </div>
          </div>
          <div className='p-6'>
            <Progress value={scorePercent} className='h-3' />
          </div>
        </Card>

        {/* Results Summary */}
        <div className='mb-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-800'>Chi tiết kết quả</h2>
          <div className='space-y-4'>
            {questions.map((question, index) => {
              const chosen = userAnswers[question.id] ?? []
              const chosenArray = Array.isArray(chosen) ? chosen : [chosen]
              const correctIds = question.answers.filter((a) => a.isCorrect).map((a) => a.id)
              const isCorrect =
                chosenArray.length === correctIds.length &&
                chosenArray.map(Number).every((id) => correctIds.includes(id))

              return (
                <Card
                  key={index}
                  className={`overflow-hidden border-l-4 transition-all hover:shadow-lg ${
                    isCorrect
                      ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                      : 'border-l-red-500 bg-gradient-to-r from-red-50 to-pink-50'
                  }`}
                >
                  <div className='flex items-start gap-4 p-6'>
                    <div className='mt-1 flex-shrink-0'>
                      {isCorrect ? (
                        <div className='rounded-full bg-green-500 p-2'>
                          <CheckCircle className='h-5 w-5 text-white' />
                        </div>
                      ) : (
                        <div className='rounded-full bg-red-500 p-2'>
                          <XCircle className='h-5 w-5 text-white' />
                        </div>
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-3'>
                        <span className='font-semibold text-gray-500'>Câu {index + 1}</span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${
                            isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {isCorrect ? '✓ Đúng' : '✗ Sai'}
                        </span>
                      </div>
                      <p className='mb-3 text-base font-medium text-gray-800'>{question.content}</p>

                      {/* Đáp án đúng */}
                      <div className='mb-2'>
                        <p className='mb-1 text-sm font-semibold text-green-700'>Đáp án đúng:</p>
                        <ul className='space-y-1'>
                          {question.answers
                            .filter((a) => a.isCorrect)
                            .map((a) => (
                              <li key={a.id} className='flex items-center gap-2 text-sm text-green-600'>
                                <CheckCircle className='h-4 w-4' />
                                {a.content}
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Đáp án người dùng chọn (nếu sai) */}
                      {!isCorrect && chosenArray.length > 0 && (
                        <div>
                          <p className='mb-1 text-sm font-semibold text-red-700'>Bạn đã chọn:</p>
                          <ul className='space-y-1'>
                            {question.answers
                              .filter((a) => chosenArray.includes(a.id))
                              .map((a) => (
                                <li key={a.id} className='flex items-center gap-2 text-sm text-red-600'>
                                  <XCircle className='h-4 w-4' />
                                  {a.content}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {/* Giải thích (nếu có) */}
                      {question.answerExplanation && (
                        <div className='mt-3 rounded-lg bg-blue-50 p-3'>
                          <p className='mb-1 text-sm font-semibold text-blue-900'>💡 Giải thích:</p>
                          <p className='text-sm text-blue-800'>{question.answerExplanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Button
            size='lg'
            className='group bg-gradient-to-r from-indigo-600 to-purple-600 py-6 text-lg font-bold shadow-xl transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl'
            onClick={() => dispatch(setMode('normal'))}
          >
            Học phần tiếp theo
            <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='group border-2 border-indigo-300 bg-white py-6 text-lg font-bold text-indigo-600 shadow-xl transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-2xl'
            onClick={handleRetryAttemptQuiz}
          >
            <RotateCcw className='mr-2 h-5 w-5 transition-transform group-hover:rotate-180' />
            Làm lại bài quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
