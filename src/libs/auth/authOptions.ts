import type { NextAuthOptions } from 'next-auth'
import type { OAuthConfig } from 'next-auth/providers/oauth'
import { type Profile } from 'next-auth'

interface OIDCProfile extends Profile {
  sub: string
  name?: string
  email?: string
  username?: string
  userId?: string
  role?: string
  roles?: string[]
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
  wellKnown: 'https://localhost:7131/.well-known/openid-configuration',
  authorization: {
    url: `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/connect/authorize`,
    params: {
      scope: 'stemify_api openid profile email roles'
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
      role: (profile as any).role || (profile as any).roles?.[0] || 'guest',
      username: (profile as any).username ?? 'unknown',
      userId: (profile as any).userId ?? 'unknown'
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
      if (account) {
        console.log('Account token:', account.access_token)
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }
      if (profile) {
        token.role = (profile as any).role || (profile as any).roles?.[0] || 'guest'
        token.username = (profile as any).username
        token.userId = (profile as any).userId
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.role = token.role as string
      session.user.username = token.username as string
      session.user.userId = token.userId as string
      return session
    }
  }
}
