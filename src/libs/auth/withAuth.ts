import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth/authOptions'
import { redirect } from 'next/navigation'

export async function withAuth<T>(fn: (session: any) => Promise<T>) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return redirect('/unauthorized')
  }
  return fn(session)
}
