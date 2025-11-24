import { UserOrganization } from '@/features/user/types/user.type'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    user: {
      name?: string
      email?: string
      sub?: string
      userName?: string
      userRole?: string
      userId?: string
      organizations?: UserOrganization[]
    } & DefaultSession['user']
    exp?: number
  }

  interface User {
    username?: string
    role?: string
    userId?: string
  }

  interface Profile {
    username?: string
    role?: string
    userId?: string
    organizations?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string
    role?: string
    userId?: string
    accessToken?: string
    idToken?: string
    exp?: number
    organizations?: UserOrganization[]
  }
}
