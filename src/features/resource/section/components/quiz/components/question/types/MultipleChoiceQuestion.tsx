'use client'

import { Button } from '@/components/shadcn/button'
import { Question, useQuiz } from '@/features/resource/section/components/quiz/components/quiz-context'
import { useState } from 'react'

type MultipleChoiceQuestionProps = {
  question: Question
}

export default function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const { setUserAnswer } = useQuiz()
  const [selected, setSelected] = useState<number[]>([])

  const handleToggle = (index: number) => {
    const newSelected = selected.includes(index) ? selected.filter((i) => i !== index) : [...selected, index]
    setSelected(newSelected)
    setUserAnswer(JSON.stringify(newSelected))
  }

  return (
    <div className='space-y-3'>
      {question.options?.map((option, index) => (
        <Button
          key={index}
          onClick={() => handleToggle(index)}
          variant={selected.includes(index) ? 'default' : 'outline'}
          className={`h-auto w-full justify-start border-2 p-4 text-left font-medium ${
            selected.includes(index) ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
        >
          <span
            className={`mr-3 inline-flex h-5 w-5 items-center justify-center rounded border-2 ${
              selected.includes(index) ? 'bg-primary border-primary' : 'border-border'
            }`}
          >
            {selected.includes(index) && <span className='text-primary-foreground text-sm'>✓</span>}
          </span>
          {option}
        </Button>
      ))}
    </div>
  )
}
