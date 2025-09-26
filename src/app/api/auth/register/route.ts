import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In a real app, you'd use a proper database and password hashing
// This is a simplified version for demonstration
const users: any[] = [];
let nextUserId = 1;

export async function POST(request: Request) {
  try {
    const { username, email, password, bio } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(
      user => user.email === email || user.username === username
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: nextUserId++,
      username,
      email,
      password, // In production, hash this with bcrypt
      bio: bio || '',
      avatar: null,
      subscriberCount: 0,
      role: 'user', // 'user' or 'admin'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Create session token (simplified - use JWT in production)
    const sessionToken = `session_${newUser.id}_${Date.now()}`;

    // Set cookie
    cookies().set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}