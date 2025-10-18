'use client'

import { Button } from '@/components/shadcn/button'
import { Question, useQuizPlayer } from '@/features/resource/quiz/context/quiz-player-context'

interface TrueFalseQuestionProps {
  question: Question
}

export default function TrueFalseQuestion({ question }: TrueFalseQuestionProps) {
  const { setUserAnswer } = useQuizPlayer()

  const trueAnswer = question.answers.find((a) => a.content === 'True')
  const falseAnswer = question.answers.find((a) => a.content === 'False')

  return (
    <div className='flex gap-4'>
      <Button
        onClick={() => setUserAnswer(trueAnswer?.id || 0)}
        variant='outline'
        className='border-primary/30 hover:border-primary hover:bg-primary/10 flex-1 border-2 px-6 py-4 font-semibold'
      >
        ✓ Đúng
      </Button>
      <Button
        onClick={() => setUserAnswer(falseAnswer?.id || 0)}
        variant='outline'
        className='border-destructive/30 hover:border-destructive hover:bg-destructive/10 flex-1 border-2 px-6 py-4 font-semibold'
      >
        ✗ Sai
      </Button>
    </div>
  )
}
