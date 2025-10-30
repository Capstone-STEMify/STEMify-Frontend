'use client'

import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { toggleUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Question } from '@/features/resource/question/types/question.type'

type MultipleChoiceQuestionProps = {
  question: Question
}

export default function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const dispatch = useAppDispatch()
  const { userAnswers, isSubmitted } = useAppSelector((state) => state.quizPlayer)

  const selectedIds = userAnswers[question.id] ?? [] // (string|number)[]
  const selected = Array.isArray(selectedIds) ? selectedIds : []

  const handleToggle = (answerId: number) => {
    if (isSubmitted) return
    dispatch(toggleUserAnswer({ questionId: question.id, answer: answerId }))
  }

  return (
    <div className='space-y-3'>
      {question.answers.map((answer) => {
        const isChosen = selected.includes(answer.id)
        const isCorrect = answer.isCorrect

        let extraClass = 'border-2'
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
            onClick={() => handleToggle(answer.id)}
            variant='outline'
            className={`h-auto w-full justify-start p-4 text-left font-medium ${extraClass}`}
          >
            <span
              className={`mr-3 inline-flex h-5 w-5 items-center justify-center rounded border-2 ${
                isChosen ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
              }`}
            >
              {isChosen && <span className='text-sm font-semibold'>✓</span>}
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
