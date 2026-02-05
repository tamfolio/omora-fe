import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { User } from "next-auth"
import type { JWT } from "next-auth/jwt"

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/proxy'
const API_KEY = process.env.OMORA_API_KEY || '';

// Store temporary auth state for OTP verification
export const tempAuthStore = new Map<string, { email: string; timestamp: number }>();

// Extend NextAuth types - don't redeclare, just extend
declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken?: string;
    isFirstLogin?: boolean;
    rememberMe?: boolean;
    role: string;
  }

  interface Session {
    accessToken: string;
    refreshToken?: string;
    error?: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      isFirstLogin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    sessionExpires?: number;
    rememberMe?: boolean;
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      isFirstLogin?: boolean;
    };
    error?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Provider 1: Two-step OTP flow
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
    
    // Provider 2: Direct credentials (used by custom login flow)
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
        if (!credentials || !credentials.accessToken) {
          console.error("❌ No credentials or accessToken provided");
          return null;
        }

        console.log("✅ Credentials provider received:", {
          email: credentials.email,
          hasAccessToken: !!credentials.accessToken,
          tokenLength: credentials.accessToken?.length
        });

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
  
  session: { 
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  jwt: { 
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        if (user.id === 'temp') {
          return {
            ...token,
            error: 'OTP_REQUIRED'
          }
        }

        console.log("✅ JWT Callback - Storing tokens:", {
          hasAccessToken: !!user.accessToken,
          tokenLength: user.accessToken?.length,
          userId: user.id
        });

        // Calculate expiry based on remember me preference
        const expiryDuration = user.rememberMe 
          ? 30 * 24 * 60 * 60 * 1000  // 30 days if remember me
          : 7 * 24 * 60 * 60 * 1000;  // 7 days otherwise

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          sessionExpires: Date.now() + expiryDuration,
          rememberMe: user.rememberMe,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
          }
        }
      }

      // Check if session has expired
      if (token.sessionExpires && Date.now() > (token.sessionExpires as number)) {
        console.log("⚠️ Session expired");
        return {
          ...token,
          error: 'SessionExpired'
        };
      }

      // Return existing token
      return token;
    },
    
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        }
      }
      
      // CRITICAL: Ensure accessToken is always set
      session.accessToken = (token.accessToken as string) || '';
      session.refreshToken = (token.refreshToken as string) || '';
      
      console.log("🔐 Session Callback:", {
        hasAccessToken: !!session.accessToken,
        tokenLength: session.accessToken?.length,
        userEmail: session.user?.email
      });
      
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
  
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
}