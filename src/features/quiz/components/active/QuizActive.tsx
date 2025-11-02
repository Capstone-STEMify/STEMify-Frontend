import { QuizStatistics } from '../../types/studentQuiz.type'
import { QuizTable } from './table/QuizTable'
import { QuizToolbar } from './tool-bar/QuizToolBar'

type QuizActiveProps = {
  data: QuizStatistics[]
}

export default function QuizActive({ data }: QuizActiveProps) {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl'>
        <QuizToolbar />
        <QuizTable data={data} />
      </div>
    </div>
  )
}
