import { jwtDecode } from 'jwt-decode'
import type { NextAuthOptions } from 'next-auth'
import type { OAuthConfig } from 'next-auth/providers/oauth'
import NextAuth, { type Profile } from 'next-auth'
import { UserRole } from '@/types/userRole'

interface OIDCProfile extends Profile {
  sub: string
  name?: string
  email?: string
  username?: string
  userId?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string
}

const oidcProvider: OAuthConfig<OIDCProfile> = {
  id: 'oidc',
  name: 'OpenID Connect',
  type: 'oauth',
  version: '2.0',
  // clientSecret: process.env.CLIENT_SECRET,
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  idToken: true,
  issuer: process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL,
  wellKnown: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/.well-known/openid-configuration`,
  authorization: {
    url: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/connect/authorize`,
    params: {
      scope: process.env.NEXT_PUBLIC_SCOPES,
      prompt: 'login'
    }
  },
  token: {
    url: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/connect/token`,
    params: {
      grant_type: 'authorization_code'
      // client_id: process.env.NEXT_PUBLIC_CLIENT_ID
      // redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI
    }
  },
  userinfo: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/connect/userinfo`,
  client: {
    token_endpoint_auth_method: 'none'
  },
  checks: ['pkce', 'state'],
  profile(profile: OIDCProfile) {
    return {
      id: profile.sub ?? 'unknown-id',
      name: profile.name ?? 'Unnamed',
      email: profile.email ?? 'no-email@example.com',
      role: profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'guest',
      username: profile.username ?? 'unknown',
      userId: profile.userId ?? 'unknown'
    }
  }
}

export const authOptions: NextAuthOptions = {
  // debug: true,
  session: {
    strategy: 'jwt'
  },
  providers: [oidcProvider],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ account }) {
      console.log('SignIn callback', { account })
      return true
    },
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        console.log('JWT callback', { profile })
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.role = profile?.role || UserRole.GUEST
        try {
          token.organizations = JSON.parse((profile as any).organizations || '[]')
          console.log('Parsed organizations:', token.organizations)
        } catch (err) {
          console.error('Failed to parse organizations JSON:', err)
          token.organizations = undefined
        }
        console.log('Token debug:', token)

        //   try {
        //     const decoded: any = jwtDecode(account.access_token)
        //     token.role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'Guest'
        //     token.preferred_username = decoded['preferred_username'] ?? 'unknown'
        //     token.sub = decoded['sub'] ?? 'unknown'

        //     // Optional: parse organizations if present in the token
        //     const rawOrganizations = decoded['organizations']
        //     if (rawOrganizations) {
        //       try {
        //         token.organizations = JSON.parse(rawOrganizations) // array of { id, subscriptions }
        //       } catch (err) {
        //         console.error('Failed to parse organizations JSON:', err)
        //         token.organizations = []
        //       }
        //     }
        //   } catch (error) {
        //     console.error('Failed to decode access token:', error)
        //   }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken!
        session.user.userRole = token.role!
        session.user.userName = token.username!
        session.user.userId = token.sub!
        session.exp = token.exp!
        session.user.email = token.email!

        session.user.organizations = token.organizations
        // console.log('Session callback', JSON.stringify(session, null, 2))
      }
      return session
    }
  }
}

const { auth, signIn } = NextAuth(authOptions)
export { auth, signIn }
