'use client'


import QuizMainContent from '@/features/resource/quiz/components/player/QuizMainContent'
import QuizMobileSidebar from '@/features/resource/quiz/components/player/QuizMobileSidebar'
import QuizResult from '@/features/resource/quiz/components/player/QuizResult'
import QuizSidebar from '@/features/resource/quiz/components/player/QuizSidebar'
import { useQuizPlayer } from '@/features/resource/quiz/context/quiz-player-context'
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
