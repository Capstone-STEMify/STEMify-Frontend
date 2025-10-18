'use client'

import { Button } from '@/components/shadcn/button'
import { Question, useQuizPlayer } from '@/features/resource/section/components/quiz/context/quiz-player-context'

type SingleChoiceQuestionProps = {
  question: Question
}

export default function SingleChoiceQuestion({ question }: SingleChoiceQuestionProps) {
  const { setUserAnswer } = useQuizPlayer()

  return (
    <div className='space-y-3'>
      {question.options?.map((option, index) => (
        <Button
          key={index}
          onClick={() => setUserAnswer(index)}
          variant='outline'
          className='hover:border-primary hover:bg-primary/5 h-auto w-full justify-start border-2 p-4 text-left font-medium'
        >
          <span className='bg-primary/20 text-primary mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold'>
            {String.fromCharCode(65 + index)}
          </span>
          {option}
        </Button>
      ))}
    </div>
  )
}
