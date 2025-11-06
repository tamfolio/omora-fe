import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Hook for protected pages (CLIENT COMPONENTS ONLY)
export function useAuthSession() {
  const { data: session, status } = useSession();

  if (status === "loading") return { session: null, loading: true };

  if (!session) {
    redirect("/auth/login");
  }

  return { session, loading: false };
}

// Server-side auth check (SERVER COMPONENTS ONLY)
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

// API call with auth
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const { getSession } = await import("next-auth/react");
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("No access token available");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = "/auth/login";
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
