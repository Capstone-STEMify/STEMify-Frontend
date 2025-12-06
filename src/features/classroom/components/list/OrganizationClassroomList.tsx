'use client'
import ClassroomTable from '@/features/classroom/components/list/table/ClassroomTable'

export default function OrganizationClassroomList() {

  return (
    <main className='min-h-screen px-8'>
      <div className='mx-auto max-w-7xl'>
        <ClassroomTable />
      </div>
    </main>
  )
}
