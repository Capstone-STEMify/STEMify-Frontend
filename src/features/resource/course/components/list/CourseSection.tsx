'use client'
import { Badge } from '@/components/shadcn/badge'
import { useSearchCourseQuery } from '../../api/courseApi'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDuration } from '@/utils/index'
import { useQueryParamsHandler } from '@/hooks/useQueryParamsHandler'
import { CourseParams, CourseStatus } from '@/features/resource/course/types/course.type'

export default function CourseSection() {
  const { params } = useQueryParamsHandler<CourseParams>({
    defaultParams: {
      pageNumber: 1,
      pageSize: 3,
      status: CourseStatus.PUBLISHED
    }
  })

  const { data: CourseData } = useSearchCourseQuery(params)
  return (
    <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {CourseData?.data.items.map((course, index) => {
        return (
          <CardLayout size='lg' key={index} imageSrc={course.imageUrl} infor={<Badge>{course.categoryNames}</Badge>}>
            <div className='flex min-h-0 flex-1 flex-col'>
              <h3 className='text-lg font-semibold'>{course.title}</h3>
              <p className='text-sm text-gray-600'>{course.description}</p>
              {/* footer */}
              <div className='mt-auto flex items-center gap-2'>
                <Badge className='bg-blue-100 text-blue-800'>{course.ageRangeLabel}</Badge>
                <Badge className='bg-green-100 text-green-800'>{formatDuration(course.duration)}</Badge>
              </div>
            </div>
          </CardLayout>
        )
      })}
    </section>
  )
}
