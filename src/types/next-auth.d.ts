// In your /src/types/next-auth.d.ts (create this file if it doesn't exist)

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
      image?: string  // ✅ Add this
    }
    accessToken?: string
    refreshToken?: string
    error?: string
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    accessToken: string
    refreshToken: string
    isFirstLogin?: boolean
    rememberMe?: boolean
    image?: string  // ✅ Add this
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    sessionExpires?: number
    rememberMe?: boolean
    user?: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
      image?: string  // ✅ Add this
    }
    error?: string
  }
}