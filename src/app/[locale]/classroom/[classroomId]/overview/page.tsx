'use client'
import StudentClassroomDetail from '@/features/classroom/components/detail/StudentClassroomDetails'
import ClassroomOverview from '@/features/classroom/components/overview/ClassroomOverview'
import { useAppSelector } from '@/hooks/redux-hooks'
import { LicenseType, UserRole } from '@/types/userRole'
import React from 'react'

export default function ClassroomOverviewPage() {
  const auth = useAppSelector((state) => state.auth)
  const currentRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  return (
    // <div className=''>
    //   <ClassroomOverview />
    // </div>
    <div>
      {currentRole === LicenseType.TEACHER ? <ClassroomOverview /> : null}
      {currentRole === LicenseType.STUDENT ? <StudentClassroomDetail /> : null}
    </div>
  )
}
