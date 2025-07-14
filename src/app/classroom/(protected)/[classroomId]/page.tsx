import RoleBasedClassroomDetailPage from '@/features/classroom/page/detail'
import { authOptions } from '@/libs/auth/authOptions'
import { withAuth } from '@/libs/auth/withAuth'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function ClassroomDetailPage() {
  const session = await getServerSession(authOptions)
  return <RoleBasedClassroomDetailPage session={session!} />

  // return withAuth(async (session) => {
  //   return <RoleBasedClassroomDetailPage session={session} />
  // })
  // const session = await getServerSession(authOptions)
}
