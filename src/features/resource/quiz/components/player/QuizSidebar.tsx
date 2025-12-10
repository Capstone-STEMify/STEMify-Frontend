'use client'

import { Clock, BookOpen, Target, TrendingUp } from 'lucide-react'
import { Card } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setCurrentQuestionIndex } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { useEffect, useState } from 'react'

type QuizSidebarProps = {
  quiz: Quiz
}

export default function QuizSidebar({ quiz }: QuizSidebarProps) {
  const dispatch = useAppDispatch()
  const questions = quiz.questions
  const { currentQuestionIndex, isSubmitted, userAnswers } = useAppSelector((state) => state.quizPlayer)
  const totalTime = quiz.timeLimitMinutes * 60
  const [timeLeft, setTimeLeft] = useState(totalTime)

  useEffect(() => {
    if (isSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  const answeredCount = Object.keys(userAnswers).length
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100
  const timeProgressPercent = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <aside className='hidden w-80 flex-col gap-6 overflow-y-auto border-r bg-gradient-to-b from-slate-50 to-white p-6 shadow-lg md:flex'>
      {/* Header */}
      <div className='rounded-2xl p-6 shadow-md'>
        <div className='mb-2 flex items-center gap-2'>
          <BookOpen className='h-6 w-6' />
          <h1 className='text-2xl font-bold'>Quiz Challenge</h1>
        </div>
        <p>Kiểm tra kiến thức của bạn</p>
      </div>

      {/* Timer Card */}
      {timeLeft > 0 && (
        <Card className='overflow-hidden shadow-md transition-all hover:shadow-lg'>
          <div className='p-5'>
            <div className='mb-3 flex items-center gap-2'>
              <div className='rounded-full border border-black p-2'>
                <Clock className='h-4 w-4' />
              </div>
              <span className='font-semibold text-gray-700'>Thời gian còn lại</span>
            </div>
            <div className='text-3xl font-bold'>{formatTime(timeLeft)}</div>
            <div className='mt-3 h-2 w-full overflow-hidden rounded-full bg-sky-200'>
              <div className='h-full' style={{ width: `${timeProgressPercent}%` }} />
            </div>
          </div>
        </Card>
      )}

      {/* Question Navigation */}
      <div>
        <p className='mb-4 font-semibold text-gray-700'>Chọn câu hỏi</p>
        <div className='grid grid-cols-6 gap-1'>
          {questions.map((q, index) => {
            const isAnswered = userAnswers[q.id] !== undefined
            const isCurrent = index === currentQuestionIndex

            return (
              <Button
                key={index}
                onClick={() => dispatch(setCurrentQuestionIndex(index))}
                variant='outline'
                size='sm'
                className={`relative aspect-square overflow-hidden border-1 font-bold transition-all duration-300 ${
                  isCurrent
                    ? 'bg-sky-50 shadow-lg'
                    : isAnswered
                      ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
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
    </aside>
  )
}
