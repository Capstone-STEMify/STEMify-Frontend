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
  const { userAnswers } = useAppSelector((state) => state.quizPlayer)

  const trueAnswer = question.answers.find((a) => a.content === 'True')
  const falseAnswer = question.answers.find((a) => a.content === 'False')
  const currentAnswer = userAnswers[question.id]

  return (
    <div className='flex gap-4'>
      <Button
        onClick={() => dispatch(setUserAnswer({ questionId: question.id, answer: trueAnswer?.id || 0 }))}
        variant={currentAnswer === trueAnswer?.id ? 'default' : 'outline'}
        className='border-primary/30 hover:border-primary hover:bg-primary/10 flex-1 border-2 px-6 py-4 font-semibold'
      >
        ✓ Đúng
      </Button>
      <Button
        onClick={() => dispatch(setUserAnswer({ questionId: question.id, answer: falseAnswer?.id || 0 }))}
        variant={currentAnswer === falseAnswer?.id ? 'default' : 'outline'}
        className='border-destructive/30 hover:border-destructive hover:bg-destructive/10 flex-1 border-2 px-6 py-4 font-semibold'
      >
        ✗ Sai
      </Button>
    </div>
  )
}
