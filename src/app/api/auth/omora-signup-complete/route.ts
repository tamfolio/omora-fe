// app/api/auth/omora-signup-complete/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.omora.africa';
const API_KEY = '6434754426732';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailAddress, otp } = body;

    if (!emailAddress || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Call Omora signup complete endpoint
    const response = await fetch(`${API_BASE_URL}/user/api/v1/sign-up/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        emailAddress,
        otp,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Invalid OTP' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: data, // Include any data returned from the API
    });
  } catch (error) {
    console.error('Signup complete error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}