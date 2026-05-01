import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(req, path);
}

async function handleRequest(req: NextRequest, path: string[]) {
  const token = await getToken({ req });
  const url = `${API_BASE_URL}/${path.join('/')}${req.nextUrl.search}`;
  
  const body = req.method !== 'GET' && req.method !== 'HEAD' 
    ? await req.text() 
    : undefined;

  // Forward the request to the real backend
  const response = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      // Master key for secure server-to-server communication
      'x-admin-api-key': process.env.ADMIN_API_KEY || '',
      'x-session-token': (token?.accessToken as string) || '',
      'Authorization': `Bearer ${(token?.accessToken as string) || ''}`,
      'cookie': (req.headers.get('cookie') as string) || '',
    },
    body,
  });

  const data = await response.json().catch(() => ({}));
  
  return NextResponse.json(data, { status: response.status });
}
