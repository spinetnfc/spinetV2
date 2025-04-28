// src/app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ServerApi } from '@/lib/axios';
import { ProfileData } from '@/lib/api/profile';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const cookieHeader = request.headers.get('cookie');
    const response = await ServerApi.get(`/user/${userId}/profiles`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });
    const profileData: ProfileData = response.data[0];
    return NextResponse.json(profileData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to load profile data: ${error.message}` },
      { status: error.response?.status || 500 }
    );
  }
}