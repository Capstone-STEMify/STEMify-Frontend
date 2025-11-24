'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import QuestionCard from '@/features/resource/quiz/components/player/question/card/QuestionCard'
import { useAppSelector } from '@/hooks/redux-hooks'
import NavigationButtons from '@/features/resource/quiz/components/player/NavigationButton'
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
    <main
      className={`relative flex flex-1 flex-col overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-indigo-50 ${
        isMobile ? 'px-4 pt-24 pb-6' : 'p-12'
      }`}
    >
      {/* Content */}
      <div className='relative z-10 flex flex-col'>
        {/* Question Card */}
        <div className='flex flex-1 justify-center'>
          <QuestionCard question={currentQuestion} />
        </div>

        {/* Navigation */}
        <div className='mx-auto w-full max-w-3xl'>
          <NavigationButtons quiz={quiz} />
        </div>
      </div>
    </main>
  )
}
