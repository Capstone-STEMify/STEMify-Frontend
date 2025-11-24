import React from 'react'
import { motion, time } from 'framer-motion'
import { ArrowRightFromLine, CalendarFold, Edit, Heart, ShoppingCartIcon } from 'lucide-react'
import { fadeInUp } from '@/utils/motion'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks/redux-hooks'
import BackButton from '@/components/shared/button/BackButton'
import { LicenseType, UserRole } from '@/types/userRole'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useUpdateCourseMutation } from '@/features/resource/course/api/courseApi'
import { useLocale, useTranslations } from 'next-intl'
import { Curriculum } from '../../types/curriculum.type'
import {
  useCreateCurriculumEnrollmentMutation,
  useSearchCurriculumEnrollmentQuery,
  useUpdateCurriculumEnrollmentMutation
} from '@/features/enrollment/api/curriculumEnrollmentApi'
import { EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'
import { use } from 'matter'

interface HeroSectionProps {
  curriculum: Curriculum | undefined
  token?: string
}

type TagGroupProps = {
  label: string
  items: string[]
  className?: string
}

const curGrade = ['K-8', 'K-12', '1-5', '6-8', '9-12']

const ageRange = ['6-8', '9-11', '12-14']

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

export default function CurriculumHeroSection({ curriculum, token }: HeroSectionProps) {
  const t = useTranslations('course')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const locale = useLocale()

  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)
  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const params = useAppSelector((state) => state.curriculumEnrollment)

  const { data: curriculumEnrollment } = useSearchCurriculumEnrollmentQuery(
    {
      curriculumId: curriculum?.id,
      studentId: auth?.user?.userId || ''
    },
    { skip: !auth.user?.userId || !curriculum?.id || userRole !== LicenseType.STUDENT }
  )

  const [createEnrollment, { data: createEnrollmentResponse }] = useCreateCurriculumEnrollmentMutation()
  const [updateEnrollment, { data: updateEnrollmentResponse }] = useUpdateCurriculumEnrollmentMutation()
  const [updateCourseStatus] = useUpdateCourseMutation()

  const handleAddToCart = () => {
    if (!auth.user?.userId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (curriculum?.id) {
      // TODO: add to cart functionality, after payment success, system will auto create enrollment with NOT_STARTED status
      //  For now, we just create enrollment with NOT_STARTED status when user click "Add to Cart" button
      createEnrollment({
        curriculumId: curriculum.id,
        studentId: auth?.user?.userId,
        status: EnrollmentStatus.NOT_STARTED
      })
      toast.success(tt('successMessage.enroll'), {
        description: `${tt('successMessage.enrollDes', { title: createEnrollmentResponse?.data.curriculumTitle || '' })}`
      })
    }
  }

  const handleEnroll = () => {
    if (!auth.user?.userId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (curriculum?.id) {
      createEnrollment({
        curriculumId: curriculum.id,
        studentId: auth?.user?.userId,
        status: EnrollmentStatus.IN_PROGRESS
      })
      toast.success(tt('successMessage.enroll'), {
        description: `${tt('successMessage.enrollDes', { title: createEnrollmentResponse?.data.curriculumTitle || '' })}`
      })
      router.push(`/${locale}/resource/course/${curriculum?.courses[0].id}/learn`)
    }
  }

  // const handleUpdate = () => {
  //   router.push(`/resource/course/update/${course.id}`)
  // }

  // const handleSubmitToReview = async () => {
  //   try {
  //     toast.info(tt('successMessage.review'))

  //     await updateCourseStatus({
  //       id: course.id,
  //       body: {
  //         status: CourseStatus.PENDING
  //       }
  //     }).unwrap()
  //   } catch (error) {
  //     console.error('Failed to update course status:', error)
  //   }
  // }

  return (
    <motion.section initial='hidden' animate='visible' variants={fadeInUp} className='bg-sky-50 pt-14 pb-26'>
      <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='grid items-center gap-8 lg:grid-cols-2'>
          <div className='space-y-4'>
            <BackButton />
            <div className='mx-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800'>
              {curriculum?.code}
            </div>

            <h1 className='text-2xl leading-tight font-bold text-blue-800 lg:text-4xl'>{curriculum?.title}</h1>

            <p className='text-lg leading-relaxed text-gray-600'>{curriculum?.description}</p>

            <div className='space-x-6 text-sm'>
              <TagGroup
                label={t('details.tags.topic')}
                items={curriculum?.topics ?? []}
                className='bg-emerald-100 text-emerald-700'
              />
              <TagGroup
                label={t('details.tags.skill')}
                items={curriculum?.skills ?? []}
                className='bg-red-100 text-red-800'
              />
              {/* <TagGroup
                label={t('details.tags.standard')}
                items={course.standardNames}
                className='text-orange-custom-500 bg-yellow-custom-50'
              /> */}
            </div>

            {/* if user is guest or student without enrollment */}
            {userRole === UserRole.GUEST ||
            (userRole === LicenseType.STUDENT && !curriculumEnrollment?.data.items[0]) ? (
              <div>
                <div className='mt-6 flex flex-col gap-4 sm:flex-row'>
                  <Button
                    onClick={handleEnroll}
                    className='bg-sky-custom-600 w-fit cursor-pointer rounded-4xl py-6 text-lg text-white'
                  >
                    {tc('button.enroll')}
                  </Button>
                  <Button className='text-sky-custom-600 border-sky-custom-600 w-fit cursor-pointer rounded-4xl border bg-white py-6 text-lg'>
                    <Heart className='h-5 w-5' />
                    {tc('button.wishlist')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className='flex items-center gap-5'>
                <Button
                  onClick={() => router.push(`/${locale}/resource/course/${curriculum?.courses[0].id}/learn`)}
                  className='bg-sky-custom-600 w-fit cursor-pointer rounded-4xl py-6 text-lg text-white'
                >
                  <ArrowRightFromLine className='h-5 w-5' />
                  {tc('button.goToCourse')}
                </Button>
                <p className='text-sm text-green-700 italic'>{t('details.alreadyEnrolled')}</p>
              </div>
            )}
          </div>

          <div className='mb-5 w-full flex-1'>
            <Image
              src={
                curriculum?.imageUrl ||
                'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
              }
              width={400}
              height={250}
              alt={curriculum?.title ?? ''}
              className='aspect-[16/10] w-full rounded-2xl border-4 border-white object-cover'
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
