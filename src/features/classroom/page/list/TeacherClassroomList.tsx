import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import SSelect from '@/components/shared/SSelect'
import ClassroomCard from '@/components/shared/card/ClassroomCard'
import ClassroomHero from '@/features/classroom/components/classroom-list/ClassroomHero'
import { BookOpen, Plus } from 'lucide-react'
import ClassRoomManagement from '@/features/classroom/components/manage-class/ClassRoomManagement'
import { useSearchClassroomQuery } from '@/features/classroom/api/classroomApi'
import CardLayout from '@/components/shared/card/CardLayout'
import SAvatar from '@/components/shared/SAvatar'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import SEmpty from '@/components/shared/empty/SEmpty'

export default function TeacherClassroomList() {
  const { data: classroomData, isLoading } = useSearchClassroomQuery({
    teacherId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
  })

  const classrooms = classroomData?.data?.items ?? []
  const isEmpty = !isLoading && classrooms.length === 0
  return (
    <div className='min-h-screen pb-30'>
      <ClassroomHero />

      <ClassRoomManagement />

      {/* Classroom list */}
      <div className='mx-auto mt-8 max-w-7xl'>
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

        {isEmpty && (
          <SEmpty
            title='No classrooms found'
            description='You have not created any classrooms yet.'
            icon={<BookOpen className='h-10 w-10 text-gray-400' />}
          />
        )}

        {/* Grid list */}
        <div className='grid grid-cols-1 justify-items-center-safe space-y-10 lg:grid-cols-3 xl:grid-cols-4'>
          {isLoading && Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}

          {!isLoading &&
            classrooms.length > 0 &&
            classrooms.map((classroom, index) => (
              <CardLayout key={index} imageSrc={classroom.coverImageUrl}>
                <div className='w-full'>
                  <h3 className='text-lg font-semibold text-gray-900'>{classroom.name}</h3>
                  <p className='text-sm text-gray-500'>{classroom.description}</p>
                </div>
                <div className='mt-auto flex items-center justify-between'>
                  {/* member avatar */}
                  <div className='*:data-[slot=avatar]:ring-background mt-1 flex -space-x-2 *:data-[slot=avatar]:ring-2'>
                    {classroom.students.map((ava, index) => (
                      <SAvatar className='h-7 w-7' src={ava.studentImageUrl ?? ''} fallback='STEM' key={index} />
                    ))}

                    {classroom.numberOfStudents > 3 && (
                      <div
                        key='more'
                        className='z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700'
                        data-slot='avatar'
                      >
                        {classroom.numberOfStudents - 3}
                      </div>
                    )}
                  </div>

                  <span className='text-sm text-gray-500'>Members: {classroom.numberOfStudents}</span>
                </div>
              </CardLayout>
            ))}
        </div>
      </div>
    </div>
  )
}
