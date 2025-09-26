import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Import users from register route (in production, use database)
// For now, we'll simulate a simple user store
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@skatetube.com',
    password: 'admin123', // In production, this would be hashed
    bio: 'SkateTube Administrator',
    avatar: null,
    subscriberCount: 0,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session token (simplified - use JWT in production)
    const sessionToken = `session_${user.id}_${Date.now()}`;

    // Set cookie
    cookies().set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}