import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    user: {
      name?: string
      email?: string
      role: string
    }
  }

  interface JWT {
    accessToken?: string
    role?: string
  }
}
