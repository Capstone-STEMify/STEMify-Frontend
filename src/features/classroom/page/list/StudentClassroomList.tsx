'use client'

import Link from 'next/link'
import SSelect from '@/components/shared/SSelect'
import SEmpty from '@/components/shared/empty/SEmpty'
import CardLayout from '@/components/shared/card/CardLayout'
import ClassroomHero from '@/components/shared/hero-section/ClassroomHero'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import { useState } from 'react'
import { useModal } from '@/providers/ModalProvider'
import { EnrollmentOrderBy, EnrollmentStatus } from '@/features/classroom/types/enrollment.type'

export default function StudentClassroomList() {
  const { openModal } = useModal()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<EnrollmentOrderBy>(EnrollmentOrderBy.ENROLLDATE_DESC)
  const [status, setStatus] = useState<EnrollmentStatus | undefined>(undefined)

  const { data: classroomData, isLoading } = useSearchEnrollmentQuery({
    studentId: 'f21b8c67-3d49-4c4f-84e7-2b76f017ecb2',
    search: searchQuery,
    orderBy: sortOrder,
    status: status
  })

  const classrooms = classroomData?.data?.items ?? []
  const isEmpty = !isLoading && classrooms.length === 0

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className='min-h-screen pb-30'>
      <ClassroomHero />
      <div className='mx-auto mt-20 max-w-7xl'>
        <div className='text-center text-3xl font-semibold'>Your classroom list</div>
        <p className='mb-6 text-center text-gray-500'>
          Here you can find all the classrooms you are enrolled in. You can search, filter, and manage your classrooms
          easily.
        </p>

        {/* Header controls */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          {/* <SearchBar onSearch={handleSearch} /> */}

          <div className='flex flex-wrap gap-4'>
            <SSelect
              options={[
                { value: EnrollmentStatus.ALL, label: 'All status' },
                { value: EnrollmentStatus.ACTIVE, label: 'Active' },
                { value: EnrollmentStatus.PENDING, label: 'Pending' },
                { value: EnrollmentStatus.WITHDRAWN, label: 'Withdrawn' }
              ]}
              value={status ?? EnrollmentStatus.ALL}
              onChange={(value) => {
                setStatus(value === EnrollmentStatus.ALL ? undefined : (value as EnrollmentStatus))
              }}
              placeholder='Filter by status'
            />

            <SSelect
              options={[
                { value: EnrollmentOrderBy.ENROLLDATE_DESC, label: 'Newest first' },
                { value: EnrollmentOrderBy.ENROLLDATE_ASC, label: 'Oldest first' },
                { value: EnrollmentOrderBy.CLASSROOM_NAME_ASC, label: 'Name A-Z' },
                { value: EnrollmentOrderBy.CLASSROOM_NAME_DESC, label: 'Name Z-A' }
              ]}
              value={sortOrder}
              onChange={(value) => setSortOrder(value as EnrollmentOrderBy)}
              placeholder='Sort by'
            />

            <Button variant='outline' className='flex items-center gap-2' onClick={() => openModal('enroll')}>
              <Plus className='h-4 w-4' />
              Enroll in a classroom
            </Button>
          </div>
        </div>

        {isEmpty && (
          <SEmpty
            title='No classrooms found'
            description='You have not enrolled in any classrooms yet.'
            icon={<BookOpen className='h-10 w-10 text-gray-400' />}
          />
        )}

        {/* Grid list */}
        <div className='grid grid-cols-1 justify-items-center-safe space-y-10 lg:grid-cols-3 xl:grid-cols-4'>
          {isLoading && Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}

          {!isLoading &&
            classrooms.length > 0 &&
            classrooms.map((classroom, index) => (
              <Link href={`/classroom/${classroom.id}`} key={index} className='w-full'>
                <CardLayout imageSrc={classroom.coverImageUrl || '/HomeFiles/hcm.jpg'}>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>{classroom.courseId}</h3>
                  </div>
                </CardLayout>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
