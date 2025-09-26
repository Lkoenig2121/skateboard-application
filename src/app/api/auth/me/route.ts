import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock user data (in production, fetch from database using session token)
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@skatetube.com',
    bio: 'SkateTube Administrator - Passionate about skateboarding and building the ultimate video platform for extreme sports enthusiasts.',
    avatar: null,
    subscriberCount: 1250,
    role: 'admin',
    createdAt: new Date('2023-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'skater_pro',
    email: 'pro@skatetube.com',
    bio: 'Professional skateboarder from California. Sharing tricks, tutorials, and street skating adventures. Follow for daily skateboarding content!',
    avatar: null,
    subscriberCount: 5420,
    role: 'user',
    createdAt: new Date('2023-03-15').toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET() {
  try {
    const authToken = cookies().get('auth-token');
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // In production, decode JWT token and fetch user from database
    // For demo, we'll return the admin user
    const user = mockUsers[0];

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user without sensitive data
    const { ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}