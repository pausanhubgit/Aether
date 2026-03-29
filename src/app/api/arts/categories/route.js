import { NextResponse } from 'next/server';

// Mock categories
const mockCategories = [
  { id: 1, name: 'Landscape' },
  { id: 2, name: 'Abstract' },
  { id: 3, name: 'Portrait' },
  { id: 4, name: 'Still Life' },
];

export async function GET() {
  return NextResponse.json(mockCategories);
}