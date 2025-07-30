import React from 'react'
import { motion } from 'framer-motion'
import { CalendarFold, Edit, Heart } from 'lucide-react'
import { TbDoorExit } from 'react-icons/tb'
import { fadeInUp } from '@/utils/motion'
import { Course, CourseStatus } from '../../../types/course.type'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { useCreateEnrollmentMutaion } from '@/features/enrollment/api/enrollmentApi'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks/redux-hooks'
import BackButton from '@/components/shared/button/BackButton'
import { UserRole } from '@/types/userRole'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useUpdateCourseWithFormDataMutation } from '@/features/resource/course/api/courseApi'

interface HeroSectionProps {
  course: Course
  token?: string
}

type TagGroupProps = {
  label: string
  items: string[]
  className?: string
}

const TagGroup = ({ label, items, className }: TagGroupProps) => (
  <div className='mb-4 flex items-center gap-1'>
    <p className='font-semibold'>{label}: </p>
    {items.map((item, index) => (
      <Badge key={index} className={`${className} rounded-full px-3 py-1`}>
        {item}
      </Badge>
    ))}
  </div>
)

export default function HeroSection({ course, token }: HeroSectionProps) {
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)
  const userRole = auth.user?.role || UserRole.GUEST
  const [createEnroll, { data: enroll }] = useCreateEnrollmentMutaion()
  const [updateCourseStatus] = useUpdateCourseWithFormDataMutation()

  const handleEnroll = () => {
    if (!auth.user?.userId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (course.id) {
      createEnroll({ courseId: course.id, studentId: auth?.user?.userId })
    }
    toast.success('Enrollment request submitted successfully!', {
      description: `You have enroll to ${enroll?.data.courseTitle} at  ${enroll?.data.enrolledAt} `,
      action: {
        label: 'View Enrollment',
        onClick: () => {
          console.log('Navigate to enrollment details:', enroll)
        }
      }
    })
  }

  const handleUpdate = () => {
    router.push(`/resource/course/update/${course.id}`)
  }

  const handleSubmitToReview = async () => {
    try {
      toast.info('Your course is submitted for review. Please wait for approval.')
      const formData = new FormData()
      formData.append('status', CourseStatus.INREVIEW)
      await updateCourseStatus({
        id: course.id,
        body: formData
      }).unwrap()
    } catch (error) {
      console.error('Failed to update course status:', error)
    }
  }

  return (
    <motion.section initial='hidden' animate='visible' variants={fadeInUp} className='mt-8 bg-sky-50 pt-14 pb-26'>
      <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='grid items-center gap-8 lg:grid-cols-2'>
          <div className='space-y-4'>
            <BackButton />
            <div className='mx-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800'>
              <CalendarFold className='mr-2 h-4 w-4' />
              Age Ranges: {course.ageRangeLabel}
            </div>

            <h1 className='text-2xl leading-tight font-bold text-blue-800 lg:text-4xl'>{course.title}</h1>

            <p className='text-lg leading-relaxed text-gray-600'>{course.description}</p>

            <div className='space-x-6 text-sm'>
              {/* Category */}
              <TagGroup label='Category' items={course.categoryNames} className='bg-red-100 text-red-800' />
              {/* Skill */}
              <TagGroup label='Skill' items={course.skillNames} className='bg-emerald-100 text-emerald-700' />
              {/* Standard */}
              <TagGroup
                label='Standard'
                items={course.standardNames}
                className='text-orange-custom-500 bg-yellow-custom-50'
              />
            </div>

            {userRole === UserRole.STUDENT || userRole === UserRole.GUEST ? (
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={handleEnroll}
                  className='bg-sky-custom-600 w-45 cursor-pointer rounded-4xl py-6 text-lg text-white'
                >
                  <TbDoorExit className='h-5 w-5' />
                  Enroll now
                </Button>
                <Button className='text-sky-custom-600 border-sky-custom-600 w-45 cursor-pointer rounded-4xl border bg-white py-6 text-lg'>
                  <Heart className='h-5 w-5' />
                  Wishlist
                </Button>
              </div>
            ) : (
              <div className='flex gap-5'>
                <Button
                  onClick={handleUpdate}
                  className='bg-sky-custom-600 w-45 cursor-pointer rounded-4xl py-6 text-lg text-white'
                >
                  <Edit className='h-5 w-5' />
                  Update Course
                </Button>
                {course.status === CourseStatus.DRAFT && (
                  <Button
                    onClick={handleSubmitToReview}
                    className='text-sky-custom-600 border-sky-custom-600 w-60 cursor-pointer rounded-4xl border bg-white py-6 text-lg'
                  >
                    <Edit className='h-5 w-5' />
                    Submit to Review
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className='mb-5 w-full'>
            <Image
              src={course.imageUrl || '/images/fallback.png'}
              width={400}
              height={250}
              alt={course.title ?? ''}
              className='aspect-[16/10] w-full rounded-2xl border-4 border-white object-cover'
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
