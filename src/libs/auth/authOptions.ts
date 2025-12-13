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
        token.accessToken = account.access_token
        token.idToken = account.id_token
        
        
        try {
          const decoded: any = jwtDecode(account.access_token)
          const accessTokenRole = 
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            decoded['platform_role'] ||
            decoded['role'] ||
            UserRole.GUEST
          
          let mappedRole: UserRole = UserRole.GUEST
          if (accessTokenRole === 'Admin' || accessTokenRole === 'admin') {
            mappedRole = UserRole.ADMIN
          } else if (accessTokenRole === 'Staff' || accessTokenRole === 'staff') {
            mappedRole = UserRole.STAFF
          } else if (accessTokenRole === 'Member' || accessTokenRole === 'member') {
            mappedRole = UserRole.MEMBER
          }
          
          token.role = mappedRole
          
         token.name = decoded['name'] || 
                      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/name'] ||
                      token.name ||
                      'Unnamed'
          
          token.email = decoded['email'] || 
                       decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress'] ||
                       token.email ||
                       'no-email@example.com'
          
          token.preferred_username = decoded['preferred_username'] || 
                                     decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/name'] ||
                                     decoded['name'] ||
                                     token.preferred_username ||
                                     'unknown'
          
          token.username = decoded['preferred_username'] ||
                          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/name'] ||
                          decoded['name'] ||
                          token.username ||
                          'unknown'
          
          token.sub = decoded['sub'] ?? token.sub ?? 'unknown'
        

          const rawOrganizations = decoded['organizations']
          if (rawOrganizations) {
            try {
              const parsedOrgs = typeof rawOrganizations === 'string' 
                ? JSON.parse(rawOrganizations) 
                : rawOrganizations
              
              if (parsedOrgs && typeof parsedOrgs === 'object') {
                token.organizations = parsedOrgs
             
              } else {
                token.organizations = undefined
              }
            } catch (err) {
              token.organizations = undefined
            }
          } else {
            try {
              const profileOrgs = (profile as any).organizations
              if (profileOrgs) {
                const parsed = typeof profileOrgs === 'string' ? JSON.parse(profileOrgs) : profileOrgs
                if (parsed && typeof parsed === 'object') {
                  token.organizations = parsed
        
                } else {
                  token.organizations = undefined
                }
              } else {
                token.organizations = undefined
              }
            } catch (err) {
              token.organizations = undefined
            }
          }
        } catch (error) {
          const oidcRole = (profile as OIDCProfile)?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          token.role = (profile as any)?.role || oidcRole || UserRole.GUEST
          console.log('⚠️ [AUTH DEBUG] Using fallback role from profile:', token.role)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken!
        session.user.userRole = token.role!
        session.user.userName = (token.username || token.preferred_username || 'unknown') as string
        session.user.userId = token.sub!
        session.exp = token.exp!
        
       session.user.name = (token.name || session.user.name || 'Unnamed') as string
        session.user.email = (token.email || session.user.email || 'no-email@example.com') as string

        session.user.organizations = token.organizations
        // console.log('Session callback', JSON.stringify(session, null, 2))
      }
      return session
    }
  }
}

const { auth, signIn } = NextAuth(authOptions)
export { auth, signIn }
