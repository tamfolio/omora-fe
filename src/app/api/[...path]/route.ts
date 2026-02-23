import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const TARGET = process.env.OMORA_API_BASE_URL || 'https://api.omora.africa'; 
const API_KEY = process.env.OMORA_API_KEY || '';

const PUBLIC_PATHS = [
  'user/api/v1/sign-in',
  'user/api/v1/sign-in/complete',
  'user/api/v1/sign-up',
  'user/api/v1/sign-up/complete',
  'user/api/v1/forgot-password',
  'user/api/v1/reset-password',
  'user/verification/verify/reg-no'
];

async function handleProxy(
  req: NextRequest, 
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const pathArray = params.path;
  const pathStr = pathArray.join('/');
  const url = new URL(req.url);
  const targetUrl = `${TARGET.replace(/\/$/, '')}/${pathStr}${url.search}`;

  // 1. AUTH CHECK
  const isPublic = PUBLIC_PATHS.some((p) => pathStr.includes(p));
  
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!isPublic && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. SMART HEADER HANDLING
  const headers = new Headers();
  
  // Get the original Content-Type from the request
  const contentType = req.headers.get('content-type');
  
  // Only set Content-Type to JSON if it's not already set (and not multipart)
  if (contentType) {
    // Keep the original Content-Type (e.g., multipart/form-data with boundary)
    headers.set('Content-Type', contentType);
  } else {
    // Default to JSON for requests without Content-Type
    headers.set('Content-Type', 'application/json');
  }
  
  headers.set('Accept', 'application/json');
  
  // Inject API Key
  if (API_KEY) {
    headers.set('x-api-key', API_KEY);
  }

  // Inject User Token
  if (token?.accessToken) {
    headers.set('Authorization', `Bearer ${token.accessToken}`);
  }

  // 3. BODY HANDLING - Preserve binary data for file uploads
  let body: any = undefined;
  
  if (!['GET', 'HEAD'].includes(req.method)) {
    if (contentType?.includes('multipart/form-data')) {
      // For multipart, use arrayBuffer to preserve boundaries
      body = await req.arrayBuffer();
    } else {
      // For JSON and other text formats
      body = await req.text();
    }
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 Proxying ${req.method} -> ${pathStr}`, {
        contentType,
        bodyType: body instanceof ArrayBuffer ? 'ArrayBuffer' : typeof body,
      });
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