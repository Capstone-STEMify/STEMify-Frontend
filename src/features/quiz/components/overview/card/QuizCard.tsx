import { Card, CardContent, CardFooter } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { MoreHorizontal, BookOpen, Users, FileSignature } from 'lucide-react'

import { cn } from '@/shadcn/utils'
import { QuizOverview } from '@/features/quiz/api/data'
import { ProgressCircle } from '../../active/circle/AccuracyCircle'
import { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'
import { useTranslations } from 'next-intl'

interface QuizCardProps {
  quiz: QuizStatistics
}

export function QuizCard({ quiz }: QuizCardProps) {
  const t = useTranslations('dashboard.classroom.quiz.overview')
  const tc = useTranslations('common')

  return (
    <Card className='flex flex-col overflow-hidden'>
      <div className='relative'>
        <img src={'/images/macbg.png'} alt={'quiz title'} className='h-32 w-full object-cover' />
        <div className='absolute top-2 left-2 flex gap-2'>
          <Badge className='bg-black/60 text-white backdrop-blur-sm'>
            <Users className='mr-1.5 h-3 w-3' />
            {quiz.submissions} {t('enroll')}
          </Badge>
          {/* {quiz.status === 'Draft' && (
            <Badge variant='secondary'>
              <FileSignature className='mr-1.5 h-3 w-3' />
              Draft
            </Badge>
          )} */}
        </div>
      </div>

      <CardContent className='flex-grow pt-4'>
        <h3 className='mb-4 h-10 text-base leading-tight font-semibold'>{quiz.quizName}</h3>
        <div className='mb-4 flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2'>
            <ProgressCircle
              value={quiz.averageScore}
              className='text-red-400'
              showPercentageText={false}
              strokeWidth={5}
            />
            <div>
              <p className='text-sm text-gray-500'>{t('accuracy')}</p>
              <p className='text-sm font-bold'>{quiz.averageScore} %</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <ProgressCircle
              value={quiz.passRate}
              className='text-green-500'
              showPercentageText={false}
              strokeWidth={5}
            />
            <div>
              <p className='text-sm text-gray-500'>{t('completeRate')}</p>
              <p className='text-sm font-bold'>{quiz.passRate} %</p>
            </div>
          </div>
        </div>
        {/* <div className='mt-4 flex items-center gap-2'>
          <Badge variant='outline'>{quiz.category}</Badge>
          <Badge
            variant='outline'
            className={cn(quiz.priority === 'Urgent' ? 'border-red-200 bg-red-50 text-red-600' : 'text-gray-600')}
          >
            {quiz.priority}
          </Badge>
        </div> */}
      </CardContent>

      <CardFooter className='flex items-center justify-between bg-gray-50/70 px-6 py-2 text-xs text-gray-500'>
        <div className='flex items-center gap-4'>
          {/* <span>Edited {quiz.lastEdited}</span> */}
          <div className='flex items-center gap-1.5 font-bold text-black'>
            <BookOpen className='h-3 w-3' />
            <span>
              {quiz.totalQuestions} {t('question')}
            </span>
          </div>
        </div>
        <Button variant='ghost' size='icon' className='h-7 w-7'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </CardFooter>
    </Card>
  )
}
