import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Progress } from '@/components/shadcn/progress'
import { TrainingStatus } from '@/features/AI-model/UseTeachableMachine'
import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface TrainingSectionProps {
  isTraining: boolean
  trainingProgress: number
  trainingStatus: TrainingStatus | null
  onTrain: () => void
}

export function TrainingSection({ isTraining, trainingProgress, trainingStatus, onTrain }: TrainingSectionProps) {
  const t = useTranslations('agent.modelMaker')
  const tc = useTranslations('common')
  const getStatusColor = (type: TrainingStatus['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <Card className='mx-auto flex w-fit flex-col items-center justify-center rounded-2xl p-4 text-center shadow-md'>
      <h2 className='mb-2 text-xl'>Train Model</h2>
      <p className='mb-5 opacity-90'>{t('model.description')}</p>

      <Button onClick={onTrain} disabled={isTraining} className='bg-sky-100 text-blue-500'>
        {isTraining ? <Loader/> : 'Train Model'}
      </Button>

      <Progress value={trainingProgress} className='mt-4 h-2 w-full bg-gray-300 [&>div]:bg-blue-400' />

      {trainingStatus && (
        <Card className={`mt-5 rounded-lg border p-2.5 text-sm ${getStatusColor(trainingStatus.type)}`}>
          {trainingStatus.message}
        </Card>
      )}
    </Card>
  )
}
