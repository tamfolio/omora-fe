import { getToken } from 'next-auth/jwt';

const TARGET = process.env.OMORA_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8000';
const API_KEY = process.env.OMORA_API_KEY || '';

// 1. Define the type for Next.js 15 params
type RouteProps = {
  params: Promise<{ path: string[] }>;
};

async function forward(request: Request, params: { path: string[] }) {
  const url = new URL(request.url);
  // Now params.path is safe to use because we awaited it in the handlers below
  const path = (params.path || []).join('/');
  
  // Remove trailing slash from TARGET and construct destination
  const targetUrl = `${TARGET.replace(/\/$/, '')}/${path}${url.search}`;

  // Obtain token from next-auth cookie
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  const headers: Record<string, string> = {};
  for (const [key, value] of (request.headers as any).entries()) {
    // Filter out headers that confuse the upstream server
    if (['host', 'cookie', 'authorization', 'content-length'].includes(key.toLowerCase())) continue;
    headers[key] = value;
  }

  // Attach API Key and Bearer Token
  if (API_KEY) headers['x-api-key'] = API_KEY;
  if (token?.accessToken) headers['authorization'] = `Bearer ${token.accessToken}`;

  // Read body only if not GET/HEAD
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer();

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete('transfer-encoding');

    return new Response(await res.arrayBuffer(), {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new Response(JSON.stringify({ message: "Proxy failed", error: String(error) }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 2. Update all exports to await the params object
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