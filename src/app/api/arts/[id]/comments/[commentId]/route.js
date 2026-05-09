import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { commentId } = params;
  // Mock delete
  return NextResponse.json({ message: `Deleted comment ${commentId}` });
}
