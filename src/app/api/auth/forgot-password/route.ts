// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/proxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Forgot password request for:', email);

    // Call the forgot-password endpoint with identifier (not email)
    const response = await fetch(`${API_BASE_URL}/user/api/v1/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        identifier: email,  // Send as identifier, not email
      }),
    });

    const data = await response.json();
    console.log('Forgot password response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to send reset email' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset code sent successfully',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}