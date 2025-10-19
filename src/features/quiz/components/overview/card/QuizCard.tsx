import { Card, CardContent, CardFooter } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { MoreHorizontal, BookOpen, Users, FileSignature } from 'lucide-react'

import { cn } from '@/shadcn/utils'
import { QuizOverview } from '@/features/quiz/api/data'
import { ProgressCircle } from '../../active/circle/AccuracyCircle'

interface QuizCardProps {
  quiz: QuizOverview
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className='flex flex-col overflow-hidden'>
      <div className='relative'>
        <img src={quiz.imageUrl} alt={quiz.title} className='h-32 w-full object-cover' />
        <div className='absolute top-2 left-2 flex gap-2'>
          <Badge className='bg-black/60 text-white backdrop-blur-sm'>
            <Users className='mr-1.5 h-3 w-3' />
            {quiz.enrolledCount} Enrolled
          </Badge>
          {quiz.status === 'Draft' && (
            <Badge variant='secondary'>
              <FileSignature className='mr-1.5 h-3 w-3' />
              Draft
            </Badge>
          )}
        </div>
      </div>

      <CardContent className='flex-grow pt-4'>
        <h3 className='mb-4 h-10 text-base leading-tight font-semibold'>{quiz.title}</h3>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex flex-col items-center'>
            <ProgressCircle value={quiz.accuracy} className='text-red-400' />
            <span className='mt-1 text-xs text-gray-500'>Accuracy</span>
          </div>
          <div className='flex flex-col items-center'>
            <ProgressCircle value={quiz.completionRate} className='text-green-500' />
            <span className='mt-1 text-xs text-gray-500'>Completion Rate</span>
          </div>
        </div>
        <div className='mt-4 flex items-center gap-2'>
          <Badge variant='outline'>{quiz.category}</Badge>
          <Badge
            variant='outline'
            className={cn(quiz.priority === 'Urgent' ? 'border-red-200 bg-red-50 text-red-600' : 'text-gray-600')}
          >
            {quiz.priority}
          </Badge>
          <Avatar className='ml-auto h-6 w-6'>
            <AvatarImage src='/avatars/01.png' />
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>

      <CardFooter className='flex items-center justify-between bg-gray-50/70 px-4 py-2 text-xs text-gray-500'>
        <div className='flex items-center gap-4'>
          <span>Edited {quiz.lastEdited}</span>
          <div className='flex items-center gap-1.5'>
            <BookOpen className='h-3 w-3' />
            <span>{quiz.questionCount} Question</span>
          </div>
        </div>
        <Button variant='ghost' size='icon' className='h-7 w-7'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </CardFooter>
    </Card>
  )
}
