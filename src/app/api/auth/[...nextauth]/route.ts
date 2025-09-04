import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

// Define custom types
interface CustomUser {
  id: string
  email: string
  name: string
  role: string
  accessToken: string
  refreshToken: string
}

// Fix 1: Don't extend JWT, just define our own interface for the token shape
interface CustomToken {
  accessToken?: string
  refreshToken?: string
  accessTokenExpires?: number
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
  error?: string
  // Include standard JWT properties we need - match JWT interface exactly
  sub?: string
  name?: string | null
  email?: string | null
  picture?: string | null
  iat?: number
  exp?: number
  jti?: string
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
    accessToken: string
    error?: string
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call your backend API
          const response = await fetch(`${process.env.API_AUTH_ENDPOINT}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const user = await response.json()
          
          // Return user object that will be stored in JWT
          if (user && user.id) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
            } as CustomUser
          }
          
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  
  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },
  
  callbacks: {
    // Fix 2: Return JWT type but cast internally to CustomToken
    async jwt({ token, user, account }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        const customUser = user as CustomUser
        const customToken: CustomToken = {
          ...token,
          accessToken: customUser.accessToken,
          refreshToken: customUser.refreshToken,
          accessTokenExpires: Date.now() + 30 * 60 * 1000, // 30 minutes (fixed from 60 minutes)
          user: {
            id: customUser.id,
            email: customUser.email,
            name: customUser.name,
            role: customUser.role,
          }
        }
        return customToken as JWT
      }

      const customToken = token as CustomToken

      // Return previous token if the access token has not expired yet
      if (Date.now() < (customToken.accessTokenExpires || 0)) {
        return customToken as JWT
      }

      // Access token has expired, try to update it
      const refreshedToken = await refreshAccessToken(customToken)
      return refreshedToken as JWT
    },
    
    async session({ session, token }) {
      const customToken = token as CustomToken
      
      if (customToken.user) {
        session.user = customToken.user
      }
      session.accessToken = customToken.accessToken || ''
      if (customToken.error) {
        session.error = customToken.error
      }
      
      return session
    }
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  
  // Security options
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}

async function refreshAccessToken(token: CustomToken): Promise<CustomToken> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 30 * 60 * 1000, // 30 minutes
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    }
  } catch {
    // Fix 3: Remove unused error parameter
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }