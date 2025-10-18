'use client'

import { Input } from '@/components/shadcn/input'
import { Question, useQuizPlayer } from '@/features/resource/quiz/context/quiz-player-context'
import type React from 'react'

import { useState } from 'react'

type ShortAnswerQuestionProps = {
  question: Question
}

export default function ShortAnswerQuestion({ question }: ShortAnswerQuestionProps) {
  const { setUserAnswer } = useQuizPlayer()
  const [answer, setAnswer] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAnswer(value)
    setUserAnswer(value)
  }

  return (
    <div>
      <Input
        type='text'
        value={answer}
        onChange={handleChange}
        placeholder='Nhập câu trả lời của bạn...'
        className='w-full border-2 px-4 py-3'
      />
    </div>
  )
}
