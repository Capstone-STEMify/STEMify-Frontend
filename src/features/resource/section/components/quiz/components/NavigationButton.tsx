'use client'

import { Button } from '@/components/shadcn/button'
import { useQuiz } from '@/features/resource/section/components/quiz/components/quiz-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'

export default function NavigationButtons() {
  const { questions, currentQuestionIndex, goToNextQuestion, goToPreviousQuestion, submitQuiz } = useQuiz()
  const isMobile = useIsMobile()

  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className={`mt-6 flex items-center justify-between gap-2 md:mt-8 md:gap-4 ${isMobile ? 'flex-col' : ''}`}>
      <Button
        onClick={goToPreviousQuestion}
        disabled={isFirstQuestion}
        variant='secondary'
        className={`flex items-center gap-2 px-4 py-2 font-semibold md:px-6 md:py-3 ${
          isMobile ? 'w-full justify-center text-sm' : ''
        }`}
      >
        <ChevronLeft className='h-5 w-5' />
        Câu trước
      </Button>

      <div className={`text-foreground/60 text-xs md:text-sm ${isMobile ? 'order-first' : ''}`}>
        Câu {currentQuestionIndex + 1} / {questions.length}
      </div>

      {isLastQuestion ? (
        <Button
          onClick={submitQuiz}
          className={`flex items-center gap-2 px-4 py-2 font-semibold shadow-lg md:px-6 md:py-3 ${
            isMobile ? 'w-full justify-center text-sm' : ''
          }`}
        >
          <Send className='h-5 w-5' />
          Nộp bài
        </Button>
      ) : (
        <Button
          onClick={goToNextQuestion}
          className={`flex items-center gap-2 px-4 py-2 font-semibold md:px-6 md:py-3 ${
            isMobile ? 'w-full justify-center text-sm' : ''
          }`}
        >
          Câu tiếp
          <ChevronRight className='h-5 w-5' />
        </Button>
      )}
    </div>
  )
}
