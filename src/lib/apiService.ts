// src/lib/apiService.ts
import { getSession, signOut } from "next-auth/react";

// ✅ USE THE PROXY - Not the direct API!
const PROXY_BASE_URL = '/api/proxy';

// ❌ REMOVED: const API_KEY = ... (Never define this in a client file)

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Universal API fetch for client components.
 * Securely routes requests through the Next.js proxy.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;
  
  // 1. Prepare Headers
  const headers = new Headers(fetchOptions.headers);
  
  // Only add JSON content-type if not sending FormData
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 2. Normalize Endpoint & Build Proxy URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${PROXY_BASE_URL}/${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include', // 🔒 CRITICAL: Sends HttpOnly session cookie to Proxy
    });

    // 3. Global Auth Guard
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        // Optional: Force a client-side signout to clear state
        // await signOut({ redirect: false });
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized Access');
    }

    if (!response.ok) {
      // 🔒 SECURITY: Parse error safely. 
      // Do not log full stack traces or raw error objects in Production.
      const errorText = await response.text();
      let errorMessage = response.statusText;
      
      try {
        const json = JSON.parse(errorText);
        errorMessage = json.message || json.error || errorMessage;
      } catch (e) {
        // fall back to text
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', { status: response.status, message: errorMessage });
      }
      
      throw new Error(errorMessage || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * API service definition
 */
export const api = {
  user: {
    getProfile: () => apiFetch('user/api/v1/me'),
    updateProfile: (data: any) => apiFetch('user/api/v1/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },
  auth: {
    // --- LOGIN ---
    signIn: (identifier: string, password: string) => 
      apiFetch('user/api/v1/sign-in', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ identifier, password }),
      }),
    
    verifyOtp: (identifier: string, otp: string) =>
      apiFetch('user/api/v1/sign-in/complete', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ identifier, otp }),
      }),

    // --- SIGN UP ---
    signUp: (data: any) => 
      apiFetch('user/api/v1/sign-up', {
        method: 'POST',
        requiresAuth: false, 
        body: JSON.stringify(data),
      }),

    verifySignUp: (identifier: string, otp: string) => 
      apiFetch('user/api/v1/sign-up/complete', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ identifier, otp }),
      }),
      
    // --- PASSWORD ---
    forgotPassword: (email: string) =>
      apiFetch('user/api/v1/forgot-password', {
        method: 'POST',
        requiresAuth: false,
        body: JSON.stringify({ email }),
      }),
  },
};