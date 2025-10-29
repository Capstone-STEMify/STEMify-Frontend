'use client'

import { Input } from '@/components/shadcn/input'
import { Question } from '@/features/resource/question/types/question.type'
import { setUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import type React from 'react'

interface ShortAnswerQuestionProps {
  question: Question
}

export default function ShortAnswerQuestion({ question }: ShortAnswerQuestionProps) {
  const dispatch = useAppDispatch()
  const { userAnswers } = useAppSelector((state) => state.quizPlayer)
  const currentAnswer = userAnswers[question.id] as string | undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    dispatch(setUserAnswer({ questionId: question.id, answer: value }))
  }

  return (
    <div>
      <Input
        type='text'
        value={currentAnswer || ''}
        onChange={handleChange}
        placeholder='Nhập câu trả lời của bạn...'
        className='w-full border-2 px-4 py-3'
      />
    </div>
  )
}
