import { getServerSession } from 'next-auth'
import { authOptions } from './authOptions'
import { UserRole } from '@/types/userRole'

export async function getUserRole(): Promise<UserRole> {
  const session = await getServerSession(authOptions)
  return (session?.user?.role as UserRole) ?? UserRole.GUEST
}
