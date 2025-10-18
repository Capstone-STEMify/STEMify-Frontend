'use client'

import { Button } from '@/components/shadcn/button'
import { Question, useQuizPlayer } from '@/features/resource/quiz/context/quiz-player-context'

type TrueFalseQuestionProps = {
  question: Question
}

export default function TrueFalseQuestion({ question }: TrueFalseQuestionProps) {
  const { setUserAnswer } = useQuizPlayer()

  return (
    <div className='flex gap-4'>
      <Button
        onClick={() => setUserAnswer('true')}
        variant='outline'
        className='border-primary/30 hover:border-primary hover:bg-primary/10 flex-1 border-2 px-6 py-4 font-semibold'
      >
        ✓ Đúng
      </Button>
      <Button
        onClick={() => setUserAnswer('false')}
        variant='outline'
        className='border-destructive/30 hover:border-destructive hover:bg-destructive/10 flex-1 border-2 px-6 py-4 font-semibold'
      >
        ✗ Sai
      </Button>
    </div>
  )
}
