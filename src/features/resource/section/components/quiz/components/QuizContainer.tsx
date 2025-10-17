'use client'

import { useQuiz } from '@/features/resource/section/components/quiz/components/quiz-context'
import QuizMainContent from '@/features/resource/section/components/quiz/components/QuizMainContent'
import QuizMobileSidebar from '@/features/resource/section/components/quiz/components/QuizMobileSidebar'
import QuizResult from '@/features/resource/section/components/quiz/components/QuizResult'
import QuizSidebar from '@/features/resource/section/components/quiz/components/QuizSidebar'
import { useIsMobile } from '@/hooks/use-mobile'

export default function QuizContainer() {
  const { isSubmitted } = useQuiz()
  const isMobile = useIsMobile()

  if (isSubmitted) {
    return <QuizResult />
  }

  return (
    <div className='bg-background flex h-screen'>
      {!isMobile && <QuizSidebar />}
      {isMobile && <QuizMobileSidebar />}

      {/* Main Content */}
      <QuizMainContent />
    </div>
  )
}
