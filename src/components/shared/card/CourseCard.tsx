import Image, { StaticImageData } from 'next/image'
import React from 'react'
import logo from '../../../../public/images/pink.png'
import Link from 'next/link'

export enum CourseStatus {
  // status for course cart
  LATEST = 'Latest',
  POPULAR = 'Popular',

  // status for course class
  COMPLETED = 'Completed',
  ONGOING = 'Ongoing',

  // error
  ERROR = 'Error'
}
export interface CourseCardProps {
  status: CourseStatus
  title: string
  date: string
  duration: string
  category: string
  image: string | StaticImageData
  description: string
  link: string
}

export default function CourseCard({ status, title, date, duration, image, description, link }: CourseCardProps) {
  // Default values for the props
  if (!image || !title || !date || !duration || !description) {
    status = CourseStatus.ERROR
    link = '#'
    title = 'No title available for this course.'
    image = logo
    description = 'No description available for this course.'
    date = 'Unknown date'
    duration = '0'
  }
  return (
    <div className='shadow-6 w-[300px] rounded-2xl p-5 transition-transform duration-300 hover:scale-105'>
      <Link href={link} className='group mt-32'>
        <figure className='relative mb-1 overflow-hidden rounded-lg'>
          <Image src={image} alt='sos' className='object-cover' />
          <span className='absolute top-2 left-2 rounded-full bg-white/65 px-3 py-1 text-xs text-black backdrop-blur-sm'>
            {status}
          </span>
        </figure>
        <div className='text-xs text-black'>
          {date}
          <span className='mx-1'>⦁</span>
          {duration} min
        </div>

        <p className='mt-2 text-lg text-black'>{title}</p>
        <p className='mt-1 line-clamp-2 text-sm text-black opacity-50 transition-opacity duration-300 group-hover:opacity-90'>
          {description}
        </p>
      </Link>
    </div>
  )
}
