import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.omora.africa';
const API_KEY = process.env.OMORA_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Get request body
    const body = await request.json();
    const { firstName, lastName, middleName, dateOfBirth, bvn, gender, occupation, sourceOfFund } = body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !bvn || !gender || !occupation || !sourceOfFund) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Omora API
    const response = await fetch(`${API_BASE_URL}/user/api/v1/onboarding/personal/information`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        middleName: middleName || '',
        dateOfBirth,
        bvn,
        gender,
        occupation,
        sourceOfFund,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: data.message || 'Failed to submit personal information',
          statusCode: data.statusCode 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Personal information submitted successfully',
      data: data,
    });

  } catch (error) {
    console.error('Personal Information API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting personal information' },
      { status: 500 }
    );
  }
}