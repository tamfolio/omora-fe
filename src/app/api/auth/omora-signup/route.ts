import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL!;
const API_KEY = process.env.OMORA_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Extract all fields
    const { 
      firstName, 
      lastName, 
      middleName, 
      emailAddress, 
      password, 
      rcNumber 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !emailAddress || !password) {
      console.error('Missing required fields:', { firstName, lastName, emailAddress, password: !!password });
      return NextResponse.json(
        { error: 'Required fields are missing: firstName, lastName, emailAddress, password' },
        { status: 400 }
      );
    }

    // Build payload - include all fields
    const payload: any = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    // Optional fields
    if (middleName) payload.middleName = middleName;
    if (rcNumber) payload.rcNumber = rcNumber;

    console.log('Sending signup payload:', { ...payload, password: '***' }); // Debug log

    // Call Omora signup endpoint
    const response = await fetch(`${API_BASE_URL}/user/api/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend signup error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to create account' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      requiresOtp: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}



