import { NextResponse } from "next/server";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const { password } = await request.json();
  // Mock reset
  return NextResponse.json({ message: "Password reset successful" });
}
