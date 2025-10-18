'use client'

import QuizBuilderContainer from '@/features/resource/quiz/components/builder/QuizBuilderContainer'
import QuizPlayerContainer from '@/features/resource/quiz/components/player/QuizPlayerContainer'
import { QuizBuilderProvider } from '@/features/resource/quiz/context/quiz-builder-context'
import { QuizPlayerProvider } from '@/features/resource/quiz/context/quiz-player-context'
import { useState, useEffect } from 'react'

export default function CreateQuizPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <QuizPlayerProvider>
      <QuizPlayerContainer />
    </QuizPlayerProvider>
  )
}
