'use client'

import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { useQuiz } from '@/features/resource/section/components/quiz/components/quiz-context'
import { Clock } from 'lucide-react'

export default function QuizSidebar() {
  const { questions, currentQuestionIndex, timeRemaining, setCurrentQuestionIndex } = useQuiz()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <aside className='bg-sidebar border-sidebar-border hidden w-64 flex-col gap-6 overflow-y-auto border-r p-6 md:flex'>
      {/* Header */}
      <div>
        <h1 className='text-sidebar-foreground mb-2 text-2xl font-bold'>Quiz</h1>
        <p className='text-sidebar-foreground/60 text-sm'>Kiểm tra kiến thức của bạn</p>
      </div>

      {/* Timer */}
      <Card className='bg-primary/10 border-primary/20 rounded-lg p-4'>
        <div className='flex gap-2'>
          <Clock className='text-primary h-5 w-5' />
          <span className='text-sidebar-foreground text-sm font-medium'>Thời gian còn lại</span>
        </div>
        <div className='text-primary text-3xl font-bold'>{formatTime(timeRemaining)}</div>
      </Card>

      {/* Question Count */}
      <Card className='bg-secondary/10 border-secondary/20 p-4'>
        <p className='text-sidebar-foreground/60 mb-2 text-sm'>Tổng số câu hỏi</p>
        <p className='text-secondary text-2xl font-bold'>{questions.length}</p>
      </Card>

      {/* Question Navigation */}
      <div>
        <p className='text-sidebar-foreground mb-3 text-sm font-medium'>Chọn câu hỏi</p>
        <div className='grid grid-cols-4 gap-2'>
          {questions.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              variant={index === currentQuestionIndex ? 'default' : 'outline'}
              size='sm'
              className={`aspect-square text-sm font-semibold transition-all ${
                index === currentQuestionIndex ? 'scale-105 shadow-lg' : ''
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className='mt-auto'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-sidebar-foreground/60 text-xs'>Tiến độ</span>
          <span className='text-primary text-xs font-semibold'>
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        <div className='bg-sidebar-border h-2 w-full rounded-full'>
          <div
            className='bg-primary h-2 rounded-full transition-all duration-300'
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  )
}
