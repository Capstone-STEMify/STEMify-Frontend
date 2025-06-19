'use client'
import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import SSelect from '@/components/shared/SSelect'
import ClassroomCard from '@/components/shared/card/ClassroomCard'
import ClassroomHero from '@/features/classroom/components/classroom-list/ClassroomHero'
import { BookOpen, Plus } from 'lucide-react'
import ClassRoomManagement from '@/features/classroom/components/manage-class/ClassRoomManagement'
import Link from 'next/link'
import { useSearchEnrollmentQuery } from '@/features/classroom/api/enrollmentApi'

export default function StudentClassroomList() {
  const { data: classroomData } = useSearchEnrollmentQuery({ studentId: 'f21b8c67-3d49-4c4f-84e7-2b76f017ecb2' })

  return (
    <div className='min-h-screen pb-30'>
      <ClassroomHero />

      <ClassRoomManagement />

      {/* Classroom list */}
      <div className='mx-auto max-w-7xl'>
        <div className='text-center text-3xl font-semibold'>Your classroom list</div>
        <p className='mb-6 text-center text-gray-500'>
          Manage your classrooms, invite students, and track their progress.
        </p>
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
            <Button size={'icon'} className='bg-amber-custom-400 rounded-full font-bold'>
              <Plus />
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 justify-items-center space-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
          {/* Replace with filter later */}
          {!classroomData && (
            <div className='py-12 text-center'>
              <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-200'>
                <BookOpen className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>No classrooms found</h3>
              <p className='text-gray-500'>Try adjusting your search or filter criteria</p>
            </div>
          )}

          {classroomData &&
            classroomData.data.items.map((classroom, index) => (
              <Link href={`/classroom/${classroom.id}`} key={index} className='w-full'>
                <ClassroomCard
                  key={index}
                  classroom={{
                    name: classroom.classroomName,
                    image: classroom.coverImageUrl,
                    // member: classroom.numberOfStudents,
                    member: 10
                    // avatar: classroom.students.filter((s) => !!s.studentImageUrl).map((s) => s.studentImageUrl)
                  }}
                  size='lg'
                />
              </Link>
            ))}
        </div>

        {/* Empty State */}
      </div>
    </div>
  )
}
