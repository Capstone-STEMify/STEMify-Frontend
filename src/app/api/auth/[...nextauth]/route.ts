process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import { authOptions } from '@/libs/auth/authOptions'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
