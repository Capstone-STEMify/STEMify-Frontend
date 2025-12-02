import { CheckIcon } from 'lucide-react'
import React from 'react'

type LearningOutcome = {
  id: number
  name: string
  description: string
  curriculumId?: number
  courseId?: number
  programLearningOutcomeIds?: number[]
}

export default function LearningObjectives({ title, outcomes }: { title?: string; outcomes?: LearningOutcome[] }) {
  return (
    <div className='mx-auto max-w-7xl p-6'>
      <h2 className='mb-2 text-2xl font-bold text-gray-800'>{title}</h2>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {outcomes?.map((outcome) => (
          <div key={outcome.id} className='flex items-start space-x-3'>
            <div className='mt-1 flex-shrink-0'>
              <CheckIcon className='h-5 w-5 text-green-600' />
            </div>
            <p className='text-base leading-relaxed text-gray-700'>{outcome.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
