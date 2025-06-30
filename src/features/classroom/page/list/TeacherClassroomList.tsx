import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import SSelect from '@/components/shared/SSelect'
import ClassroomHero from '@/components/shared/hero-section/ClassroomHero'
import { BookOpen, Plus } from 'lucide-react'
import ClassRoomManagement from '@/features/classroom/components/ClassRoomManagement'
import { ClassroomParams, useSearchClassroomQuery } from '@/features/classroom/api/classroomApi'
import CardLayout from '@/components/shared/card/CardLayout'
import SAvatar from '@/components/shared/SAvatar'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useQueryParamsHandler } from '@/hooks/useQueryParamsHandler'
import { ClassroomOrderBy, ClassroomStatus } from '@/features/classroom/types/classroom.type'

export default function TeacherClassroomList() {
  const { params, setRawParams, updateParams, goToPage, resetParams } = useQueryParamsHandler<ClassroomParams>({
    defaultParams: {
      teacherId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      status: ClassroomStatus.ACTIVE,
      pageNumber: 1,
      pageSize: 10,
      orderBy: ClassroomOrderBy.CREATED_DATE
    },
    debounceSearch: true
  })

  const { data: classroomData, isLoading } = useSearchClassroomQuery(params)

  const classrooms = classroomData?.data?.items ?? []
  const isEmpty = !isLoading && classrooms.length === 0
  return (
    <div className='min-h-screen pb-30'>
      <ClassroomHero />

      <ClassRoomManagement />

      {/* Classroom list */}
      <div className='mx-auto mt-8 max-w-7xl'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <SearchBar
            defaultValue={params.search || ''}
            onDebouncedSearch={(val) =>
              setRawParams((prev) => ({
                ...prev,
                search: val,
                pageNumber: 1
              }))
            }
          />
          <div className='flex items-center justify-between gap-4 sm:justify-start'>
            <SSelect
              options={[
                { value: 'ALL', label: 'All' },
                { value: ClassroomStatus.ACTIVE, label: 'Active' },
                { value: ClassroomStatus.INACTIVE, label: 'Inactive' },
                { value: ClassroomStatus.ARCHIVED, label: 'Archived' },
                { value: ClassroomStatus.DELETED, label: 'Deleted' }
              ]}
              placeholder='Filter by status'
              value={params.status ?? 'ALL'}
              onChange={(value) => updateParams({ status: value === 'ALL' ? undefined : (value as ClassroomStatus) })}
            />

            <SSelect
              options={[
                { value: ClassroomOrderBy.NAME, label: 'Name' },
                { value: ClassroomOrderBy.CREATED_DATE, label: 'Created Date' }
              ]}
              placeholder='Sort by'
              value={params.orderBy ?? ''}
              onChange={(val) => updateParams({ orderBy: val })}
              // className='ml-4'
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
        <div className='mt-6 flex justify-center gap-2'>
          <Button disabled={params.pageNumber === 1} onClick={() => goToPage(params.pageNumber! - 1)}>
            Previous
          </Button>
          <span>Page {params.pageNumber}</span>
          <Button onClick={() => goToPage(params.pageNumber! + 1)}>Next</Button>
        </div>
      </div>
    </div>
  )
}
