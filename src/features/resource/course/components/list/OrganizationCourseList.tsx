import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { OrganizationCurriculumCourse } from '@/features/organization/types/organization.type'
import { getLevelBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst } from '@/utils/index'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
type OrganizationCurriculumCourseListProps = {
  courses: OrganizationCurriculumCourse[]
}

export default function OrganizationCourseList({ courses }: OrganizationCurriculumCourseListProps) {
  const t = useTranslations('curriculum')
  const { curriculumId } = useParams()

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {t('list.courseListTitle')}{' '}
          <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{courses.length}</span>
        </h2>
      </div>

      <div className='grid h-fit grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {courses.map((course) => (
          <div key={course.id} className='relative flex min-w-0 gap-1'>
            <Link
              href={`/organization/curriculum/${curriculumId}/course/${course.id}`}
              className='flex w-fit flex-col justify-between'
            >
              <CardLayout
                className='rounded-2xl border-none shadow-lg'
                imageSrc={course.imageUrl || '/images/fallback.png'}
                footer={
                  <div className='flex items-center gap-2'>
                    <Badge className='bg-sky-custom-300'>{course.ageRangeLabel}</Badge>
                    <Badge className={getLevelBadgeClass(course.level)}>{capitalizeFirst(course.level)}</Badge>
                  </div>
                }
              >
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>{course.code}</p>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{course.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{course.description}</p>
                </div>
              </CardLayout>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
