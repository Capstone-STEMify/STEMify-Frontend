'use client'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { BookOpenCheck, CheckCircle, FileText, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CurriculumEnrollment, EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'
import { Progress } from '@/components/shadcn/progress'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { set } from 'zod'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import {
  useCreateCourseEnrollmentMutation,
  useDeleteCourseEnrollmentMutation
} from '@/features/enrollment/api/courseEnrollmentApi'
import { toast } from 'sonner'

interface SpecializationCardProps {
  curriculum: CurriculumEnrollment
  itemValue: string
}

export const SpecializationCard = ({ curriculum, itemValue }: SpecializationCardProps) => {
  const locale = useLocale()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const tt = useTranslations('toast')
  const auth = useAppSelector((state) => state.auth)

  const [deleteCourseEnrollment] = useDeleteCourseEnrollmentMutation()
  const [createEnrollment, { data: enroll }] = useCreateCourseEnrollmentMutation()

  const handleUnerollFromCourse = (courseEnrollmentId: number) => {
    deleteCourseEnrollment(courseEnrollmentId).unwrap()
  }
  const handleCourseEnrollment = (courseId: number, curriculumEnrollmentId: number) => {
    createEnrollment({
      curriculumEnrollmentId: curriculumEnrollmentId,
      courseId: courseId,
      studentId: auth?.user?.userId,
      status: EnrollmentStatus.IN_PROGRESS
    })
    router.push(`/resource/course/${courseId}/learn`)

    toast.success(tt('successMessage.enroll'), {
      description: `${tt('successMessage.enrollDes', { title: enroll?.data.courseTitle || '' })}`
    })
  }

  return (
    <AccordionItem value={itemValue} className='border-b-0'>
      <Card className='overflow-hidden shadow-sm transition-all hover:shadow-md'>
        <AccordionTrigger className='p-4 text-left hover:no-underline [&_svg]:hidden'>
          <div className='flex w-full items-center justify-between px-4'>
            <div className='flex items-start gap-4'>
              <div>
                <Image
                  className='aspect-square rounded-sm border bg-white object-contain shadow-sm'
                  src={curriculum.coverImageUrl ?? '/HomeFiles/learning.png'}
                  width={120}
                  height={120}
                  alt='Specialization'
                ></Image>
              </div>
              <div>
                <h3
                  className='cursor-pointer text-lg font-bold text-gray-900 hover:underline'
                  onClick={() => {
                    router.push(`/${locale}/resource/curriculum/${curriculum.curriculumId}`)
                  }}
                >
                  {curriculum.curriculumTitle}
                </h3>
                <p className='text-sm text-gray-500'>{curriculum.status}</p>
                <Progress value={curriculum.progressPercentage} className='mt-1 h-2 w-150 [&>div]:bg-sky-500' />
                <span className='text-sm font-medium text-gray-700'>{curriculum.progressPercentage ?? 0}%</span>
              </div>
            </div>
            <MoreHorizontal className='ml-4 h-5 w-5 flex-shrink-0 cursor-pointer text-gray-500' />
          </div>
        </AccordionTrigger>

        <AccordionContent>
          {curriculum.status == EnrollmentStatus.COMPLETED && (
            <div className='flex flex-col items-center gap-6 bg-blue-50/70 p-16 sm:flex-row'>
              <div className='sm:w-2/5 lg:w-2/3'>
                <h4 className='text-4xl font-semibold text-gray-900'>
                  Congratulations on earning your {curriculum.curriculumTitle} Specialization Certificate!
                </h4>
                <div className='mt-4 flex gap-3'>
                  <Button
                    className='bg-sky-500 text-white'
                    variant='outline'
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/${locale}/certificate/${curriculum.verificationCode}`)
                    }}
                  >
                    View Certificate
                  </Button>
                </div>
              </div>
              <div className='flex justify-center sm:w-2/5 sm:justify-end lg:w-2/5'>
                <Image
                  src={curriculum.certificateUrl ?? ''}
                  alt='Certificate'
                  width={280}
                  height={200}
                  className='rounded-md border bg-white p-1 shadow-md'
                />
              </div>
            </div>
          )}

          <div className='bg-white pl-12'>
            {curriculum.courseEnrollments.map((course, index) => (
              <div key={index} className='flex items-center justify-between border-t p-4'>
                <div className='flex items-center gap-4'>
                  <Image
                    className='aspect-square rounded-sm object-contain'
                    src={course.coverImageUrl ?? ''}
                    width={64}
                    height={64}
                    alt='Specialization'
                  ></Image>
                  <div>
                    <p
                      className='cursor-pointer font-semibold text-gray-900 hover:underline'
                      onClick={() => {
                        if (course.status)
                          router.push(`/${locale}/resource/course/${course.courseId}/learn?enrollmentId=${course.id}`)
                        else router.push(`/${locale}/resource/course/${course.courseId}`)
                      }}
                    >
                      {course.courseTitle}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Course {index + 1} of {curriculum.courseEnrollments.length} · <span>{course.status}</span>
                    </p>
                    <Progress value={course.progressPercentage} className='mt-1 h-2 w-150 [&>div]:bg-sky-500' />
                    <span className='text-sm font-medium text-gray-700'>{course.progressPercentage ?? 0}%</span>
                    {course.status === EnrollmentStatus.COMPLETED && (
                      <div className='mt-1 text-sm text-gray-600'>
                        {/* fix later */}
                        Grade Achieved: <span className='font-semibold'>{course.finalScore ?? 0}%</span>
                        <p>Completed At: {new Date(course.completedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    {course.certificateUrl && (
                      <div>
                        <Button
                          className='bg-white text-blue-500 shadow-none outline-none hover:underline'
                          onClick={() => router.push(`/${locale}/certificate/${course.certificateId}`)}
                        >
                          View Certificate
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  {course.status == EnrollmentStatus.IN_PROGRESS && (
                    <Button
                      className='bg-sky-100 text-blue-600'
                      onClick={() => {
                        router.push(`/${locale}/resource/course/${course.courseId}/learn?enrollmentId=${course.id}`)
                      }}
                    >
                      Resume
                    </Button>
                  )}
                  {!course.status && (
                    <Button onClick={() => handleCourseEnrollment(course.courseId, curriculum.id)}>Get Started</Button>
                  )}
                  {course.status == EnrollmentStatus.IN_PROGRESS && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type='button'>
                          <MoreHorizontal className='ml-4 h-5 w-5 flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700' />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align='start' className='w-32'>
                        <DropdownMenuItem
                          className='text-red-600 focus:text-red-700'
                          onClick={() => handleUnerollFromCourse(course.id)}
                        >
                          Unenroll
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  )
}
