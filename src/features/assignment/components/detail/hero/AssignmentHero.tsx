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
import { ProgressCircle } from '@/features/quiz/components/active/circle/AccuracyCircle'
import { AssignmentStatistics } from '@/features/assignment/types/assigmentlistdetail.type'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export function AssignmentDetailHeader({ data }: { data: AssignmentStatistics }) {
  const locale = useLocale()
  const { classroomId } = useParams()

  const t = useTranslations('assignment.teacher')
  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/classroom/${classroomId}`}>{t('title')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.assignmentTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='flex-grow'>
          <h1 className='flex items-center gap-2 text-2xl font-bold'>
            {data.assignmentTitle}
            <Edit2 className='h-5 w-5 cursor-pointer text-gray-400' />
          </h1>
          <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
            <span className='flex items-center gap-1.5'>
              <BookOpen className='h-4 w-4' /> {t('title')}
            </span>
            <span>•</span>
            <span>
              {data.totalQuestions} {t('question')}
            </span>
          </div>

          {/* Stats */}
          <div className='mt-6 grid grid-cols-2 gap-4 p-4 md:grid-cols-4'>
            <div className='flex items-center gap-3 border-r-2'>
              <ProgressCircle
                value={data.averageScore}
                size={40}
                className='text-red-500'
                showPercentageText={false}
                strokeWidth={4}
              />
              <div>
                <span className='text-xs text-gray-500'>{t('score')}</span>
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
                <span className='text-xs text-gray-500'>{t('passRate')}</span>
                <p className='text-lg font-semibold'>{data.passRate}%</p>
              </div>
            </div>
            <div>
              <span className='text-xs text-gray-500'>{t('submission')}</span>
              <p className='text-lg font-semibold'>{data.submissions}</p>
            </div>
          </div>
        </div>
        <div className='flex-shrink-0'>
          <img src='/images/stemclass.jpg' alt='UI Design' className='h-60 w-full rounded-lg object-cover md:w-120' />
        </div>
      </div>
    </div>
  )
}
