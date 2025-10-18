'use client'

import { Card } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { useQuizBuilder } from '@/features/resource/section/components/quiz/context/quiz-builder-context'
import { Shuffle } from 'lucide-react'

interface QuizSettingsProps {
  questionId: string
}

export default function QuizSettings({ questionId }: QuizSettingsProps) {
  const { quiz, updateQuestion } = useQuizBuilder()
  const question = quiz.questions.find((q) => q.id === questionId)

  if (!question) return null

  return (
    <Card className='p-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Randomize Order */}
        <div className='space-y-2'>
          <Label className='flex items-center gap-2 text-sm font-semibold'>
            <Shuffle className='h-4 w-4' />
            Randomize Order
          </Label>
          <Select
            value={question.randomizeOrder ? 'yes' : 'no'}
            onValueChange={(value) => updateQuestion(questionId, { randomizeOrder: value === 'yes' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='yes'>Keep choices in current order</SelectItem>
              <SelectItem value='no'>Randomize</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estimation Time */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold'>Estimation time</Label>
          <div className='flex items-center gap-2'>
            <Input
              type='number'
              value={question.estimationTime}
              onChange={(e) =>
                updateQuestion(questionId, {
                  estimationTime: Number.parseInt(e.target.value) || 0
                })
              }
              className='w-20'
            />
            <span className='text-muted-foreground text-sm'>Mins</span>
          </div>
        </div>

        {/* Mark as Point */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold'>Mark as point</Label>
          <div className='flex items-center gap-2'>
            <Input
              type='number'
              value={question.points}
              onChange={(e) => updateQuestion(questionId, { points: Number.parseInt(e.target.value) || 0 })}
              className='w-20'
            />
            <span className='text-muted-foreground text-sm'>Points</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
