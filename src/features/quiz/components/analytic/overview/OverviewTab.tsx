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
      <Alert className='border-yellow-200 bg-yellow-50'>
        <AlertTitle className='text-yellow-800'>1 Question needs a review for thorough scoring!</AlertTitle>
        <AlertDescription className='flex items-center justify-between'>
          <span className='text-yellow-700'>Check the question that needs your review.</span>
          <Button variant='link' className='h-auto p-0 font-semibold text-yellow-800'>
            View Question
          </Button>
        </AlertDescription>
      </Alert>
      <AnswerGridTable data={data} studentData={data.studentStatistics} questionData={data.questionStatistics} />
    </div>
  )
}
