'use client'
import ClassroomTable from '@/features/classroom/components/list/table/ClassroomTable'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

export default function OrganizationClassroomList() {
  const queryParams = useAppSelector((state) => state.organizationSubscription)
  const dispatch = useAppDispatch()

  return (
    <main className='min-h-screen px-8'>
      <div className='mx-auto max-w-7xl'>
        {/* <div className='mb-6 flex items-end justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>Curriculums</h1>
            <p className='text-gray-600'>Running curriculums</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {organizationSubscriptionData?.data.items.map((classItem) => (
            // <CurriculumCard key={classItem.id} {...classItem} />
            <div></div>
          ))}
        </div> */}
        <ClassroomTable />
      </div>
    </main>
  )
}
