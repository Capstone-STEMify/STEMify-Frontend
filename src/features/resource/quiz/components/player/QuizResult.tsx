'use client'

import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { useQuizPlayer } from '@/features/resource/section/components/quiz/context/quiz-player-context'
import { CheckCircle, XCircle } from 'lucide-react'

export default function QuizResult() {
  const { questions } = useQuizPlayer()

  // Calculate score (mock calculation)
  const correctAnswers = Math.floor(questions.length * 0.7)
  const score = Math.round((correctAnswers / questions.length) * 100)

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div className='bg-primary/20 mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full'>
            <CheckCircle className='text-primary h-10 w-10' />
          </div>
          <h1 className='text-foreground mb-2 text-4xl font-bold'>Bài kiểm tra hoàn thành!</h1>
          <p className='text-foreground/60'>Cảm ơn bạn đã hoàn thành bài quiz</p>
        </div>

        {/* Score */}
        <Card className='mb-8 p-8 text-center'>
          <p className='text-foreground/60 mb-2'>Điểm của bạn</p>
          <div className='text-primary mb-2 text-6xl font-bold'>{score}%</div>
          <p className='text-foreground/60'>
            {correctAnswers} / {questions.length} câu đúng
          </p>
        </Card>

        {/* Results Summary */}
        <div className='mb-8 space-y-3'>
          {questions.map((question, index) => (
            <Card key={index} className='flex items-start gap-4 p-4'>
              <div className='mt-1 flex-shrink-0'>
                {Math.random() > 0.3 ? (
                  <CheckCircle className='h-5 w-5 text-green-500' />
                ) : (
                  <XCircle className='text-destructive h-5 w-5' />
                )}
              </div>
              <div className='flex-1'>
                <p className='text-foreground mb-1 font-medium'>Câu {index + 1}</p>
                <p className='text-foreground/60 text-sm'>{question.question}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Button */}
        <Button className='w-full py-3 font-semibold'>Làm lại bài quiz</Button>
      </div>
    </div>
  )
}
