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
    const { firstName, lastName, middleName, emailAddress, password, rcNumber } = body;

    if (!firstName || !lastName || !emailAddress || !password) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Call Omora signup endpoint
    const response = await fetch(`${API_BASE_URL}/user/api/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        middleName: middleName || '',
        emailAddress,
        password,
        rcNumber: rcNumber || '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
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