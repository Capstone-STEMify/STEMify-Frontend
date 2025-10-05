import React from 'react'
import { motion, time } from 'framer-motion'
import { CalendarFold, Edit, Heart, ShoppingCartIcon } from 'lucide-react'
import { TbDoorExit } from 'react-icons/tb'
import { fadeInUp } from '@/utils/motion'
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
import { Curriculum } from '../../types/curriculum.type'

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
    if (curriculum?.id) {
      createEnroll({ id: curriculum.id, studentId: auth?.user?.userId })
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

            {userRole === UserRole.STUDENT || userRole === UserRole.GUEST ? (
              <div>
                <div className='mt-2 flex items-center gap-3'>
                  <span className='text-2xl font-bold text-gray-700'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      curriculum?.price ?? 0
                    )}
                  </span>
                </div>
                <div className='mt-6 flex flex-col gap-4 sm:flex-row'>
                  <Button
                    onClick={handleEnroll}
                    className='bg-sky-custom-600 w-fit cursor-pointer rounded-4xl py-6 text-lg text-white'
                  >
                    <ShoppingCartIcon className='h-5 w-5' />
                    {tc('button.addToCart')}
                  </Button>
                  <Button className='text-sky-custom-600 border-sky-custom-600 w-fit cursor-pointer rounded-4xl border bg-white py-6 text-lg'>
                    <Heart className='h-5 w-5' />
                    {tc('button.wishlist')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className='flex gap-5'>
                {/* <Button
                  onClick={handleUpdate}
                  className='bg-sky-custom-600 w-fit cursor-pointer rounded-4xl py-6 text-lg text-white'
                >
                  <Edit className='h-5 w-5' />
                  {tc('button.updateCourse')}
                </Button>
                {course.status === CourseStatus.DRAFT && (
                  <Button
                    onClick={handleSubmitToReview}
                    className='text-sky-custom-600 border-sky-custom-600 w-fit cursor-pointer rounded-4xl border bg-white py-6 text-lg'
                  >
                    <Edit className='h-5 w-5' />
                    {tc('button.review')}
                  </Button>
                )} */}
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
