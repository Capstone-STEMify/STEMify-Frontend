'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { useAppSelector } from '@/hooks/redux-hooks'
import QuizResult from '@/features/resource/quiz/components/player/QuizResult'
import QuizSidebar from '@/features/resource/quiz/components/player/QuizSidebar'
import QuizMobileSidebar from '@/features/resource/quiz/components/player/QuizMobileSidebar'
import QuizMainContent from '@/features/resource/quiz/components/player/QuizMainContent'

export default function QuizPlayerContainer() {
  const { isSubmitted } = useAppSelector((state) => state.quizPlayer)
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
