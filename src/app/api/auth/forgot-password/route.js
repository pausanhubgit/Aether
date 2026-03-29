import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email } = await request.json();
  // Mock forgot password
  return NextResponse.json({ message: 'Reset email sent' });
}