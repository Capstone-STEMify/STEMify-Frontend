import React from 'react'
import { motion, time } from 'framer-motion'
import { BookOpenText, CalendarFold, Heart, ShoppingCartIcon } from 'lucide-react'
import { TbDoorExit } from 'react-icons/tb'
import { fadeInUp } from '@/utils/motion'
import { Course, CourseStatus } from '../../../types/course.type'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks/redux-hooks'
import BackButton from '@/components/shared/button/BackButton'
import { LicenseType, UserRole } from '@/types/userRole'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'
import {
  useCreateCourseEnrollmentMutation,
  useUpdateCourseEnrollmentMutation
} from '@/features/enrollment/api/courseEnrollmentApi'

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
  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const [createEnrollment, { data: enroll }] = useCreateCourseEnrollmentMutation()
  const [updateEnrollment] = useUpdateCourseEnrollmentMutation()

  const handleEnroll = () => {
    if (!auth.user?.userId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (course.id) {
      createEnrollment({ courseId: course.id, studentId: auth?.user?.userId, status: EnrollmentStatus.IN_PROGRESS })
      router.push(`/resource/course/${course.id}/learn`)

      toast.success(tt('successMessage.enroll'), {
        description: `${tt('successMessage.enrollDes', { title: enroll?.data.courseTitle || '' })}`
      })
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
            </div>
            {/*
            {userRole === LicenseType.TEACHER || enrollmentStatus === EnrollmentStatus.IN_PROGRESS ? (
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
            ) : (
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={handleEnroll}
                  className='bg-sky-custom-600 w-fit cursor-pointer rounded-3xl py-6 text-lg text-white'
                >
                  <BookOpenText className='h-5 w-5' />
                  {tc('button.enroll')}
                </Button>
                <Button className='text-sky-custom-600 border-sky-custom-600 w-fit cursor-pointer rounded-3xl border bg-white py-6 text-lg'>
                  <Heart className='h-5 w-5' />
                  {tc('button.wishlist')}
                </Button>
              </div>
            )} */}
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
