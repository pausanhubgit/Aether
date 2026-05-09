import { NextResponse } from "next/server";

// Mock data for arts
const mockArts = [
  {
    id: 1,
    title: "Sunset Landscape",
    description: "A beautiful sunset over the mountains.",
    price: 150,
    imageUrls: ["/assets/images/arts/sunset.jpg"],
    category: "Landscape",
    artist: "John Doe",
    likes: 25,
    comments: [],
  },
  {
    id: 2,
    title: "Abstract Art",
    description: "Modern abstract painting.",
    price: 200,
    imageUrls: ["/assets/images/arts/abstract.jpg"],
    category: "Abstract",
    artist: "Jane Smith",
    likes: 15,
    comments: [],
  },
  // Add more mock data as needed
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = searchParams.get("limit") || 10;

  let filteredArts = mockArts;

  if (category) {
    filteredArts = mockArts.filter(
      (art) => art.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // Simulate pagination or limit
  filteredArts = filteredArts.slice(0, parseInt(limit));

  return NextResponse.json(filteredArts);
}

export async function POST(request) {
  const body = await request.json();
  // In a real app, save to database
  const newArt = { id: mockArts.length + 1, ...body };
  mockArts.push(newArt);
  return NextResponse.json(newArt, { status: 201 });
}
