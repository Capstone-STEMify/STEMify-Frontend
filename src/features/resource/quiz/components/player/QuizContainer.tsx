'use client'

import { useQuizPlayer } from '@/features/resource/section/components/quiz/context/quiz-player-context'
import QuizMainContent from '@/features/resource/section/components/quiz/components/player/QuizMainContent'
import QuizMobileSidebar from '@/features/resource/section/components/quiz/components/player/QuizMobileSidebar'
import QuizResult from '@/features/resource/section/components/quiz/components/player/QuizResult'
import QuizSidebar from '@/features/resource/section/components/quiz/components/player/QuizSidebar'
import { useIsMobile } from '@/hooks/use-mobile'

export default function QuizContainer() {
  const { isSubmitted } = useQuizPlayer()
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
