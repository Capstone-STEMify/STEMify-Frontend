'use client'

import { Button } from '@/components/shadcn/button'
import { Question } from '@/features/resource/question/types/question.type'
import { setUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

type SingleChoiceQuestionProps = {
  question: Question
}

export default function SingleChoiceQuestion({ question }: SingleChoiceQuestionProps) {
  const dispatch = useAppDispatch()
  const { userAnswers } = useAppSelector((state) => state.quizPlayer)
  const currentAnswer = userAnswers[question.id]

  return (
    <div className='space-y-3'>
      {question.answers.map((answer, index) => (
        <Button
          key={answer.id}
          onClick={() => dispatch(setUserAnswer({ questionId: question.id, answer: answer.id }))}
          variant={currentAnswer === answer.id ? 'default' : 'outline'}
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
