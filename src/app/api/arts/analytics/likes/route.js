import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const merchantId = searchParams.get('merchantId');
  // Mock analytics
  const analytics = { totalLikes: 100, merchantId };
  return NextResponse.json(analytics);
}