import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

interface CustomToken {
  accessToken?: string;
  refreshToken?: string;
  sessionExpires?: number;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
  sub?: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  iat?: number;
  exp?: number;
  jti?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken?: string;
    error?: string;
  }
}

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
          const response = await fetch(`${process.env.API_AUTH_ENDPOINT}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) return null;

          const user = await response.json();

          if (user && user.id) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
            } as CustomUser;
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
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
    async jwt({ token, user, account }) {
      if (account && user) {
        const customUser = user as CustomUser;
        const customToken: CustomToken = {
          ...token,
          accessToken: customUser.accessToken,
          refreshToken: customUser.refreshToken,
          sessionExpires: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
          user: {
            id: customUser.id,
            email: customUser.email,
            name: customUser.name,
            role: customUser.role,
          },
        };
        return customToken as unknown as typeof token;
      }

      const customToken = token as CustomToken;

      // ✅ FIXED: No token refresh - just check if session expired
      if (customToken.sessionExpires && Date.now() > customToken.sessionExpires) {
        return {
          ...customToken,
          error: 'SessionExpired'
        } as unknown as typeof token;
      }

      // ✅ Return token as-is (no refresh)
      return customToken as unknown as typeof token;
    },

    async session({ session, token }) {
      const customToken = token as CustomToken;

      if (customToken.user) {
        session.user = customToken.user;
      }
      session.accessToken = customToken.accessToken || "";
      
      // ✅ Only set error if session actually expired
      if (customToken.error) {
        session.error = customToken.error;
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
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};