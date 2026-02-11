import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 🔒 SECURITY: Use direct backend URL
const BACKEND_URL = process.env.OMORA_API_BASE_URL || 'api.omora.app'; 
const API_KEY = process.env.OMORA_API_KEY || '';

// Temporary store for OTP flow
export const tempAuthStore = new Map<string, { email: string; timestamp: number }>();

// Determine if we are in production to set cookie security
const useSecureCookies = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  debug: false, 
  
  session: { 
    strategy: "jwt", 
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },

  
  cookies: {
    sessionToken: {
      name: useSecureCookies ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies, 
      },
    },
  },

  providers: [
    CredentialsProvider({
      id: "credentials-with-otp",
      name: "credentials-otp",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        mode: { label: "Mode", type: "text" }, // 'signin' or 'verify'
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const headers = { 
          "Content-Type": "application/json", 
          "x-api-key": API_KEY 
        };

        try {
          // --- STEP 1: INITIAL SIGN IN (Password) ---
          if (credentials.mode === 'signin') {
            const res = await fetch(`${BACKEND_URL}/user/api/v1/sign-in`, {
              method: "POST",
              headers,
              body: JSON.stringify({ identifier: credentials.email, password: credentials.password }),
            });

            const data = await res.json();

            if (!res.ok) {
              console.error("❌ [Auth] Backend rejected login:", data);
              return null; 
            }

            // Store timestamp for OTP expiry check
            tempAuthStore.set(credentials.email, { email: credentials.email, timestamp: Date.now() });
            
            // Return temp user to signal OTP is needed
            return { 
              id: 'temp', 
              email: credentials.email, 
              role: 'pending_otp' 
            } as User;
          }

          // --- STEP 2: VERIFY OTP ---
          if (credentials.mode === 'verify' && credentials.otp) {
            
            const res = await fetch(`${BACKEND_URL}/user/api/v1/sign-in/complete`, {
              method: "POST",
              headers,
              body: JSON.stringify({ identifier: credentials.email, otp: credentials.otp }),
            });

            const data = await res.json();

            if (!res.ok) {
              console.error("❌ [Auth] Invalid OTP:", data);
              return null;
            }
            
            // Extract access token (checking multiple possible locations)
            const accessToken = data.token?.accessToken || data.accessToken || data.data?.token?.accessToken;

            if (!accessToken) {
                console.error("❌ [Auth] LOGIN FAILED: No access token found in response!");
                return null;
            }

            // Fetch Profile using the new token
            const profileRes = await fetch(`${BACKEND_URL}/user/api/v1/me`, {
              headers: { ...headers, "Authorization": `Bearer ${accessToken}` },
            });
            
            const profile = await profileRes.json();
            const userData = profile.data?.user || {};

            return {
              id: userData.id || 'unknown',
              email: credentials.email,
              name: userData.firstName ? `${userData.firstName} ${userData.lastName}` : 'User',
              role: 'user', // Adjust based on your API
              accessToken: accessToken,
            } as User;
          }
          return null;
        } catch (error) {
          console.error("❌ [Auth] CRITICAL ERROR:", error);
          return null;
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: { signIn: "/auth/login", error: "/auth/error" },
};