import SAvatar from '@/components/shared/SAvatar'
import { UserRole } from '@/types/userRole'
import { Star } from 'lucide-react'
import React from 'react'

type FeedbackCardProps = {
  src?: string
  name?: string
  date?: string
  role?: UserRole
  title?: string
  rating?: number
  description?: string
}

export default function FeedbackCard({ name, src, date, title, role, rating, description }: FeedbackCardProps) {
  if (!src || !name || !date || !title || !rating || !description) {
    src = 'https://github.com/evilrabbit.png'
    name = 'John Doe'
    date = 'June 1, 2000'
    title = 'Great Experience!'
    rating = 5
    description =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur ipsum, sed dapibus eros.'
    role = UserRole.TEACHER
  }
  return (
    <div className='shadow-6 my-10 flex w-full max-w-md flex-col gap-2 rounded-xl bg-white p-5 duration-150 hover:scale-105 hover:duration-150 dark:bg-neutral-900 dark:text-white'>
      <div className='flex w-full flex-row justify-between'>
        <div className='flex w-full flex-row justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <SAvatar src={src} className='h-8 w-8' />
            <div>
              <p className='text-xs font-bold text-gray-700'>{name}</p>
              <p className='text-xs text-gray-700'>{role}</p>
            </div>
          </div>
          <p className='text-xs text-gray-700'>{date}</p>
        </div>
      </div>
      <div className='flex w-full flex-row justify-between'>
        <h3 className='text-lg font-bold text-gray-700'>{title}</h3>

        <div className='text-xs'>
          <div className='flex flex-row'>
            <Star className='h-4 w-4 fill-yellow-400 stroke-yellow-400 text-yellow-400' />
            <Star className='h-4 w-4 fill-yellow-400 stroke-yellow-400 text-yellow-400' />
            <Star className='h-4 w-4 fill-yellow-400 stroke-yellow-400 text-yellow-400' />
            <Star className='h-4 w-4 fill-yellow-400 stroke-yellow-400 text-yellow-400' />
            <Star className='h-4 w-4 text-yellow-400' />
          </div>
        </div>
      </div>

      <div className='text-xs text-gray-500'>{description}</div>
    </div>
  )
}
