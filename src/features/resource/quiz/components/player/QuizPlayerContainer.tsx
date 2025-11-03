'use client'

import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import QuizResult from '@/features/resource/quiz/components/player/QuizResult'
import QuizSidebar from '@/features/resource/quiz/components/player/QuizSidebar'
import QuizMainContent from '@/features/resource/quiz/components/player/QuizMainContent'
import { useGetQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import { initializeQuiz } from '@/features/resource/quiz/slice/quiz-player-slice'

export default function QuizPlayerContainer() {
  const dispatch = useAppDispatch()
  const { isSubmitted } = useAppSelector((state) => state.quizPlayer)
  const isMobile = useIsMobile()
  const { data: quizData, isLoading } = useGetQuizByIdQuery(1)

  useEffect(() => {
    if (quizData?.data) {
      dispatch(
        initializeQuiz({
          questions: quizData.data.questions,
          timeLimitMinutes: quizData.data.timeLimitMinutes
        })
      )
    }
  }, [quizData, dispatch])

  if (isLoading || !quizData) {
    return (
      <div className='flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600' />
          <p className='text-lg font-semibold text-gray-600'>Đang tải quiz...</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return <QuizResult quiz={quizData.data} />
  }

  return (
    <div className='flex h-screen overflow-hidden bg-white'>
      <QuizSidebar quiz={quizData.data} />
      <QuizMainContent quiz={quizData.data} />
    </div>
  )
}
