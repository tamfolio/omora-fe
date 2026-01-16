// types/next-auth.d.ts

import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
    accessToken: string
    refreshToken?: string
    isFirstLogin?: boolean
    rememberMe?: boolean 
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
    }
    accessToken?: string
    refreshToken?: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    sessionExpires?: number 
    rememberMe?: boolean 
    error?: string
    user?: {
      id: string
      email: string
      name: string
      role: string
      isFirstLogin?: boolean
    }
  }
}