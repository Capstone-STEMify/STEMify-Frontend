import { Button } from '@/components/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { ChevronDown, Info, ArrowDownUp } from 'lucide-react'
import { QuestionCard } from '../card/QuestionCard'
import { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'

type QuestionDetailTabProps = {
  data: QuizStatistics
}

export function QuestionDetailTab({ data }: QuestionDetailTabProps) {
  return (
    <div className='mb-10 space-y-6'>
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Info className='h-4 w-4 flex-shrink-0' />
          <p>This Tab Shows the accumulated data of all learner attempts</p>
        </div>
      </div>

      <div className='space-y-6'>
        <QuestionCard data={data.questionStatistics} totalQuestion={data.totalQuestions} />
      </div>
    </div>
  )
}
