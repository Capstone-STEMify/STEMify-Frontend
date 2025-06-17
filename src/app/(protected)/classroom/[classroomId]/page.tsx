import RoleBasedClassroomDetailPage from '@/features/classroom/page/detail'
import { withAuth } from '@/libs/auth/withAuth'
import React from 'react'

export default async function ClassroomDetailPage() {
  return withAuth(async (session) => {
    return <RoleBasedClassroomDetailPage session={session} />
  })
}
