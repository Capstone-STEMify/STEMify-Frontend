'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import QuizSidebar from '@/features/resource/quiz/components/player/QuizSidebar'
import QuizMainContent from '@/features/resource/quiz/components/player/QuizMainContent'
import { initializeQuiz, setQuizAttemptId } from '@/features/resource/quiz/slice/quiz-player-slice'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useParams } from 'next/navigation'
import QuizTimer from '@/features/resource/quiz/components/player/question/QuizTimer'

export default function QuizPlayerContainer() {
  const dispatch = useAppDispatch()
  const { selectedQuiz, quizAttemptId: reduxAttemptId, questions } = useAppSelector((state) => state.quizPlayer)

  const { quizAttemptId } = useParams()

  useEffect(() => {
    if (!selectedQuiz) return

    if (!reduxAttemptId) {
      dispatch(setQuizAttemptId(Number(quizAttemptId)))
    }

    if (questions.length === 0) {
      dispatch(
        initializeQuiz({
          questions: selectedQuiz.questions,
          timeLimitMinutes: selectedQuiz.timeLimitMinutes
        })
      )
    }
  }, [selectedQuiz, quizAttemptId])

  if (!selectedQuiz) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <SEmpty title='Không tìm thấy bài kiểm tra' />
      </div>
    )
  }

  return (
    <div className='flex h-screen overflow-hidden bg-white'>
      <QuizTimer />
      <QuizSidebar quiz={selectedQuiz} />
      <QuizMainContent quiz={selectedQuiz} />
    </div>
  )
}
