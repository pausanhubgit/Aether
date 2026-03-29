import { NextResponse } from 'next/server';

// Mock data (same as above, but in real app, fetch from DB)
const mockArts = [
  {
    id: 1,
    title: 'Sunset Landscape',
    description: 'A beautiful sunset over the mountains.',
    price: 150,
    imageUrls: ['/assets/images/arts/sunset.jpg'],
    category: 'Landscape',
    artist: 'John Doe',
    likes: 25,
    comments: []
  },
  {
    id: 2,
    title: 'Abstract Art',
    description: 'Modern abstract painting.',
    price: 200,
    imageUrls: ['/assets/images/arts/abstract.jpg'],
    category: 'Abstract',
    artist: 'Jane Smith',
    likes: 15,
    comments: []
  },
];

export async function GET(request, { params }) {
  const { id } = await params;
  const art = mockArts.find(a => a.id === parseInt(id));
  if (!art) {
    return NextResponse.json({ error: 'Art not found' }, { status: 404 });
  }
  return NextResponse.json(art);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const index = mockArts.findIndex(a => a.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json({ error: 'Art not found' }, { status: 404 });
  }
  mockArts[index] = { ...mockArts[index], ...body };
  return NextResponse.json(mockArts[index]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const index = mockArts.findIndex(a => a.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json({ error: 'Art not found' }, { status: 404 });
  }
  const deletedArt = mockArts.splice(index, 1);
  return NextResponse.json(deletedArt[0]);
}