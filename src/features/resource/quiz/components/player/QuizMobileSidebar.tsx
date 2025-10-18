'use client'

import { Clock, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setCurrentQuestionIndex } from '@/features/resource/quiz/slice/quiz-player-slice'

export default function QuizMobileSidebar() {
  const { questions, currentQuestionIndex, timeRemaining } = useAppSelector((state) => state.quizPlayer)
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Mobile Header */}
      <div className='bg-sidebar border-sidebar-border fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b p-4 md:hidden'>
        <div className='flex items-center gap-3'>
          <Clock className='text-primary h-5 w-5' />
          <div>
            <p className='text-sidebar-foreground/60 text-xs'>Thời gian</p>
            <p className='text-primary text-lg font-bold'>{formatTime(timeRemaining)}</p>
          </div>
        </div>

        <Button onClick={() => setIsOpen(!isOpen)} variant='ghost' size='icon' className='p-2'>
          {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </Button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className='pointer-events-auto fixed inset-0 z-40 bg-black/50 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`bg-sidebar border-sidebar-border fixed inset-0 top-16 z-40 flex w-72 flex-col gap-6 overflow-y-auto border-r p-6 transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div>
          <h1 className='text-sidebar-foreground mb-2 text-2xl font-bold'>Quiz</h1>
          <p className='text-sidebar-foreground/60 text-sm'>Kiểm tra kiến thức của bạn</p>
        </div>

        {/* Question Count */}
        <Card className='bg-secondary/10 border-secondary/20 p-4'>
          <p className='text-sidebar-foreground/60 mb-2 text-sm'>Tổng số câu hỏi</p>
          <p className='text-secondary text-2xl font-bold'>{questions.length}</p>
        </Card>

        {/* Question Navigation */}
        <div>
          <p className='text-sidebar-foreground mb-3 text-sm font-medium'>Chọn câu hỏi</p>
          <div className='grid grid-cols-5 gap-2'>
            {questions.map((_, index) => (
              <Button
                key={index}
                onClick={() => {
                  dispatch(setCurrentQuestionIndex(index))
                  setIsOpen(false)
                }}
                variant={index === currentQuestionIndex ? 'default' : 'outline'}
                size='sm'
                className={`aspect-square text-xs font-semibold transition-all ${
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
    </>
  )
}
