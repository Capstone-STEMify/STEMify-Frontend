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
      {/* Decorative background elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -top-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 blur-3xl' />
        <div className='absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-200/20 blur-3xl' />
        <div className='absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-purple-200/25 to-pink-200/25 blur-3xl' />
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-1 flex-col'>
        {/* Question Card */}
        <div className='mb-8 flex flex-1 items-center justify-center'>
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
