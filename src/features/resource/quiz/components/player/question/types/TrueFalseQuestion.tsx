'use client'

import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Question } from '@/features/resource/question/types/question.type'

type TrueFalseQuestionProps = {
  question: Question
}

export default function TrueFalseQuestion({ question }: TrueFalseQuestionProps) {
  const dispatch = useAppDispatch()
  const { userAnswers, isSubmitted } = useAppSelector((state) => state.quizPlayer)

  const trueAnswer = question.answers.find((a) => a.content === 'True')
  const falseAnswer = question.answers.find((a) => a.content === 'False')
  const currentSelected = userAnswers[question.id]?.[0]

  return (
    <div className='flex flex-col gap-4 sm:flex-row'>
      {[trueAnswer, falseAnswer].map((ans) => {
        if (!ans) return null
        const isChosen = currentSelected === ans.id
        const isCorrect = ans.isCorrect

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
            key={ans.id}
            onClick={() => {
              if (!isSubmitted) {
                dispatch(setUserAnswer({ questionId: question.id, answer: ans.id }))
              }
            }}
            variant='outline'
            className={`flex-1 px-6 py-4 font-semibold ${extraClass}`}
          >
            <div className='flex flex-col items-center text-center'>
              <span>{ans.content === 'True' ? '✓ Đúng' : '✗ Sai'}</span>

              {isSubmitted && isCorrect && <span className='text-sm font-semibold text-green-600'>(Đáp án đúng)</span>}
              {isSubmitted && isChosen && !isCorrect && (
                <span className='text-sm font-semibold text-red-600'>(Bạn đã chọn)</span>
              )}
            </div>
          </Button>
        )
      })}
    </div>
  )
}
