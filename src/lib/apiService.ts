// lib/apiService.ts
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.omora.africa';
const API_KEY = process.env.NEXT_PUBLIC_OMORA_API_KEY || '';

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Universal API fetch for client components
 * Automatically handles authentication
 */
export async function apiFetch(
  endpoint: string,
  options: ApiOptions = {}
) {
  const { requiresAuth = true, ...fetchOptions } = options;
  
  // Use Record type for proper TypeScript typing
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };

  // Merge existing headers
  if (fetchOptions.headers) {
    const existingHeaders = new Headers(fetchOptions.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add auth token if required
  if (requiresAuth) {
    const session = await getSession();
    
    if (!session?.accessToken) {
      throw new Error('No access token available');
    }
    
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle auth errors
  if (response.status === 401) {
    window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response;
}

/**
 * API service with common endpoints
 */
export const api = {
  // User endpoints
  user: {
    getProfile: () => apiFetch('/user/api/v1/me'),
    updateProfile: (data: any) => apiFetch('/user/api/v1/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Auth endpoints (no auth required)
  auth: {
    signIn: (identifier: string, password: string) => 
      apiFetch('/user/api/v1/sign-in', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ identifier, password }),
      }),
    
    verifyOtp: (identifier: string, otp: string) =>
      apiFetch('/user/api/v1/sign-in/complete', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ identifier, otp }),
      }),
  },

  // Add more endpoint groups as needed
};