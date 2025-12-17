'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { decrementTime } from '@/features/resource/quiz/slice/quiz-player-slice'

export default function QuizTimer() {
  const dispatch = useAppDispatch()
  const { isSubmitted, timeRemaining } = useAppSelector((s) => s.quizPlayer)

  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return

    const timer = setInterval(() => {
      dispatch(decrementTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted, timeRemaining])

  return null
}
