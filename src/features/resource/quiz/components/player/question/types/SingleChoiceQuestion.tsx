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
        let hoverClass = 'hover:border-indigo-400 hover:shadow-md'

        if (isSubmitted) {
          if (isCorrect) {
            containerClass += ' border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
            borderClass = 'border-2 border-green-500'
            hoverClass = ''
          } else if (isChosen && !isCorrect) {
            containerClass += ' border-red-500 bg-gradient-to-r from-red-50 to-pink-50'
            borderClass = 'border-2 border-red-500'
            hoverClass = ''
          } else {
            containerClass += ' border-gray-200 bg-gray-50 opacity-60'
            borderClass = 'border-2 border-gray-200'
            hoverClass = ''
          }
        } else {
          if (isChosen) {
            containerClass += ' border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg scale-[1.02]'
            borderClass = 'border-2 border-indigo-600'
            hoverClass = ''
          } else {
            containerClass += ' border-gray-200 bg-white'
            borderClass = 'border-2 border-gray-200'
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
            className={`${containerClass} ${borderClass} ${hoverClass} h-auto w-full justify-start p-5 text-left transition-all duration-300`}
          >
            {/* Answer Label */}
            <span
              className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-md transition-all duration-300 ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : isChosen
                      ? 'bg-gradient-to-br from-red-500 to-pink-600'
                      : 'bg-gray-400'
                  : isChosen
                    ? 'scale-110 bg-gradient-to-br from-indigo-600 to-purple-600'
                    : 'bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-indigo-500 group-hover:to-purple-500'
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

            {/* Checkmark indicator for selected */}
            {!isSubmitted && isChosen && (
              <div className='ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white'>
                <Check className='h-4 w-4' />
              </div>
            )}
          </Button>
        )
      })}
    </div>
  )
}
