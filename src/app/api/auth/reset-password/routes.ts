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
    const { identifier, newPassword, otp } = body;

    if (!identifier || !newPassword || !otp) {
      return NextResponse.json(
        { error: 'Email, new password, and OTP are required' },
        { status: 400 }
      );
    }

    console.log('Password reset complete for:', identifier);

    const response = await fetch(`${API_BASE_URL}/user/api/v1/forgot-password/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        identifier,
        newPassword,
        otp,
      }),
    });

    const data = await response.json();
    console.log('Password reset complete response:', data);

    // Backend returns "failed" status but with success message - handle both cases
    const isSuccess = data.message?.toLowerCase().includes('success') || 
                     data.message?.toLowerCase().includes('verified');

    if (!response.ok && !isSuccess) {
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
    console.error('Password reset complete error:', error);
    return NextResponse.json(
      { error: 'An error occurred during password reset' },
      { status: 500 }
    );
  }
}