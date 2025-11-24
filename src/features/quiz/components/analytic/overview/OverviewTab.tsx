import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert'
import { Button } from '@/components/shadcn/button'
import { AnswerGridTable } from '../table/AnswerTable'
import { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'

type LearnerOverviewTabProps = {
  data: QuizStatistics
}

export function LearnerOverviewTab({ data }: LearnerOverviewTabProps) {
  return (
    <div className='space-y-6'>
      <AnswerGridTable data={data} studentData={data.studentStatistics} questionData={data.questionStatistics} />
    </div>
  )
}
