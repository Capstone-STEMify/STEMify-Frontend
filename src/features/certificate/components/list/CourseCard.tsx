'use client'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { FileText, MoreHorizontal } from 'lucide-react'
import { CourseEnrollment, EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'
import Image from 'next/image'
import { Progress } from '@/components/shadcn/progress'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { formatDate } from '@/utils/index'

interface CourseCardProps {
  course: CourseEnrollment
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const locale = useLocale()
  const router = useRouter()
  return (
    <Card>
      <CardContent className='flex items-center justify-between'>
        <div className='flex items-center gap-4 py-4'>
          <div>
            <Image
              className='aspect-square rounded-sm border bg-white object-contain shadow-sm'
              src={course.coverImageUrl}
              width={84}
              height={84}
              alt='Specialization'
            ></Image>
          </div>
          <div>
            <h3
              className='cursor-pointer text-base font-bold text-gray-900 hover:underline'
              onClick={() => {
                router.push(`/${locale}/resource/course/${course.courseId}/learn?enrollmentId=${course.id}`)
              }}
            >
              {course.courseTitle}
            </h3>
            <p className='mt-1 text-sm text-gray-600'>{course.status}</p>
            <Progress value={course.progressPercentage} className='mt-1 h-2 w-150 [&>div]:bg-sky-500' />
            <span className='text-sm font-medium text-gray-700'>{course.progressPercentage ?? 0}%</span>
            {course.status === EnrollmentStatus.COMPLETED && (
              <p className='mt-1 text-sm text-gray-600'>
                {/* fix later */}
                Grade Achieved: <span className='font-semibold'>95.01%</span> {' '}
                <span>Completed At: {formatDate(course.completedAt)}</span>
              </p>
            )}
          </div>
        </div>
        {course.status === EnrollmentStatus.COMPLETED ? (
          <Button
            className='ml-4 flex-shrink-0 bg-blue-500'
            onClick={() => router.push(`/${locale}/certificate/${course.certificateId}`)}
          >
            View Certificate
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type='button'>
                <MoreHorizontal className='ml-4 h-5 w-5 flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700' />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-32'>
              <DropdownMenuItem
                className='text-red-600 focus:text-red-700'
                onClick={() => console.log('Unenroll clicked')}
              >
                Unenroll
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  )
}
