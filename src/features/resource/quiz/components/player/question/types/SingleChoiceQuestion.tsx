'use client'

import { Button } from '@/components/shadcn/button'
import { Question, useQuizPlayer } from '@/features/resource/quiz/context/quiz-player-context'

interface SingleChoiceQuestionProps {
  question: Question
}

export default function SingleChoiceQuestion({ question }: SingleChoiceQuestionProps) {
  const { setUserAnswer } = useQuizPlayer()

  return (
    <div className='space-y-3'>
      {question.answers.map((answer, index) => (
        <Button
          key={answer.id}
          onClick={() => setUserAnswer(answer.id)}
          variant='outline'
          className='hover:border-primary hover:bg-primary/5 h-auto w-full justify-start border-2 p-4 text-left font-medium'
        >
          <span className='bg-primary/20 text-primary mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold'>
            {String.fromCharCode(65 + index)}
          </span>
          {answer.content}
        </Button>
      ))}
    </div>
  )
}
