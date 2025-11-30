'use client'
import ClassroomTable from '@/features/classroom/components/list/table/ClassroomTable'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

export default function OrganizationClassroomList() {
  const queryParams = useAppSelector((state) => state.organizationSubscription)
  const dispatch = useAppDispatch()

  return (
    <main className='min-h-screen px-8'>
      <div className='mx-auto max-w-7xl'>
        <ClassroomTable />
      </div>
    </main>
  )
}
