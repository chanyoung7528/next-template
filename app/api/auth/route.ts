import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Example authentication logic
    if (email === 'test@example.com' && password === 'password123') {
      return NextResponse.json(
        {
          message: 'Login successful',
          user: {
            id: 1,
            email: email,
            name: 'Test User',
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('[AUTH_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Auth endpoint working' }, { status: 200 });
}
