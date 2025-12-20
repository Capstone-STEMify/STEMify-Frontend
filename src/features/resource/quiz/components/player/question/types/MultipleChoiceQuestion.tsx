'use client'

import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { toggleUserAnswer } from '@/features/resource/quiz/slice/quiz-player-slice'
import { Question } from '@/features/resource/question/types/question.type'
import { Check } from 'lucide-react'
import { Badge } from '@/components/shadcn/badge'

type MultipleChoiceQuestionProps = {
  question: Question
}

export default function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const dispatch = useAppDispatch()
  const { userAnswers } = useAppSelector((state) => state.quizPlayer)

  const selectedIds = userAnswers[question.id] ?? []
  const selected = Array.isArray(selectedIds) ? selectedIds : []

  const handleToggle = (answerId: number) => {
    dispatch(toggleUserAnswer({ questionId: question.id, answer: answerId }))
  }

  return (
    <div className='space-y-4'>
      <p className='text-lg font-medium text-gray-900'>{question.content}</p>
      {/* Hint Badge */}
      <div className='mb-4 flex items-center gap-2'>
        <Badge className='bg-sky-50 text-blue-500'>Chọn tất cả đáp án đúng</Badge>
      </div>

      {question.answers.map((answer) => {
        const isChosen = selected.includes(answer.id)

        let containerClass = 'group relative overflow-hidden transition-all duration-300'
        let borderClass = 'border-2'

        if (isChosen) {
          containerClass += ' border-sky-400 bg-gradient-to-r from-sky-50 to-cyan-50'
          borderClass = 'border-1 border-sky-400'
        } else {
          containerClass += ' border-gray-200 bg-white hover:border-sky-400 '
          borderClass = 'border-1 border-gray-200'
        }

        return (
          <Button
            key={answer.id}
            onClick={() => handleToggle(answer.id)}
            variant='outline'
            className={`${containerClass} ${borderClass} h-auto w-full justify-start p-5 text-left transition-all duration-300`}
          >
            {/* Checkbox */}
            <span
              className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                isChosen ? 'border-sky-500 bg-sky-500' : 'border-gray-300 bg-white group-hover:border-sky-400'
              }`}
            >
              {isChosen && <Check className='h-5 w-5 text-white' />}
            </span>

            {/* Answer Content */}
            <span className='flex flex-1 flex-col gap-1'>
              <span className='text-base font-medium text-gray-800'>{answer.content}</span>
            </span>
          </Button>
        )
      })}
    </div>
  )
}
