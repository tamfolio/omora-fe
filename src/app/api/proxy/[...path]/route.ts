import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL!;
const API_KEY = process.env.OMORA_API_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const url = `${API_BASE_URL}/${path}`;
    
    const headers: Record<string, string> = {
      'x-api-key': API_KEY,
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log('Proxying GET request to:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('Proxy GET response:', { status: response.status, data });
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const url = `${API_BASE_URL}/${path}`;
    
    const headers: Record<string, string> = {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log('Proxying POST request to:', url);

    const body = await request.json();
    console.log('Request body:', body);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Proxy POST response:', { status: response.status, data });
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const url = `${API_BASE_URL}/${path}`;
    
    const headers: Record<string, string> = {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log('Proxying PUT request to:', url);

    const body = await request.json();
    console.log('Request body:', body);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Proxy PUT response:', { status: response.status, data });
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const url = `${API_BASE_URL}/${path}`;
    
    const headers: Record<string, string> = {
      'x-api-key': API_KEY,
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log('Proxying DELETE request to:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    console.log('Proxy DELETE response:', { status: response.status, data });
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API' },
      { status: 500 }
    );
  }
}