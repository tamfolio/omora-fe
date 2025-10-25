// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
    user: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    email: string
    name: string
    role: string
    accessToken: string
    refreshToken?: string
    isFirstLogin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    user?: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
    }
    error?: string
  }
}