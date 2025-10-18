'use client'

import QuizBuilderContainer from '@/features/resource/section/components/quiz/components/builder/QuizBuilderContainer'
import QuizContainer from '@/features/resource/section/components/quiz/components/player/QuizContainer'
import { QuizBuilderProvider } from '@/features/resource/section/components/quiz/context/quiz-builder-context'
import { QuizPlayerProvider } from '@/features/resource/section/components/quiz/context/quiz-player-context'
import { useState, useEffect } from 'react'

export default function CreateQuizPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <QuizBuilderProvider>
      <QuizBuilderContainer />
    </QuizBuilderProvider>
  )
}
