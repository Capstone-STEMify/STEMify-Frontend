'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import QuizSidebar from '@/features/resource/quiz/components/player/QuizSidebar'
import QuizMainContent from '@/features/resource/quiz/components/player/QuizMainContent'
import { initializeQuiz, setQuizAttemptId } from '@/features/resource/quiz/slice/quiz-player-slice'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useParams } from 'next/navigation'

export default function QuizPlayerContainer() {
  const dispatch = useAppDispatch()
  const { selectedQuiz, quizAttemptId: reduxAttemptId, questions } = useAppSelector((state) => state.quizPlayer)

  const { quizAttemptId } = useParams()

  useEffect(() => {
    if (!selectedQuiz) return

    const attemptIdNum = Number(quizAttemptId)
    if (!reduxAttemptId && !Number.isNaN(attemptIdNum)) {
      dispatch(setQuizAttemptId(attemptIdNum))
    }

    // Always ensure questions initialized once
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
      <QuizSidebar quiz={selectedQuiz} />
      <QuizMainContent quiz={selectedQuiz} />
    </div>
  )
}
