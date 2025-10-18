'use client'

import QuizBuilderContainer from '@/features/resource/quiz/components/builder/QuizBuilderContainer'
import QuizPlayerContainer from '@/features/resource/quiz/components/player/QuizPlayerContainer'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <QuizBuilderContainer />
}
