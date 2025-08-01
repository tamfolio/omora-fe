import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
    }
    accessToken: string
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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    user: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
    }
    error?: string
  }
}