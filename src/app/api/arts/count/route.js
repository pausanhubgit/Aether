import { NextResponse } from "next/server";

// Mock count
export async function GET() {
  const count = 42; // Mock total count
  return NextResponse.json({ count });
}
