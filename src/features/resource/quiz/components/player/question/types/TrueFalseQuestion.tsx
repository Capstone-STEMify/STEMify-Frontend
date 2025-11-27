'use client'

import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Question } from '@/features/resource/question/types/question.type'
import { Check, X } from 'lucide-react'

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
    <div className='space-y-6'>
      {/* Question Content */}
      <div className='space-y-4'>
        <div className='flex items-start gap-3'>
          <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700'>
            {question.orderIndex || 1}
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-medium text-gray-900'>{question.content}</h3>
          </div>
        </div>
      </div>

      {/* True/False Options */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        {[trueAnswer, falseAnswer].map((ans) => {
          if (!ans) return null
          const isChosen = currentSelected === ans.id
          const isCorrect = ans.isCorrect
          const isTrue = ans.content === 'True'

          let containerClass = 'group relative overflow-hidden transition-all duration-300'

          if (isSubmitted) {
            if (isCorrect) {
              containerClass += isTrue
                ? ' border-2 border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl'
                : ' border-2 border-red-500 bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-xl'
            } else if (isChosen && !isCorrect) {
              containerClass += ' border-2 border-gray-400 bg-gray-100 opacity-70'
            } else {
              containerClass += ' border-2 border-gray-200 bg-white opacity-50'
            }
          } else {
            if (isChosen) {
              containerClass += isTrue
                ? ' border-2 border-green-600 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl scale-105'
                : ' border-2 border-red-600 bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-xl scale-105'
            } else {
              containerClass += isTrue
                ? ' border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-400 hover:shadow-lg hover:scale-105'
                : ' border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 hover:border-red-400 hover:shadow-lg hover:scale-105'
            }
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
              disabled={isSubmitted}
              className={`${containerClass} flex-1 px-8 py-20 transition-all duration-300`}
            >
              <div className='flex flex-col items-center gap-3 text-center'>
                {/* Icon */}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                    isChosen || (isSubmitted && isCorrect)
                      ? 'bg-white/30 shadow-lg'
                      : isTrue
                        ? 'bg-green-200 text-green-700'
                        : 'bg-red-200 text-red-700'
                  }`}
                >
                  {isTrue ? <Check className='h-10 w-10' /> : <X className='h-10 w-10' />}
                </div>

                {/* Label */}
                <span
                  className={`text-xl font-bold ${
                    isChosen || (isSubmitted && isCorrect) ? 'text-white' : isTrue ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {isTrue ? 'ĐÚNG' : 'SAI'}
                </span>

                {/* Status */}
                {isSubmitted && isCorrect && (
                  <span className='rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700'>
                    ✓ Đáp án đúng
                  </span>
                )}
                {isSubmitted && isChosen && !isCorrect && (
                  <span className='rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700'>
                    ✗ Bạn đã chọn
                  </span>
                )}
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
