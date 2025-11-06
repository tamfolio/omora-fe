import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Define custom types without extending JWT to avoid conflicts
interface CustomUser {
  id: string
  email: string
  name: string
  role: string
  accessToken: string
  refreshToken: string
}

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
  // Include standard JWT properties without extending
  sub?: string
  name?: string | null
  email?: string | null
  picture?: string | null
  iat?: number
  exp?: number
  jti?: string
}

interface RefreshResponse {
  accessToken: string
  refreshToken?: string
}

async function refreshAccessToken(token: CustomToken): Promise<CustomToken> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token.refreshToken,
      }),
    });

    const refreshedTokens: RefreshResponse = await response.json()

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    }
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
     accessToken?: string
    error?: string
  }
}


// ---- Auth Options ---- //
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Call backend API
          const response = await fetch(`${process.env.API_AUTH_ENDPOINT}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) return null;

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
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  jwt: {
    maxAge: 60 * 60, // 1 hour
  },

  callbacks: {
    // Use unknown type to avoid explicit any
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const customUser = user as CustomUser
        const customToken: CustomToken = {
          ...token,
          accessToken: customUser.accessToken,
          refreshToken: customUser.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
          user: {
            id: customUser.id,
            email: customUser.email,
            name: customUser.name,
            role: customUser.role,
          }
        }
        // Use unknown instead of any for ESLint compliance
        return customToken as unknown as typeof token
      }

      const customToken = token as CustomToken

      // Return previous token if the access token has not expired yet
      if (Date.now() < (customToken.accessTokenExpires || 0)) {
        return customToken as unknown as typeof token
      }

      // Access token has expired, try to update it
      const refreshedToken = await refreshAccessToken(customToken)
      return refreshedToken as unknown as typeof token
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
    signIn: "/auth/login",
    error: "/auth/error",
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};