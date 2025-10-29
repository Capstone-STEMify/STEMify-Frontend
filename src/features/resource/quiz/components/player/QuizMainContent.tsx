'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import QuestionCard from '@/features/resource/quiz/components/player/question/card/QuestionCard'
import { useAppSelector } from '@/hooks/redux-hooks'
import NavigationButtons from '@/features/resource/quiz/components/player/NavigationButton'
import { useGetQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'

type QuizMainContentProps = {
  quiz: Quiz
}

export default function QuizMainContent({ quiz }: QuizMainContentProps) {
  const { currentQuestionIndex } = useAppSelector((state) => state.quizPlayer)
  const isMobile = useIsMobile()
  const questions = quiz.questions
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <main className={`flex flex-1 flex-col overflow-y-auto ${isMobile ? 'px-4 pt-24 pb-6' : 'p-6 md:p-12'}`}>
      {/* Question Card */}
      <div className='mb-6 flex flex-1 items-center justify-center md:mb-8'>
        <QuestionCard question={currentQuestion} />
      </div>

      {/* Navigation */}
      <NavigationButtons quiz={quiz} />
    </main>
  )
}
