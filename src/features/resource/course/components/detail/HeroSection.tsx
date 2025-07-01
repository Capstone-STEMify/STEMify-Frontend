import React from 'react'
import { motion } from 'framer-motion'
import { CalendarFold, Heart } from 'lucide-react'
import { TbDoorExit } from 'react-icons/tb'
import { fadeInUp } from '@/utils/motion'
import { Course } from '../../types/course.type'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { useCreateEnrollmentMutaion } from '@/features/classroom/api/enrollmentApi'
import { toast } from 'sonner'

interface HeroSectionProps {
  course: Course
}

type TagGroupProps = {
  label: string
  items: string[]
  className?: string
}

const TagGroup = ({ label, items, className }: TagGroupProps) => (
  <div className='mb-4 flex items-center gap-2'>
    <p className='font-semibold'>{label}: </p>
    {items.map((item, index) => (
      <Badge key={index} className={`${className} w-fit py-0.5`}>
        {item}
      </Badge>
    ))}
  </div>
)

export default function HeroSection({ course }: HeroSectionProps) {
  const [createEnroll, { data: enroll }] = useCreateEnrollmentMutaion()

  const handleEnroll = () => {
    if (course.id) {
      createEnroll({ courseId: course.id, studentId: '4839b5f4-a299-447b-af76-d95595452764' })
    }
    toast.success('Enrollment request submitted successfully!', {
      description: `You have enroll to ${enroll?.data.courseTitle} at  ${enroll?.data.enrolledAt} `,
      action: {
        label: 'View Enrollment',
        onClick: () => {
          // Navigate to enrollment details or dashboard
          console.log('Navigate to enrollment details:', enroll)
        }
      }
    })
  }

  return (
    <motion.section
      initial='hidden'
      animate='visible'
      variants={fadeInUp}
      className='mt-12 bg-gradient-to-br from-sky-200 to-blue-100 py-26'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='space-y-6'>
            <div className='inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800'>
              <CalendarFold className='mr-2 h-4 w-4' />
              Age Ranges: {course.ageRangeLabel}
            </div>

            <h1 className='text-2xl leading-tight font-bold text-gray-900 lg:text-4xl'>{course.title}</h1>

            <p className='text-lg leading-relaxed text-gray-600'>{course.description}</p>

            <div className='space-x-6 text-sm'>
              {/* Category */}
              <TagGroup label='Category' items={course.categoryNames} className='bg-indigo-100 text-indigo-800' />
              {/* Skill */}
              <TagGroup label='Skill' items={course.skillNames} className='bg-emerald-100 text-emerald-700' />
              {/* Standard */}
              <TagGroup label='Standard' items={course.standardNames} className='bg-yellow-100 text-yellow-800' />
            </div>

            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button onClick={handleEnroll} className='bg-sky-400 text-white'>
                <TbDoorExit className='mr-2 h-5 w-5' />
                Assign to Student
              </Button>
              <Button className='bg-white text-sky-400'>
                <Heart className='mr-2 h-5 w-5' />
                Wishlist
              </Button>
            </div>
          </div>

          <div className='mb-5 w-full'>
            <Image
              src={course.imageUrl || '/images/fallback.png'}
              width={400}
              height={250}
              alt={course.title ?? ''}
              className='aspect-[16/10] w-full rounded-2xl border-4 border-white object-cover shadow-xl shadow-amber-400'
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
