import { QuizTable } from './table/QuizTable'
import { QuizToolbar } from './tool-bar/QuizToolBar'

export default function QuizActive() {
  return (
    <div className='min-h-screen bg-white p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl'>
        <QuizToolbar />
        <QuizTable />
      </div>
    </div>
  )
}
