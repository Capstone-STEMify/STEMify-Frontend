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

type QuizDetailHeaderProps = {
  data: QuizStatistics
}

export function QuizDetailHeader({data}: QuizDetailHeaderProps) {
  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/quiz'>Quiz</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.quizName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className='flex items-center gap-2'>
          <Button variant='outline'>
            <Share2 className='mr-2 h-4 w-4' /> Share
          </Button>
          <Button variant='outline' size='icon'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='flex-grow'>
          <div className='mb-2 flex items-center gap-2'>
            <Badge variant='outline' className='text-gray-600'>
              <Clock className='mr-1.5 h-3 w-3' /> LIVE
            </Badge>
            <Badge variant='outline' className='border-green-200 bg-green-50 text-green-600'>
              <CheckCircle className='mr-1.5 h-3 w-3' /> Completed
            </Badge>
          </div>
          <h1 className='flex items-center gap-2 text-2xl font-bold'>
            {data.quizName}
            <Edit2 className='h-5 w-5 cursor-pointer text-gray-400' />
          </h1>
          {/* <div className='mt-3 mb-4 flex items-center gap-2'>
            <Badge>Fundamental</Badge>
            <Badge>Design</Badge>
            <Badge>Not Urgent</Badge>
          </div> */}
          <div className='flex items-center gap-4 text-sm text-gray-500 mt-2'>
            <span className='flex items-center gap-1.5'>
              <BookOpen className='h-4 w-4' /> Quiz
            </span>
            <span>•</span>
            <span>{data.totalQuestions} Question(s)</span>
            <span>•</span>
            <span>Started date 28 Sep 2023</span>
          </div>

          {/* Stats */}
          <div className='mt-6 grid grid-cols-2 gap-4 p-4 md:grid-cols-4'>
            <div className='flex items-center gap-3 border-r-2'>
              <ProgressCircle value={data.averageScore} size={40} className='text-red-500' showPercentageText={false} strokeWidth={4} />
              <div>
                <span className='text-xs text-gray-500'>Accuracy</span>
                <p className='text-lg font-semibold'>50%</p>
              </div>
            </div>
            <div className='flex items-center gap-3 border-r-2'>
              <ProgressCircle value={data.passRate} size={40} className='text-green-500' showPercentageText={false} strokeWidth={4}/>
              <div>
                <span className='text-xs text-gray-500'>Completed Course</span>
                <p className='text-lg font-semibold'>100%</p>
              </div>
            </div>
            <div className='border-r-2'>
              <span className='text-xs text-gray-500'>Submissions</span>
              <p className='text-lg font-semibold'>{data.submissions}</p>
            </div>
            <div>
              <span className='text-xs text-gray-500'>Time</span>
              <p className='text-sm font-semibold'>{data.timeLimitMinutes} min(s)</p>
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
