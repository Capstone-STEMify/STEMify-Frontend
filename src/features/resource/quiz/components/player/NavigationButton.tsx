'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { goToNextQuestion, goToPreviousQuestion, submitQuiz } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'

type NavigationButtonsProps = {
  quiz: Quiz
}

export default function NavigationButtons({ quiz }: NavigationButtonsProps) {
  const questions = quiz.questions
  const { currentQuestionIndex } = useAppSelector((state) => state.quizPlayer)
  const dispatch = useAppDispatch()
  const isMobile = useIsMobile()

  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className={`mt-6 flex items-center justify-between gap-2 md:mt-8 md:gap-4 ${isMobile ? 'flex-col' : ''}`}>
      <Button
        onClick={() => dispatch(goToPreviousQuestion())}
        disabled={isFirstQuestion}
        variant='secondary'
        className={`flex items-center gap-2 px-4 py-2 font-semibold md:px-6 md:py-3 ${
          isMobile ? 'w-full justify-center text-sm' : ''
        }`}
      >
        <ChevronLeft className='h-4 w-4 md:h-5 md:w-5' />
        <span className='hidden sm:inline'>Câu trước</span>
        <span className='sm:hidden'>Trước</span>
      </Button>

      <div className={`text-foreground/60 text-xs md:text-sm ${isMobile ? 'order-first' : ''}`}>
        Câu {currentQuestionIndex + 1} / {questions.length}
      </div>

      {isLastQuestion ? (
        <Button
          onClick={() => dispatch(submitQuiz())}
          className={`flex items-center gap-2 px-4 py-2 font-semibold shadow-lg md:px-6 md:py-3 ${
            isMobile ? 'w-full justify-center text-sm' : ''
          }`}
        >
          <Send className='h-4 w-4 md:h-5 md:w-5' />
          Nộp bài
        </Button>
      ) : (
        <Button
          onClick={() => dispatch(goToNextQuestion())}
          className={`flex items-center gap-2 px-4 py-2 font-semibold md:px-6 md:py-3 ${
            isMobile ? 'w-full justify-center text-sm' : ''
          }`}
        >
          <span className='hidden sm:inline'>Câu tiếp</span>
          <span className='sm:hidden'>Tiếp</span>
          <ChevronRight className='h-4 w-4 md:h-5 md:w-5' />
        </Button>
      )}
    </div>
  )
}
