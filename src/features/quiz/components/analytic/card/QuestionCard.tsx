import { Card, CardContent } from '@/components/shadcn/card'
import { Progress } from '@/components/shadcn/progress'
import { HelpCircle, Layers, Star, Clock, Check, X } from 'lucide-react'
import { ProgressCircle } from '../../active/circle/AccuracyCircle'
import { QuestionStatistic } from '@/features/quiz/types/studentQuiz.type'
import { useTranslations } from 'next-intl'

type QuestionCardProps = {
  data: QuestionStatistic[]
  totalQuestion: number
}

type StatisticBoxProps = {
  statisticData: QuestionStatistic
}

const StatisticsBox = ({ statisticData }: StatisticBoxProps) => {
  const t = useTranslations('quiz.teacher')
  return (
    <div className='space-y-4 rounded-lg border p-6'>
      <h3 className='text-base font-semibold'>{t('questionTab.statistic')}</h3>
      <div className='flex items-center gap-3'>
        <div className='rounded-full bg-green-100 p-1.5'>
          <Check className='h-4 w-4 text-green-600' />
        </div>
        <div>
          <span className='text-sm text-gray-500'>{t('answerTable.correct')}</span>
          <p className='font-semibold'>{statisticData.totalCorrectAnswers}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <div className='rounded-full bg-red-100 p-1.5'>
          <X className='h-4 w-4 text-red-600' />
        </div>
        <div>
          <span className='text-sm text-gray-500'>{t('answerTable.incorrect')}</span>
          <p className='font-semibold'>{statisticData.totalIncorrectAnswers}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <ProgressCircle
          value={statisticData.correctRate}
          size={28}
          className='text-green-500'
          strokeWidth={3}
          showPercentageText={false}
        />
        <div>
          <span className='text-sm text-gray-500'>{t('answerTable.accuracy')}</span>
          <p className='font-semibold'>{statisticData.correctRate}</p>
        </div>
      </div>
    </div>
  )
}

const AnswerOption = ({
  label,
  percentage,
  responses,
  isCorrect
}: {
  label: string
  percentage: number
  responses: number
  isCorrect?: boolean
}) => {
  const t = useTranslations('quiz.teacher')
  return (
    <div>
      <p className='mb-1.5 text-sm font-medium'>{label}</p>
      <Progress value={percentage} className={`h-2 ${isCorrect ? '[&>div]:bg-teal-500' : ''}`} />
      <div className='mt-1.5 flex items-center justify-between'>
        <span className='text-xs text-gray-500'>
          {responses} {t('questionTab.resp')}.
        </span>
        <span className='text-xs text-gray-500'>{percentage}%</span>
      </div>
    </div>
  )
}

export function QuestionCard({ data, totalQuestion }: QuestionCardProps) {
  const t = useTranslations('quiz.teacher')
  return (
    <>
      {data.map((questions, index) => (
        <Card key={questions.questionId}>
          <CardContent className='p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-2 font-semibold'>
                <HelpCircle className='h-5 w-5 text-gray-400' />
                <span>
                  Q{index + 1} of {totalQuestion}
                </span>
              </div>
              <div className='flex items-center gap-4 text-xs text-gray-600'>
                <span className='flex items-center gap-1.5 rounded-md bg-gray-100 p-2 font-semibold'>
                  <Layers className='h-4 w-4' /> {questions.questionType}
                </span>
                <span className='flex items-center gap-1.5'>
                  <Star className='h-4 w-4 text-yellow-500' /> {questions.point} {t('answerTable.point')}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
              <div className='space-y-6 lg:col-span-2'>
                <p className='text-lg font-semibold'>{questions.questionTitle}</p>
                <div className='space-y-4 pt-2'>
                  {questions.answerStatistics.map((answer) => {
                    const totalResponses = questions.totalCorrectAnswers + questions.totalIncorrectAnswers
                    const percentage =
                      totalResponses > 0 ? Math.round((answer.selectionCount / totalResponses) * 100) : 0
                    return (
                      <AnswerOption
                        key={answer.answerId}
                        label={answer.content}
                        percentage={percentage}
                        responses={answer.selectionCount}
                        isCorrect={answer.isCorrect}
                      />
                    )
                  })}
                </div>
              </div>

              <div className='lg:col-span-1'>
                <StatisticsBox statisticData={questions} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
