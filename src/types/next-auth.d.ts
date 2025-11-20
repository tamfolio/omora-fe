// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
      isFirstLogin?: boolean;
    } & DefaultSession["user"];
    accessToken?: string;
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
    isFirstLogin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
    isFirstLogin?: boolean;
    accessTokenExpires?: number;
    error?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      isFirstLogin?: boolean;
    };
  }
}