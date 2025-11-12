'use client'
import StudentClassroomDetail from '@/features/classroom/components/detail/StudentClassroomDetails'
import ClassroomOverview from '@/features/classroom/components/overview/ClassroomOverview'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import React from 'react'

export default function ClassroomOverviewPage() {
  const auth = useAppSelector((state) => state.auth)
  const role = auth.user?.userRole
  return (
    // <div className=''>
    //   <ClassroomOverview />
    // </div>
    <div>
      {role === UserRole.TEACHER ? <ClassroomOverview /> : null}
      {role === UserRole.STUDENT ? <StudentClassroomDetail /> : null}
    </div>
  )
}
