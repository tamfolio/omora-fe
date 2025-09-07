import type { NextAuthOptions, DefaultSession, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

// ---- Custom Types ---- //
interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

type CustomToken = JWT & {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
};

// Extend Session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string; // Make optional to match usage
    error?: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

// ---- Refresh Access Token Helper ---- //
async function refreshAccessToken(token: CustomToken): Promise<CustomToken> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token.refreshToken,
      }),
    });

    const refreshedTokens: {
      accessToken: string;
      refreshToken?: string;
    } = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
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
          const response = await fetch(`${process.env.API_AUTH_ENDPOINT}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) return null;

          const user: CustomUser = await response.json();

          if (user && user.id) return user;

          return null;
        } catch {
          return null;
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
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const u = user as CustomUser;
        return {
          ...token,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
          user: {
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
          },
        } as CustomToken;
      }

      const customToken = token as CustomToken;

      // If token still valid → return it
      if (Date.now() < customToken.accessTokenExpires) {
        return customToken;
      }

      // Otherwise refresh
      return await refreshAccessToken(customToken);
    },

    async session({ session, token }) {
      const customToken = token as CustomToken;

      session.user = customToken.user ?? {
        id: "",
        email: "",
        name: "",
        role: "",
      };

      session.accessToken = customToken.accessToken;
      session.error = customToken.error;

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