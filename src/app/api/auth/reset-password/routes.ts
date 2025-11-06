// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/proxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, newPassword, otp } = body;

    if (!identifier || !newPassword || !otp) {
      return NextResponse.json(
        { error: 'Email, password, and OTP are required' },
        { status: 400 }
      );
    }

    console.log('Reset password request for:', identifier);

    const response = await fetch(`${API_BASE_URL}/user/api/v1/forgot-password/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        newPassword,
        otp,
      }),
    });

    const data = await response.json();
    console.log('Reset password response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to reset password' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    );
  }
}