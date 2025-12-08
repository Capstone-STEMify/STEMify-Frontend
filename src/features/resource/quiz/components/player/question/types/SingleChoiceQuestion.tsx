'use client'

import { Button } from '@/components/shadcn/button'
import { Question } from '@/features/resource/question/types/question.type'
import { setUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Check, X } from 'lucide-react'

type SingleChoiceQuestionProps = {
  question: Question
}

export default function SingleChoiceQuestion({ question }: SingleChoiceQuestionProps) {
  const dispatch = useAppDispatch()
  const { userAnswers, isSubmitted } = useAppSelector((state) => state.quizPlayer)
  const currentSelected = userAnswers[question.id]?.[0]

  return (
    <div className='space-y-4'>
      {question.answers.map((answer, index) => {
        const isChosen = currentSelected === answer.id
        const isCorrect = answer.isCorrect

        let containerClass = 'group relative overflow-hidden transition-all duration-300'
        let borderClass = 'border-2'

        if (isSubmitted) {
          if (isCorrect) {
            containerClass += ' border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
            borderClass = 'border-2 border-green-500'
          } else if (isChosen && !isCorrect) {
            containerClass += ' border-red-500 bg-gradient-to-r from-red-50 to-pink-50'
            borderClass = 'border-2 border-red-500'
          } else {
            containerClass += ' border-gray-200 bg-gray-50 opacity-60'
            borderClass = 'border-2 border-gray-200'
          }
        } else {
          if (isChosen) {
            containerClass += ' border-sky-400 bg-gradient-to-r from-sky-50 to-cyan-50'
            borderClass = 'border-1 border-sky-400'
          } else {
            containerClass += ' border-gray-200 bg-white hover:border-sky-400 '
            borderClass = 'border-1 border-gray-200'
          }
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
            disabled={isSubmitted}
            className={`${containerClass} ${borderClass} h-auto w-full justify-start p-5 text-left transition-all duration-300`}
          >
            {/* Answer Label */}
            <span
              className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : isChosen
                      ? 'bg-gradient-to-br from-red-500 to-pink-600'
                      : 'bg-gray-400'
                  : isChosen
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-gray-300 bg-white group-hover:border-sky-400'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </span>

            {/* Answer Content */}
            <span className='flex flex-1 flex-col gap-1'>
              <span className='text-base font-medium text-gray-800'>{answer.content}</span>

              {/* Status Indicators */}
              {isSubmitted && isCorrect && (
                <span className='flex items-center gap-1 text-sm font-semibold text-green-600'>
                  <Check className='h-4 w-4' />
                  Đáp án đúng
                </span>
              )}
              {isSubmitted && isChosen && !isCorrect && (
                <span className='flex items-center gap-1 text-sm font-semibold text-red-600'>
                  <X className='h-4 w-4' />
                  Bạn đã chọn
                </span>
              )}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
