import RoleBasedClassroomDetailPage from '@/features/classroom/page/detail'
import { authOptions } from '@/libs/auth/authOptions'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function ClassroomDetailPage() {
  const session = await getServerSession(authOptions)

  return <RoleBasedClassroomDetailPage session={session!} />
}
