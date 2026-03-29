import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = await params;
  // Mock unlike
  return NextResponse.json({ message: `Unliked art ${id}` });
}