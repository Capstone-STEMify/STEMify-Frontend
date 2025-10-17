import NavigationButtons from '@/features/resource/section/components/quiz/components/NavigationButton'
import QuestionCard from '@/features/resource/section/components/quiz/components/question/card/QuestionCard'
import { useQuiz } from '@/features/resource/section/components/quiz/components/quiz-context'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

export default function QuizMainContent() {
  const { questions, currentQuestionIndex } = useQuiz()
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
