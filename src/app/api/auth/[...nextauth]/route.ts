import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { User } from "next-auth"
import type { JWT } from "next-auth/jwt"

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/proxy'
const API_KEY = '6434754426732'

// Store temporary auth state for OTP verification
const tempAuthStore = new Map<string, { email: string; timestamp: number }>();

const authOptions: NextAuthOptions = {
  providers: [
    // Provider 1: Two-step OTP flow (kept for compatibility)
    CredentialsProvider({
      id: "credentials-with-otp",
      name: "credentials-otp",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        mode: { label: "Mode", type: "text" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        try {
          if (credentials.mode === 'signin') {
            const response = await fetch(`${API_BASE_URL}/user/api/v1/sign-in`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "x-api-key": API_KEY
              },
              body: JSON.stringify({
                identifier: credentials.email,
                password: credentials.password,
              }),
            });
            
            if (!response.ok) return null;

            tempAuthStore.set(credentials.email, {
              email: credentials.email,
              timestamp: Date.now()
            });

            return {
              id: 'temp',
              email: credentials.email,
              name: 'pending_otp',
              role: 'pending',
              accessToken: '',
              refreshToken: '',
            }
          }

          if (credentials.mode === 'verify' && credentials.otp) {
            const tempAuth = tempAuthStore.get(credentials.email);
            
            if (!tempAuth || Date.now() - tempAuth.timestamp > 5 * 60 * 1000) {
              return null;
            }

            const response = await fetch(`${API_BASE_URL}/user/api/v1/sign-in/complete`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "x-api-key": API_KEY
              },
              body: JSON.stringify({
                identifier: credentials.email,
                otp: credentials.otp,
              }),
            });
            
            if (!response.ok) return null;
            
            const data = await response.json();
            tempAuthStore.delete(credentials.email);

            const profileResponse = await fetch(`${API_BASE_URL}/user/api/v1/me`, {
              method: "GET",
              headers: { 
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${data.token || data.accessToken}`
              },
            });

            const profile = profileResponse.ok ? await profileResponse.json() : {};
            
            return {
              id: data.userId || profile.id || credentials.email,
              email: credentials.email,
              name: profile.firstName && profile.lastName 
                ? `${profile.firstName} ${profile.lastName}` 
                : profile.name || credentials.email,
              role: data.role || profile.role || 'user',
              accessToken: data.token || data.accessToken,
              refreshToken: data.refreshToken,
              isFirstLogin: profile.isPinSet === false,
            }
          }
          
          return null
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    
    // Provider 2: Direct credentials (used by your login page after OTP verification)
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        userId: { label: "User ID", type: "text" },
        userName: { label: "User Name", type: "text" },
        userRole: { label: "User Role", type: "text" },
        isFirstLogin: { label: "First Login", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials || !credentials.accessToken) return null;

        console.log('NextAuth direct credentials authorize:', {
          email: credentials.email,
          userId: credentials.userId,
          isFirstLogin: credentials.isFirstLogin,
        });

        return {
          id: credentials.userId || credentials.email,
          email: credentials.email,
          name: credentials.userName || credentials.email,
          role: credentials.userRole || 'user',
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          isFirstLogin: credentials.isFirstLogin === 'true',
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 },
  jwt: { maxAge: 60 * 60 },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (account && user) {
        if (user.id === 'temp') {
          return {
            ...token,
            error: 'OTP_REQUIRED'
          }
        }

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 30 * 60 * 1000,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
          }
        }
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }
      
      if (token.refreshToken) {
        return await refreshAccessToken(token)
      }

      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        }
      }
      session.accessToken = token.accessToken || ''
      if (token.error) {
        session.error = token.error
      }
      
      return session;
    },
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
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/api/v1/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
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
      accessTokenExpires: Date.now() + 30 * 60 * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    }
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tempAuthStore.entries()) {
    if (now - value.timestamp > 5 * 60 * 1000) {
      tempAuthStore.delete(key);
    }
  }
}, 60 * 1000);

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }