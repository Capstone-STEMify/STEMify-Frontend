import { CardShell } from '@/components/shared/card/CardShell'
import { ClockFading } from 'lucide-react'

type Activity = {
  title: string
  description: string
  image: string
  category: string
  age: string
  duration: string
}

type Props = {
  resource: Activity
}

export default function ActivityCard({ resource }: Props) {
  return (
    <CardShell
      image={resource.image}
      tags={
        <>
          <span className='bg-opacity-80 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
            {resource.category}
          </span>
          <span className='bg-opacity-80 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
            Ages {resource.age}
          </span>
        </>
      }
      rightIcon={
        <svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      }
    >
      <h3 className='mb-3 text-xl font-semibold'>{resource.title}</h3>
      <p className='leading-relaxed'>{resource.description}</p>
      <div className='bg-opacity-80 mt-4 flex w-fit items-center gap-2 rounded-full bg-gray-300 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
        <ClockFading size={16} />
        <span>{resource.duration}</span>
      </div>
    </CardShell>
  )
}
