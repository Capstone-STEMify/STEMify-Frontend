'use client'

import { QuizProvider } from '@/features/resource/section/components/quiz/components/quiz-context'
import QuizContainer from '@/features/resource/section/components/quiz/components/QuizContainer'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <QuizProvider>
      <QuizContainer />
    </QuizProvider>
  )
}
