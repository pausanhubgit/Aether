import { NextResponse } from "next/server";

// Mock comments
const mockComments = [
  {
    id: 1,
    artId: 1,
    user: "User1",
    text: "Beautiful!",
    createdAt: "2023-01-01",
  },
];

export async function GET(request, { params }) {
  const { id } = await params;
  const comments = mockComments.filter((c) => c.artId === parseInt(id));
  return NextResponse.json(comments);
}

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const newComment = {
    id: mockComments.length + 1,
    artId: parseInt(id),
    ...body,
  };
  mockComments.push(newComment);
  return NextResponse.json(newComment, { status: 201 });
}
