import { getToken } from 'next-auth/jwt';

const TARGET = process.env.OMORA_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8000';
const API_KEY = process.env.OMORA_API_KEY || '';

type RouteProps = {
  params: Promise<{ path: string[] }>;
};

async function forward(request: Request, params: { path: string[] }) {
  const url = new URL(request.url);
  const path = (params.path || []).join('/');
  const targetUrl = `${TARGET.replace(/\/$/, '')}/${path}${url.search}`;

const isProd = process.env.NODE_ENV === "production";

const token = await getToken({ 
  req: request as any, 
  secret: process.env.NEXTAUTH_SECRET,
  secureCookie: isProd,
});

// 🔍 PRODUCTION DEBUG LOGS
if (!token) {
  const allCookies = request.headers.get('cookie') || 'no cookies found';
  console.log('🔐 Proxy Debug - Detailed Failure:', {
    env: process.env.NODE_ENV,
    expectedSecure: isProd,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    rawCookieHeader: allCookies.substring(0, 50) + '...', // Check for __Secure- prefix
    nextAuthUrl: process.env.NEXTAUTH_URL
  });
}

  console.log('🔐 Proxy Debug:', {
    path,
    hasToken: !!token,
    hasAccessToken: !!token?.accessToken,
    tokenPreview: token?.accessToken?.substring(0, 30),
    env: process.env.NODE_ENV,
    hasSecret: !!process.env.NEXTAUTH_SECRET
  });

  const headers: Record<string, string> = {};
  for (const [key, value] of (request.headers as any).entries()) {
    if (['host', 'cookie', 'authorization', 'content-length'].includes(key.toLowerCase())) continue;
    headers[key] = value;
  }

  // Add API key
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  // Add authorization if token exists
  if (token?.accessToken) {
    headers['authorization'] = `Bearer ${token.accessToken}`;
    console.log('✅ Added Authorization header');
  } else {
    console.error('❌ No access token in session!', {
      tokenKeys: token ? Object.keys(token) : 'no token'
    });
  }

  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : request.body;

  try {
    console.log('📡 Forwarding to:', targetUrl);
    
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      // @ts-ignore
      duplex: 'half', 
    });

    console.log('📥 API Response:', {
      status: res.status,
      ok: res.ok
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete('transfer-encoding');

    return new Response(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("❌ Proxy Error:", error);
    return new Response(JSON.stringify({ message: "Proxy failed", error: String(error) }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request: Request, props: RouteProps) {
  const params = await props.params;
  return forward(request, params);
}

export async function POST(request: Request, props: RouteProps) {
  const params = await props.params;
  return forward(request, params);
}

export async function PUT(request: Request, props: RouteProps) {
  const params = await props.params;
  return forward(request, params);
}

export async function DELETE(request: Request, props: RouteProps) {
  const params = await props.params;
  return forward(request, params);
}

export async function PATCH(request: Request, props: RouteProps) {
  const params = await props.params;
  return forward(request, params);
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}