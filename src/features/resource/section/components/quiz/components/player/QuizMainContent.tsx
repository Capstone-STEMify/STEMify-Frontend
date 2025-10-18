import NavigationButtons from '@/features/resource/section/components/quiz/components/player/NavigationButton'
import QuestionCard from '@/features/resource/section/components/quiz/components/player/question/card/QuestionCard'
import { useQuizPlayer } from '@/features/resource/section/components/quiz/context/quiz-player-context'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

export default function QuizMainContent() {
  const { questions, currentQuestionIndex } = useQuizPlayer()
  const isMobile = useIsMobile()
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <main className={`z-0 flex flex-1 flex-col overflow-y-auto ${isMobile ? 'px-4 pt-20 pb-6' : 'p-6 md:p-12'}`}>
      {/* Question Card */}
      <div className='mb-8 flex flex-1 items-center justify-center'>
        <QuestionCard question={currentQuestion} />
      </div>

      {/* Navigation */}
      <NavigationButtons />
    </main>
  )
}
