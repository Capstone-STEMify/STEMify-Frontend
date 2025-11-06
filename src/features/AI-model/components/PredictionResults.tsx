import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { PredictionResult } from '@/features/AI-model/UseTeachableMachine'

interface PredictionResultsProps {
  results: PredictionResult[]
}

export function PredictionResults({ results }: PredictionResultsProps) {
  const gradients = [
    'from-sky-400 to-blue-500',
    'from-emerald-400 to-green-500',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-violet-400 to-purple-500',
    'from-cyan-400 to-teal-500',
    'from-lime-400 to-green-500'
  ]

  const getColorForClass = (className: string) => {
    let hash = 0
    for (let i = 0; i < className.length; i++) {
      hash = className.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % gradients.length
    return gradients[index]
  }

  return (
    <Card className='bg-gray-50 p-4'>
      <CardHeader>
        <CardTitle className='text-xl'>Kết quả phân loại</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2.5'>
          {results.map((result, index) => {
            const percentage = (result.probability * 100).toFixed(1)
            const barWidth = percentage
            const gradient = getColorForClass(result.className)

            return (
              <div key={index} className='rounded-lg bg-white p-2.5'>
                <div className='mb-1 flex items-center justify-between'>
                  <span className='font-bold text-gray-800'>{result.className}</span>
                  <span className='text-gray-600'>{percentage}%</span>
                </div>
                <div className='h-5 w-full overflow-hidden rounded-full bg-gray-200'>
                  <div
                    className={`h-full bg-gradient-to-r ${gradient} transition-all duration-300`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
