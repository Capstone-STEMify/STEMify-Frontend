import React from 'react'
import { motion, time } from 'framer-motion'
import { CalendarFold, Edit, Heart, ShoppingCart, ShoppingCartIcon } from 'lucide-react'
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
import { useUpdateCourseMutation } from '@/features/resource/course/api/courseApi'
import { useTranslations } from 'next-intl'
import { EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'

interface HeroSectionProps {
  course: Course
  token?: string
  enrollmentStatus?: string
  enrollmentId?: number
}

type TagGroupProps = {
  label: string
  items: string[]
  className?: string
}

const TagGroup = ({ label, items, className }: TagGroupProps) => (
  <div className='mb-4 gap-1'>
    <div className='flex flex-wrap gap-2'>
      <p className='font-semibold'>{label}: </p>
      {items.map((item, index) => (
        <Badge key={index} className={`${className} rounded-full px-3 py-1`}>
          {item}
        </Badge>
      ))}
    </div>
  </div>
)

export default function HeroSection({ course, token, enrollmentStatus, enrollmentId }: HeroSectionProps) {
  const t = useTranslations('course')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)
  const userRole = auth.user?.role || UserRole.GUEST
  const [createEnroll, { data: enroll }] = useCreateEnrollmentMutaion()
  const [updateCourseStatus] = useUpdateCourseMutation()

  const handleEnroll = () => {
    if (!auth.user?.userId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (course.id) {
      createEnroll({ courseId: course.id, studentId: auth?.user?.userId })
    }
    toast.success(tt('successMessage.enroll'), {
      description: `${tt('successMessage.enrollDes', { title: enroll?.data.courseTitle || '', time: enroll?.data.enrolledAt || '' })}`,
      action: {
        label: 'View Enrollment',
        onClick: () => {
          console.log('Navigate to enrollment details:', enroll)
        }
      }
    })
  }

  const handleAddToCart = () => {
    if (!auth.user?.userId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (course.id) {
      // TODO: Logic to add to cart can be implemented here
    }
    toast.success(tt('successMessage.addToCart'), {
      description: `${tt('successMessage.addToCartDes', { title: enroll?.data.courseTitle || '' })}`,
      action: {
        label: 'View Cart',
        onClick: () => {
          console.log('Navigate to cart details:', enroll)
        }
      }
    })
  }

  return (
    <motion.section initial='hidden' animate='visible' variants={fadeInUp} className='mt-8 bg-sky-50 pt-14 pb-26'>
      <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='grid items-center gap-8 lg:grid-cols-2'>
          <div className='space-y-4'>
            <BackButton />
            <div className='mx-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800'>
              <CalendarFold className='mr-2 h-4 w-4' />
              {t('details.tags.ageRange')}: {course.ageRangeLabel}
            </div>

            <h1 className='text-2xl leading-tight font-bold text-blue-800 lg:text-4xl'>{course.title}</h1>

            <p className='text-lg leading-relaxed text-gray-600'>{course.description}</p>

            <div className='space-x-6 text-sm'>
              {/* Category */}
              <TagGroup label={t('details.tags.topic')} items={course.topicNames} className='bg-red-100 text-red-800' />
              {/* Skill */}
              <TagGroup
                label={t('details.tags.skill')}
                items={course.skillNames}
                className='bg-emerald-100 text-emerald-700'
              />
              {/* Standard */}
              <TagGroup
                label={t('details.tags.standard')}
                items={course.standardNames}
                className='text-orange-custom-500 bg-yellow-custom-50'
              />
              {(userRole === UserRole.GUEST || (userRole === UserRole.STUDENT && !enrollmentStatus)) && (
                <div className='mt-2 flex items-center gap-3'>
                  <span className='text-2xl font-bold text-gray-600'>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(course.price)}
                  </span>
                </div>
              )}
            </div>

            {userRole === UserRole.TEACHER || enrollmentStatus === 'inProgress' ? (
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={() => {
                    router.push(`/resource/course/${course.id}/learn?enrollmentId=${enrollmentId}`)
                  }}
                  className='bg-sky-custom-600 w-fit cursor-pointer rounded-3xl py-6 text-lg text-white'
                >
                  <TbDoorExit className='h-5 w-5' />
                  {tc('button.goToCourse')}
                </Button>
              </div>
            ) : userRole === UserRole.STUDENT && enrollmentStatus === 'notStarted' ? (
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={handleEnroll}
                  className='bg-sky-custom-600 w-fit cursor-pointer rounded-3xl py-6 text-lg text-white'
                >
                  <ShoppingCartIcon className='h-5 w-5' />
                  {tc('button.startLearning')}
                </Button>
              </div>
            ) : (
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={handleAddToCart}
                  className='bg-sky-custom-600 w-fit cursor-pointer rounded-3xl py-6 text-lg text-white'
                >
                  <ShoppingCartIcon className='h-5 w-5' />
                  {tc('button.addToCart')}
                </Button>
                <Button className='text-sky-custom-600 border-sky-custom-600 w-fit cursor-pointer rounded-3xl border bg-white py-6 text-lg'>
                  <Heart className='h-5 w-5' />
                  {tc('button.wishlist')}
                </Button>
              </div>
            )}
          </div>

          <div className='mb-5 w-full flex-1'>
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
