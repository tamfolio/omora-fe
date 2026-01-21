import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { User } from "next-auth"
import type { JWT } from "next-auth/jwt"

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/proxy'
const API_KEY = process.env.OMORA_API_KEY || '';

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
        mode: { label: "Mode", type: "text" },
        rememberMe: { label: "Remember Me", type: "text" }, 
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
            } as User
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

            const accessToken = data.token?.accessToken || data.accessToken;

            const profileResponse = await fetch(`${API_BASE_URL}/user/api/v1/me`, {
              method: "GET",
              headers: { 
                "x-api-key": API_KEY,
                "Authorization": `Bearer ${accessToken}`
              },
            });

            const profile = profileResponse.ok ? await profileResponse.json() : {};
            
            return {
              id: data.data?.id || data.userId || profile.data?.user?.id || credentials.email,
              email: credentials.email,
              name: profile.data?.user?.firstName && profile.data?.user?.lastName 
                ? `${profile.data.user.firstName} ${profile.data.user.lastName}` 
                : profile.name || credentials.email,
              role: data.data?.role || data.role || profile.data?.user?.role || 'user',
              accessToken: accessToken,
              refreshToken: data.token?.refreshToken || data.refreshToken,
              isFirstLogin: profile.data?.user?.isPinSet === false,
              rememberMe: credentials.rememberMe === 'true',
            } as User
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
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials || !credentials.accessToken) return null;


        return {
          id: credentials.userId || credentials.email,
          email: credentials.email,
          name: credentials.userName || credentials.email,
          role: credentials.userRole || 'user',
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          isFirstLogin: credentials.isFirstLogin === 'true',
          rememberMe: credentials.rememberMe === 'true',
        } as User;
      },
    }),
  ],
  
  //  Dynamic session configuration based on remember me
  session: { 
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Default: 7 days
  },
  
  jwt: { 
    maxAge: 7 * 24 * 60 * 60, // Default: 7 days
  },
  
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (account && user) {
        if (user.id === 'temp') {
          return {
            ...token,
            error: 'OTP_REQUIRED'
          }
        }

        // Calculate expiry based on remember me preference
        const expiryDuration = user.rememberMe 
          ? 30 * 24 * 60 * 60 * 1000  // 30 days if remember me
          : 7 * 24 * 60 * 60 * 1000;  // 7 days otherwise

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 30 * 60 * 1000, // Token refresh (30 min)
          sessionExpires: Date.now() + expiryDuration, // Session expiry
          rememberMe: user.rememberMe, //  Store preference
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
          }
        }
      }

      // ✅ Check if session has expired based on remember me preference
      if (token.sessionExpires && Date.now() > (token.sessionExpires as number)) {
        return {
          ...token,
          error: 'SessionExpired'
        };
      }

      // Check if access token needs refresh (30 min)
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
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
      
      // Make tokens available in session
      session.accessToken = token.accessToken as string || ''
      session.refreshToken = (token.refreshToken as string) || '';
      
      if (token.error) {
        session.error = token.error as string
      }
      
      return session;
    },
  },
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  
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

// Cleanup expired temp auth entries
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