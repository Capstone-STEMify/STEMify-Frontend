import SEmpty from '@/components/shared/empty/SEmpty'
import { QuizStatistics } from '../../types/studentQuiz.type'
import { QuizCardGrid } from './card-grid/QuizCardGrid'
import { QuizOverviewToolbar } from './tool-bar/OverviewToolBar'

type QuizOverviewProps = {
  data: QuizStatistics[]
}

export default function QuizOverview({ data }: QuizOverviewProps) {
  const QuizHeader = () => (
    <div>
      <h1 className='text-2xl font-bold tracking-tight'>Quiz</h1>
    </div>
  )

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl'>
        {/* <QuizOverviewToolbar /> */}
        {data.length > 0 ? <QuizCardGrid data={data} /> : <SEmpty title='Không có bài quiz nào' />}
      </div>
    </div>
  )
}
