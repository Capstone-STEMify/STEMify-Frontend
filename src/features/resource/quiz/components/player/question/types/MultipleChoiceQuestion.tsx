'use client'

import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Question } from '@/features/resource/question/types/question.type'

type MultipleChoiceQuestionProps = {
  question: Question
}

export default function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const dispatch = useAppDispatch()
  const { userAnswers } = useAppSelector((state) => state.quizPlayer)
  const currentAnswer = userAnswers[question.id] as unknown as number[] | undefined
  const selected = Array.isArray(currentAnswer) ? currentAnswer : []

  const handleToggle = (answerId: number) => {
    const newSelected = selected.includes(answerId) ? selected.filter((id) => id !== answerId) : [...selected, answerId]
    dispatch(setUserAnswer({ questionId: question.id, answer: newSelected as unknown as string | number }))
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
