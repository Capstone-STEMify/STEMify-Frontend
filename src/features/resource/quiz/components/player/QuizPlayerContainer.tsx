'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { useAppSelector } from '@/hooks/redux-hooks'
import QuizResult from '@/features/resource/quiz/components/player/QuizResult'
import QuizSidebar from '@/features/resource/quiz/components/player/QuizSidebar'
import QuizMobileSidebar from '@/features/resource/quiz/components/player/QuizMobileSidebar'
import QuizMainContent from '@/features/resource/quiz/components/player/QuizMainContent'
import { useGetQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'

export default function QuizPlayerContainer() {
  const { isSubmitted } = useAppSelector((state) => state.quizPlayer)
  const isMobile = useIsMobile()
  const { data: quizData } = useGetQuizByIdQuery(1)
  if (!quizData) {
    return <div>Loading...</div>
  }
  if (isSubmitted) {
    return <QuizResult quiz={quizData.data} />
  }

  return (
    <div className='bg-background flex h-screen'>
      {/* {!isMobile && <QuizSidebar quiz={quizData.data} />}
      {isMobile && <QuizMobileSidebar />} */}
      <QuizSidebar quiz={quizData.data} />
      {/* Main Content */}
      <QuizMainContent quiz={quizData.data} />
    </div>
  )
}
