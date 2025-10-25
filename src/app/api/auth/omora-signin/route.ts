// app/api/auth/omora-signin/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/proxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    console.log('Omora sign-in attempt for:', identifier);

    const response = await fetch(`${API_BASE_URL}/user/api/v1/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await response.json();
    console.log('Sign-in response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Invalid credentials' },
        { status: response.status }
      );
    }

    // Check if OTP is required
    if (data.status === 'success' || data.message?.toLowerCase().includes('otp')) {
      return NextResponse.json({
        success: true,
        requiresOtp: true,
        message: data.message,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'An error occurred during sign in' },
      { status: 500 }
    );
  }
}