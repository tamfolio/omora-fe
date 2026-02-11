// src/app/api/proxy/[...path]/route.ts - FIXED FOR NEXT.JS 15

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// 🔒 SECURITY: Use Server-Side Env Vars only
const TARGET = process.env.OMORA_API_BASE_URL || 'http://localhost:8000';
const API_KEY = process.env.OMORA_API_KEY || '';

// Whitelist of public routes that don't require a user session
const PUBLIC_PATHS = [
  'user/api/v1/sign-in',
  'user/api/v1/sign-in/complete',
  'user/api/v1/sign-up',
  'user/api/v1/sign-up/complete',
  'user/api/v1/forgot-password',
  'user/api/v1/reset-password'
];

// ✅ FIX: Properly handle Next.js 15 async params
async function handleProxy(
  req: NextRequest, 
  context: { params: Promise<{ path: string[] }> }
) {
  // ✅ Await the params object first
  const params = await context.params;
  const pathArray = params.path;
  const pathStr = pathArray.join('/');
  const url = new URL(req.url);
  const targetUrl = `${TARGET.replace(/\/$/, '')}/${pathStr}${url.search}`;

  // 1. 🔒 AUTH CHECK
  const isPublic = PUBLIC_PATHS.some((p) => pathStr.includes(p));
  
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!isPublic && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. 🔒 HEADER SANITIZATION
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  
  // Inject the API Key (Server-side only)
  if (API_KEY) {
    headers.set('x-api-key', API_KEY);
  }

  // Inject the User Token (from the session)
  if (token?.accessToken) {
    headers.set('Authorization', `Bearer ${token.accessToken}`);
  }

  // 3. BODY HANDLING
  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 Proxying ${req.method} -> ${pathStr}`);
    }

    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    // 4. RESPONSE HANDLING
    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.delete('www-authenticate');
    
    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error("❌ Proxy Error:", error);
    return NextResponse.json({ error: "Service Unavailable" }, { status: 502 });
  }
}

// ✅ Export handlers with proper typing
export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}