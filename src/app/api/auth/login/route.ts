import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedUser = process.env.ADMIN_USERNAME?.trim();
    const expectedPass = process.env.ADMIN_PASSWORD?.trim();

    if (!expectedUser || !expectedPass) {
      return NextResponse.json({ success: false, message: 'Admin credentials not set in environment' }, { status: 500 });
    }

    if (username?.trim() === expectedUser && password === expectedPass) {
      return NextResponse.json({ success: true, message: 'Login successful' });
    }

    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
