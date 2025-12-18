'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setTimeRemaining, submitQuiz } from '@/features/resource/quiz/slice/quiz-player-slice'

export default function QuizTimer() {
  const dispatch = useAppDispatch()
  const { isSubmitted, startedAt, selectedQuiz, timeRemaining } = useAppSelector((s) => s.quizPlayer)

  useEffect(() => {
    if (!selectedQuiz || !startedAt) return
    if (isSubmitted) return

    const timeLimitSec = selectedQuiz.timeLimitMinutes * 60
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const remaining = Math.max(0, timeLimitSec - elapsed)
      dispatch(setTimeRemaining(remaining))
      if (remaining <= 0) {
        dispatch(submitQuiz())
      }
    }, 1000)

    return () => clearInterval(id)
  }, [isSubmitted, startedAt, selectedQuiz])

  return null
}
