import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { PredictionResult } from '@/features/AI-model/UseTeachableMachine'

interface PredictionResultsProps {
  results: PredictionResult[]
}

export function PredictionResults({ results }: PredictionResultsProps) {
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

            return (
              <div key={index} className='rounded-lg bg-white p-2.5'>
                <div className='mb-1 flex items-center justify-between'>
                  <span className='font-bold text-gray-800'>{result.className}</span>
                  <span className='text-gray-600'>{percentage}%</span>
                </div>
                <div className='h-5 w-full overflow-hidden rounded-full bg-gray-200'>
                  <div
                    className='h-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe] transition-all duration-300'
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
