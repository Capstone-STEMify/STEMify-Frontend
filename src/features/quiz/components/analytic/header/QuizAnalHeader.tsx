import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/shadcn/breadcrumb'
import { CheckCircle, Clock, Edit2, MoreHorizontal, Share2, BookOpen } from 'lucide-react'
import { ProgressCircle } from '../../active/circle/AccuracyCircle'
import { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

type QuizDetailHeaderProps = {
  data: QuizStatistics
}

export function QuizDetailHeader({ data }: QuizDetailHeaderProps) {
  const { classroomId, quizId } = useParams()
  const locale = useLocale()

  const t = useTranslations('quiz.teacher')

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/classroom/${classroomId}`}>{t('header.quiz')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.quizName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='flex-grow'>
          <h1 className='flex items-center gap-2 text-2xl font-bold'>{data.quizName}</h1>
          {/* <div className='mt-3 mb-4 flex items-center gap-2'>
            <Badge>Fundamental</Badge>
            <Badge>Design</Badge>
            <Badge>Not Urgent</Badge>
          </div> */}
          <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
            <span className='flex items-center gap-1.5'>
              <BookOpen className='h-4 w-4' /> {t('header.quiz')}
            </span>
            <span>•</span>
            <span>
              {data.totalQuestions} {t('header.question')}
            </span>
          </div>

          {/* Stats */}
          <div className='mt-6 grid grid-cols-2 gap-4 py-4 md:grid-cols-4'>
            <div className='flex items-center gap-3 border-r-2'>
              <ProgressCircle
                value={data.averageScore}
                size={40}
                className='text-red-500'
                showPercentageText={false}
                strokeWidth={4}
              />
              <div>
                <span className='text-xs text-gray-500'>{t('answerTable.accuracy')}</span>
                <p className='text-lg font-semibold'>{data.averageScore}%</p>
              </div>
            </div>
            <div className='flex items-center gap-3 border-r-2'>
              <ProgressCircle
                value={data.passRate}
                size={40}
                className='text-green-500'
                showPercentageText={false}
                strokeWidth={4}
              />
              <div>
                <span className='text-xs text-gray-500'>{t('header.passRate')}</span>
                <p className='text-lg font-semibold'>{data.passRate}%</p>
              </div>
            </div>
            <div className='border-r-2'>
              <span className='text-xs text-gray-500'>{t('header.submission')}</span>
              <p className='text-lg font-semibold'>{data.submissions}</p>
            </div>
            <div>
              <span className='text-xs text-gray-500'>{t('header.time')}</span>
              <p className='text-sm font-semibold'>
                {data.timeLimitMinutes} {t('header.mins')}
              </p>
            </div>
          </div>
        </div>
        <div className='flex-shrink-0'>
          <img
            src='https://res.cloudinary.com/dms8gue1c/image/upload/v1765229374/images_rce0pr.jpg'
            alt='UI Design'
            className='h-60 w-full rounded-lg object-cover md:w-120'
          />
        </div>
      </div>
    </div>
  )
}
