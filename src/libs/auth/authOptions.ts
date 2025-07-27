import { jwtDecode } from 'jwt-decode'

import type { NextAuthOptions } from 'next-auth'
import type { OAuthConfig } from 'next-auth/providers/oauth'
import NextAuth, { type Profile } from 'next-auth'

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
  clientId: `${process.env.NEXT_PUBLIC_CLIENT_ID}`,
  idToken: true,
  issuer: process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL,
  wellKnown: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/.well-known/openid-configuration`,
  authorization: {
    url: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/connect/authorize`,
    params: {
      scope: 'stemify_api openid profile email roles',
      prompt: 'login'
    }
  },
  token: {
    url: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/connect/token`,
    params: {
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI
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
  debug: true,
  session: {
    strategy: 'jwt'
  },
  providers: [oidcProvider],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
        token.idToken = account.id_token

        if (profile) {
          token.username = profile.username
          token.userId = profile.userId
          token.role = profile.role
        }

        try {
          const decoded: any = jwtDecode(account.access_token)
          token.role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'Guest'
          token.username = decoded['preferred_username'] ?? 'unknown'
          token.userId = decoded['sub'] ?? 'unknown'
        } catch (error) {
          console.error('Failed to decode access token:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken!
        session.user.role = token.role!
        session.user.username = token.username!
        session.user.userId = token.userId!
      }
      return session
    }
  }
}

const { auth, signIn } = NextAuth(authOptions)
export { auth, signIn }
