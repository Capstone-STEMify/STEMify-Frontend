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
  const { userAnswers, isSubmitted } = useAppSelector((state) => state.quizPlayer)
  const currentSelected = userAnswers[question.id]?.[0]

  return (
    <div className='space-y-3'>
      {question.answers.map((answer, index) => {
        const isChosen = currentSelected === answer.id
        const isCorrect = answer.isCorrect

        // decide border / bg color
        let extraClass = 'border-2 hover:border-primary hover:bg-primary/5'
        if (isSubmitted) {
          if (isCorrect) {
            extraClass = 'border-2 border-green-500 bg-green-50'
          } else if (isChosen && !isCorrect) {
            extraClass = 'border-2 border-red-500 bg-red-50'
          } else {
            extraClass = 'border-2 border-border'
          }
        } else {
          extraClass = isChosen
            ? 'border-2 border-primary bg-primary/10'
            : 'border-2 border-border hover:border-primary/50'
        }

        return (
          <Button
            key={answer.id}
            onClick={() => {
              if (!isSubmitted) {
                dispatch(setUserAnswer({ questionId: question.id, answer: answer.id }))
              }
            }}
            variant='outline'
            className={`h-auto w-full justify-start p-4 text-left font-medium ${extraClass}`}
          >
            <span className='bg-primary/20 text-primary mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold'>
              {String.fromCharCode(65 + index)}
            </span>
            <span className='flex flex-col text-left'>
              <span>{answer.content}</span>
              {isSubmitted && isCorrect && <span className='text-sm font-semibold text-green-600'>(Đáp án đúng)</span>}
              {isSubmitted && isChosen && !isCorrect && (
                <span className='text-sm font-semibold text-red-600'>(Bạn đã chọn)</span>
              )}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
