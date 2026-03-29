import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = await params;
  // Mock like
  return NextResponse.json({ message: `Liked art ${id}` });
}