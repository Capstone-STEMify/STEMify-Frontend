'use client'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Question, useQuizPlayer } from '@/features/resource/quiz/context/quiz-player-context'

interface MultipleChoiceQuestionProps {
  question: Question
}

export default function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const { setUserAnswer } = useQuizPlayer()
  const [selected, setSelected] = useState<number[]>([])

  const handleToggle = (answerId: number) => {
    const newSelected = selected.includes(answerId) ? selected.filter((id) => id !== answerId) : [...selected, answerId]
    setSelected(newSelected)
    setUserAnswer(JSON.stringify(newSelected))
  }

  return (
    <div className='space-y-3'>
      {question.answers.map((answer, index) => (
        <Button
          key={answer.id}
          onClick={() => handleToggle(answer.id)}
          variant={selected.includes(answer.id) ? 'default' : 'outline'}
          className={`h-auto w-full justify-start border-2 p-4 text-left font-medium ${
            selected.includes(answer.id) ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
        >
          <span
            className={`mr-3 inline-flex h-5 w-5 items-center justify-center rounded border-2 ${
              selected.includes(answer.id) ? 'bg-primary border-primary' : 'border-border'
            }`}
          >
            {selected.includes(answer.id) && <span className='text-primary-foreground text-sm'>✓</span>}
          </span>
          {answer.content}
        </Button>
      ))}
    </div>
  )
}
