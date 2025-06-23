'use client'
import { Badge } from '@/components/shadcn/badge'
import { useSearchCourseQuery } from '../../api/courseApi'
import CardLayout from '@/components/shared/card/CardLayout'

export default function CourseSection() {
  const { data: CourseData, error, isLoading } = useSearchCourseQuery({ pageSize: 6 })
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
                <Badge className='bg-green-100 text-green-800'>
                  {course.duration ? `${Math.floor(course.duration / 60)} min` : 'N/A'}
                </Badge>
              </div>
            </div>
          </CardLayout>
        )
      })}
    </section>
  )
}
