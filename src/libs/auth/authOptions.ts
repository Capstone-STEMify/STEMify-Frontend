import type { NextAuthOptions } from 'next-auth'
import type { OAuthConfig } from 'next-auth/providers/oauth'

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'openid',
      name: 'OpenIddict',
      type: 'oauth',
      version: '2.0',
      clientId: process.env.OIDC_CLIENT_ID!,
      clientSecret: process.env.OIDC_CLIENT_SECRET!,
      issuer: process.env.OIDC_ISSUER_URL!,
      wellKnown: `${process.env.OIDC_ISSUER_URL}/.well-known/openid-configuration`,
      authorization: {
        url: `${process.env.OIDC_ISSUER_URL}/connect/authorize`,
        params: {
          scope: 'openid profile email roles'
        }
      },
      token: `${process.env.OIDC_ISSUER_URL}/connect/token`,
      userinfo: `${process.env.OIDC_ISSUER_URL}/connect/userinfo`,
      checks: ['pkce', 'state'],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: profile.role || profile.roles?.[0] || 'guest'
        }
      }
    } as OAuthConfig<any>
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }
      if (profile) {
        token.role = (profile as any).role || (profile as any).roles?.[0] || 'guest'
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.role = token.role as string
      return session
    }
  }
}
