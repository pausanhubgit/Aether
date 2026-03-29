import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();
  // Mock login
  if (email === 'test@example.com' && password === 'password') {
    return NextResponse.json({ token: 'mock-token', user: { id: 1, email } });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}