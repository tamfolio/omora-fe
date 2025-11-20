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
    const { identifier, otp } = body;

    console.log('OTP verification for:', identifier);

    const response = await fetch(`${API_BASE_URL}/user/api/v1/sign-in/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        identifier,
        otp,
      }),
    });

    const data = await response.json();
    console.log('OTP verification response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Invalid OTP' },
        { status: response.status }
      );
    }

    // Get user profile with the token
    const token = data.token || data.accessToken;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token received from API' },
        { status: 500 }
      );
    }

    console.log('Fetching user profile...');

    const profileResponse = await fetch(`${API_BASE_URL}/user/api/v1/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': API_KEY,
      },
    });

    const profile = profileResponse.ok ? await profileResponse.json() : {};
    console.log('User profile:', profile);

    // Return user data for NextAuth
    return NextResponse.json({
      success: true,
      user: {
        id: data.userId || profile.id || identifier,
        email: identifier,
        name: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}` 
          : profile.name || identifier,
        role: data.role || profile.role || 'user',
        accessToken: token,
        refreshToken: data.refreshToken,
        isFirstLogin: profile.isPinSet === false,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}