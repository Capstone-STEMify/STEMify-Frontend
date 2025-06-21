'use client'
import ResourceCard from '@/components/shared/card/ResourceCard'
import { useGetAllCourseQuery } from '../../api/courseApi';

export default function CourseSection() {
  const { data: CourseData, error, isLoading } = useGetAllCourseQuery();
  return (
    <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {CourseData?.data.items.map((course, index) => {
        return (
          <ResourceCard
            size='md'
            key={index}
            resource={{
              ...course,
              categoryNames: course.categoryNames || ['Math'],
              ageRangeLabel: course.ageRangeLabel || '8-10',
              duration: course.duration || 120,
              // You can override or provide defaults for other fields here if needed
            }}
          />
        )
      })}
    </section>
  )
}
