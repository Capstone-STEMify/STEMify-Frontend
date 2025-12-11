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
  const selectedQuiz = useAppSelector((state) => state.quizPlayer.selectedQuiz)
  const studentQuizAttemptRedux = useAppSelector((state) => state.quizPlayer.quizAttemptId)
  const { quizAttemptId } = useParams()

  useEffect(() => {
    console.log('quizattemptId from redux:', studentQuizAttemptRedux)
    console.log('selectedQuiz: ', selectedQuiz?.questions.length)
    if (selectedQuiz && !studentQuizAttemptRedux) {
      dispatch(setQuizAttemptId(Number(quizAttemptId)))
      dispatch(
        initializeQuiz({
          questions: selectedQuiz.questions,
          timeLimitMinutes: selectedQuiz.timeLimitMinutes
        })
      )
    }
  }, [selectedQuiz, dispatch, quizAttemptId])

  if (!selectedQuiz) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <SEmpty title='Quiz not found.' />
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
