'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import QuizSidebar from '@/features/resource/quiz/components/player/QuizSidebar'
import QuizMainContent from '@/features/resource/quiz/components/player/QuizMainContent'
import {
  initializeQuiz,
  setQuizAttemptId,
  setStartedAt,
  setTimeRemaining,
  submitQuiz
} from '@/features/resource/quiz/slice/quiz-player-slice'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useParams } from 'next/navigation'

export default function QuizPlayerContainer() {
  const dispatch = useAppDispatch()
  const {
    selectedQuiz,
    quizAttemptId: reduxAttemptId,
    questions,
    isSubmitted
  } = useAppSelector((state) => state.quizPlayer)

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

    // Persisted timer logic
    const storageKey = `quiz_attempt_${attemptIdNum}`
    try {
      const savedRaw = localStorage.getItem(storageKey)
      const timeLimitSec = selectedQuiz.timeLimitMinutes * 60
      let startedAt: number | undefined
      let submitted = false

      if (savedRaw) {
        const saved = JSON.parse(savedRaw)
        startedAt = typeof saved.startedAt === 'number' ? saved.startedAt : undefined
        submitted = Boolean(saved.submitted)
      }

      if (!startedAt) {
        startedAt = Date.now()
        localStorage.setItem(storageKey, JSON.stringify({ startedAt, timeLimitSec, submitted: false }))
      }

      dispatch(setStartedAt(startedAt))

      // Compute remaining based on wall-clock
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const remaining = Math.max(0, timeLimitSec - elapsed)
      dispatch(setTimeRemaining(remaining))

      if (submitted || remaining <= 0) {
        dispatch(submitQuiz())
      }
    } catch {
      // ignore storage errors
    }
  }, [selectedQuiz, quizAttemptId])

  // Persist submitted flag
  useEffect(() => {
    const attemptIdNum = Number(quizAttemptId)
    if (!selectedQuiz || Number.isNaN(attemptIdNum)) return
    const storageKey = `quiz_attempt_${attemptIdNum}`
    const timeLimitSec = selectedQuiz.timeLimitMinutes * 60
    const savedRaw = localStorage.getItem(storageKey)
    const saved = savedRaw
      ? (() => {
          try {
            return JSON.parse(savedRaw)
          } catch {
            return {}
          }
        })()
      : {}
    localStorage.setItem(
      storageKey,
      JSON.stringify({ startedAt: saved.startedAt ?? Date.now(), timeLimitSec, submitted: isSubmitted })
    )
  }, [isSubmitted, selectedQuiz, quizAttemptId])

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
