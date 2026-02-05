// lib/apiService.ts
import { getSession } from "next-auth/react";

// ✅ USE THE PROXY - Not the direct API!
const API_BASE_URL = '/api/proxy';
const API_KEY = process.env.NEXT_PUBLIC_OMORA_API_KEY || '';

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Universal API fetch for client components
 * Uses the Next.js proxy to handle authentication and CORS
 */
export async function apiFetch(
  endpoint: string,
  options: ApiOptions = {}
) {
  const { requiresAuth = true, ...fetchOptions } = options;
  
  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers (but don't override Content-Type for FormData)
  if (fetchOptions.headers) {
    const existingHeaders = new Headers(fetchOptions.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Remove Content-Type for FormData (browser sets it automatically with boundary)
  if (fetchOptions.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Build URL - proxy will handle forwarding to the actual API
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  console.log('📡 API Call via Proxy:', {
    endpoint: cleanEndpoint,
    proxyUrl: url,
    method: fetchOptions.method || 'GET',
    requiresAuth
  });

  // Make request through proxy
  // Proxy will automatically add Authorization header from session
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include', // Important: Include cookies for session
  });

  console.log('📥 Response:', {
    status: response.status,
    ok: response.ok,
    statusText: response.statusText
  });

  // Handle auth errors
  if (response.status === 401) {
    console.error('❌ 401 Unauthorized - Session expired or invalid');
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
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
    getProfile: () => apiFetch('user/api/v1/me'),
    updateProfile: (data: any) => apiFetch('user/api/v1/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Auth endpoints (no auth required)
  auth: {
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
  },

  // Add more endpoint groups as needed
};