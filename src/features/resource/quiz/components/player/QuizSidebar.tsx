'use client'

import { Clock, BookOpen, Target, TrendingUp } from 'lucide-react'
import { Card } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { decrementTime, setCurrentQuestionIndex } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { useEffect } from 'react'

type QuizSidebarProps = {
  quiz: Quiz
}

export default function QuizSidebar({ quiz }: QuizSidebarProps) {
  const questions = quiz.questions
  const { currentQuestionIndex, timeRemaining, isSubmitted, userAnswers } = useAppSelector((state) => state.quizPlayer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isSubmitted) return
    const timer = setInterval(() => {
      dispatch(decrementTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [dispatch, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(userAnswers).length
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <aside className='hidden w-80 flex-col gap-6 overflow-y-auto border-r bg-gradient-to-b from-slate-50 to-white p-6 shadow-lg md:flex'>
      {/* Header */}
      <div className='rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-xl'>
        <div className='mb-2 flex items-center gap-2'>
          <BookOpen className='h-6 w-6' />
          <h1 className='text-2xl font-bold'>Quiz Challenge</h1>
        </div>
        <p className='text-indigo-100'>Kiểm tra kiến thức của bạn</p>
      </div>

      {/* Timer Card */}
      <Card className='overflow-hidden border-none bg-gradient-to-br from-orange-50 to-red-50 shadow-md transition-all hover:shadow-lg'>
        <div className='p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='rounded-full bg-orange-500 p-2'>
              <Clock className='h-4 w-4 text-white' />
            </div>
            <span className='font-semibold text-gray-700'>Thời gian còn lại</span>
          </div>
          <div className='text-4xl font-bold text-orange-600'>{formatTime(timeRemaining)}</div>
          <div className='mt-3 h-2 w-full overflow-hidden rounded-full bg-orange-200'>
            <div
              className='h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000'
              style={{ width: `${(timeRemaining / (quiz.timeLimitMinutes * 60)) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 gap-4'>
        <Card className='border-none bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-md transition-all hover:shadow-lg'>
          <div className='mb-2 flex items-center gap-2'>
            <Target className='h-4 w-4 text-blue-600' />
            <p className='text-xs font-medium text-gray-600'>Tổng số câu</p>
          </div>
          <p className='text-3xl font-bold text-blue-600'>{questions.length}</p>
        </Card>

        <Card className='border-none bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-md transition-all hover:shadow-lg'>
          <div className='mb-2 flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-green-600' />
            <p className='text-xs font-medium text-gray-600'>Đã trả lời</p>
          </div>
          <p className='text-3xl font-bold text-green-600'>{answeredCount}</p>
        </Card>
      </div>

      {/* Question Navigation */}
      <div>
        <p className='mb-4 font-semibold text-gray-700'>Chọn câu hỏi</p>
        <div className='grid grid-cols-5 gap-2'>
          {questions.map((q, index) => {
            const isAnswered = userAnswers[q.id] !== undefined
            const isCurrent = index === currentQuestionIndex

            return (
              <Button
                key={index}
                onClick={() => dispatch(setCurrentQuestionIndex(index))}
                variant='outline'
                size='sm'
                className={`relative aspect-square overflow-hidden border-2 font-bold transition-all duration-300 ${
                  isCurrent
                    ? 'scale-110 border-indigo-600 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                    : isAnswered
                      ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
                } `}
              >
                {index + 1}
                {isAnswered && !isCurrent && (
                  <div className='absolute top-0 right-0 h-2 w-2 rounded-bl-lg bg-green-500' />
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Progress */}
      <div className='mt-auto rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-5 shadow-md'>
        <div className='mb-3 flex items-center justify-between'>
          <span className='text-sm font-semibold text-gray-600'>Tiến độ hoàn thành</span>
          <span className='text-lg font-bold text-purple-600'>
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        <div className='h-3 w-full overflow-hidden rounded-full bg-purple-200'>
          <div
            className='h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500 ease-out'
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className='mt-2 text-center text-sm font-medium text-purple-600'>{Math.round(progressPercent)}%</p>
      </div>
    </aside>
  )
}
