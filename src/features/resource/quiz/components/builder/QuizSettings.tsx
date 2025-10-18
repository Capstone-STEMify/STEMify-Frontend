'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Shuffle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { updateQuestion } from '@/features/resource/quiz/context/quiz-builder-slice'

interface QuizSettingsProps {
  questionId: number
}

export default function QuizSettings({ questionId }: QuizSettingsProps) {
  const { quiz } = useAppSelector((state) => state.quizBuilder)
  const dispatch = useAppDispatch()
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
          <Select defaultValue='no'>
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
            <Input type='number' defaultValue='2' className='w-20' />
            <span className='text-muted-foreground text-sm'>Mins</span>
          </div>
        </div>

        {/* Mark as Point */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold'>Mark as point</Label>
          <div className='flex items-center gap-2'>
            <Input
              type='number'
              value={question.point}
              onChange={(e) =>
                dispatch(updateQuestion({ id: questionId, updates: { point: Number.parseInt(e.target.value) || 0 } }))
              }
              className='w-20'
            />
            <span className='text-muted-foreground text-sm'>Points</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
