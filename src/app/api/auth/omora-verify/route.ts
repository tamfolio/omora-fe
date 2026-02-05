import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL!;
const API_KEY = process.env.OMORA_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      console.error("❌ API key not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { identifier, otp, rememberMe } = body;

    console.log("🔐 OTP Verification started for:", identifier);

    const response = await fetch(
      `${API_BASE_URL}/user/api/v1/sign-in/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          identifier,
          otp,
        }),
      },
    );

    const data = await response.json();

    console.log("📥 OTP API Response:", {
      ok: response.ok,
      status: response.status,
      dataKeys: Object.keys(data),
      hasToken: !!data.token,
      hasAccessToken: !!data.accessToken,
      tokenKeys: data.token ? Object.keys(data.token) : []
    });

    if (!response.ok) {
      console.error("❌ OTP verification failed:", data);
      return NextResponse.json(
        { error: data.message || "Invalid OTP" },
        { status: response.status },
      );
    }

    // Extract accessToken - handle multiple response formats
    let accessToken: string | undefined;
    
    // Format 1: data.token.accessToken (nested object)
    if (data.token && typeof data.token === 'object' && data.token.accessToken) {
      accessToken = data.token.accessToken;
      console.log("✅ Token found in data.token.accessToken");
    }
    // Format 2: data.accessToken (direct property)
    else if (data.accessToken) {
      accessToken = data.accessToken;
      console.log("✅ Token found in data.accessToken");
    }
    // Format 3: data.token as string (token is the string itself)
    else if (data.token && typeof data.token === 'string') {
      accessToken = data.token;
      console.log("✅ Token found as string in data.token");
    }

    if (!accessToken) {
      console.error("❌ No access token found in response:", {
        dataStructure: JSON.stringify(data, null, 2)
      });
      return NextResponse.json(
        { error: "No access token received from API" },
        { status: 500 },
      );
    }

    console.log("✅ Access token extracted:", {
      length: accessToken.length,
      preview: accessToken.substring(0, 30) + "..."
    });

    // Get user profile with the token
    const profileResponse = await fetch(`${API_BASE_URL}/user/api/v1/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-api-key": API_KEY,
      },
    });

    console.log("👤 Profile fetch:", {
      ok: profileResponse.ok,
      status: profileResponse.status
    });

    const profileData = profileResponse.ok ? await profileResponse.json() : {};
    
    // Handle nested profile data structure
    const profile = profileData.data?.user || profileData.data || profileData;

    console.log("👤 Profile data:", {
      hasData: !!profileData.data,
      hasUser: !!profile,
      profileKeys: Object.keys(profile || {})
    });

    // Extract refresh token
    const refreshToken = data.token?.refreshToken || data.refreshToken;

    // Build user object for NextAuth
    const user = {
      id: data.data?.id || data.userId || profile.id || identifier,
      email: identifier,
      name:
        profile.firstName && profile.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile.name || identifier,
      role: data.data?.role || data.role || profile.role || "user",
      accessToken: accessToken,
      refreshToken: refreshToken || "",
      isFirstLogin: profile.isPinSet === false,
    };

    console.log("✅ User object created:", {
      id: user.id,
      email: user.email,
      hasAccessToken: !!user.accessToken,
      tokenLength: user.accessToken.length,
      isFirstLogin: user.isFirstLogin
    });

    return NextResponse.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 },
    );
  }
}