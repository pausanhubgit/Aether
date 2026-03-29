import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  // Mock register
  return NextResponse.json({ message: 'User registered', user: { id: 1, ...body } }, { status: 201 });
}