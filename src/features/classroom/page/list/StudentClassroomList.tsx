'use client'

import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import SSelect from '@/components/shared/SSelect'
import ClassroomHero from '@/features/classroom/components/classroom-list/ClassroomHero'
import { BookOpen, Plus } from 'lucide-react'
import ClassRoomManagement from '@/features/classroom/components/manage-class/ClassRoomManagement'
import Link from 'next/link'
import { useSearchEnrollmentQuery } from '@/features/classroom/api/enrollmentApi'
import CardLayout from '@/components/shared/card/CardLayout'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import SEmpty from '@/components/shared/empty/SEmpty'

export default function StudentClassroomList() {
  const { data: classroomData, isLoading } = useSearchEnrollmentQuery({
    studentId: 'f21b8c67-3d49-4c4f-84e7-2b76f017ecb2'
  })

  const classrooms = classroomData?.data?.items ?? []
  const isEmpty = !isLoading && classrooms.length === 0

  return (
    <div className='min-h-screen pb-30'>
      <ClassroomHero />

      <ClassRoomManagement />

      <div className='mx-auto max-w-7xl'>
        <div className='text-center text-3xl font-semibold'>Your classroom list</div>
        <p className='mb-6 text-center text-gray-500'>
          Manage your classrooms, invite students, and track their progress.
        </p>

        {/* Header controls */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <SearchBar />
          <div className='flex items-center justify-between gap-4 sm:justify-start'>
            <SSelect
              items={[
                { value: 'all', content: 'All' },
                { value: 'recently', content: 'Recently' }
              ]}
              placeholder='Filter by subject'
              value='all'
              onChange={(value) => console.log(value)}
            />
            <Button size='icon' className='bg-amber-custom-400 rounded-full font-bold'>
              <Plus />
            </Button>
          </div>
        </div>

        {/* Grid list */}
        <div className='grid grid-cols-1 space-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
          {isLoading && Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}

          {isEmpty && (
            <SEmpty
              title='No classrooms found'
              description='You have not enrolled in any classrooms yet.'
              icon={<BookOpen className='h-10 w-10 text-gray-400' />}
            />
          )}

          {!isLoading &&
            classrooms.length > 0 &&
            classrooms.map((classroom, index) => (
              <Link href={`/classroom/${classroom.id}`} key={index} className='w-full'>
                <CardLayout imageSrc={classroom.coverImageUrl || '/HomeFiles/hcm.jpg'}>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>{classroom.classroomName}</h3>
                  </div>
                </CardLayout>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
