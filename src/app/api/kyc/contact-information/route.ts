import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { phoneNumber, address, city, state, zipCode } = body;
    
    if (!phoneNumber || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/kyc/api/v1/contact-information`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.OMORA_API_KEY || '',
          'Authorization': request.headers.get('Authorization') || '',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to save contact information' },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Contact information error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}/kyc/api/v1/contact-information`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.OMORA_API_KEY || '',
          'Authorization': request.headers.get('Authorization') || '',
        },
      }
    );

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch contact information' },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Contact information fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}