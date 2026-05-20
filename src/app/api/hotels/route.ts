import { NextResponse } from 'next/server';

export const revalidate = 30;

export async function GET() {
  const res = await fetch('https://hardy-mouse-88.eu-west-1.convex.cloud/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: 'hotels:getAll', args: {} }),
    next: { revalidate: 30 },
  });
  const data = await res.json();
  return NextResponse.json(data.status === 'success' ? data.value : []);
}
