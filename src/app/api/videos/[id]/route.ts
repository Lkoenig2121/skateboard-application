import { NextRequest, NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const mockVideo = {
  id: '1',
  title: 'Epic Skateboard Tricks at Venice Beach',
  description: `Amazing skateboard tricks and stunts at the famous Venice Beach skate park. In this video, you'll see some incredible moves including kickflips, ollies, and rail grinds.

The Venice Beach skate park is one of the most iconic spots for skateboarding, and this session really shows why.

Join us as we explore the park and showcase some of the best tricks you'll see anywhere. Whether you're a beginner or a pro, there's something here for everyone to enjoy and learn from.

Don't forget to like and subscribe for more awesome skateboarding content!`,
  thumbnail: '/api/placeholder/400/225',
  videoUrl: '/videos/sample1.mp4',
  duration: 180,
  viewCount: 1250,
  likeCount: 89,
  dislikeCount: 3,
  category: 'skateboarding',
  tags: ['skateboarding', 'venice beach', 'tricks', 'street'],
  userId: '1',
  user: {
    id: '1',
    username: 'skater_pro',
    email: 'skater@example.com',
    avatar: '/api/placeholder/40/40',
    bio: 'Professional skateboarder and content creator. Skateboarding since 2010.',
    subscriberCount: 5420,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // In a real app, you would fetch the video from the database
  // For now, we'll return the mock video for any ID
  
  if (!id) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  // Simulate incrementing view count
  const video = {
    ...mockVideo,
    id,
    viewCount: mockVideo.viewCount + 1,
  };

  return NextResponse.json({ video });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, value } = body;

    // In a real app, you would:
    // 1. Authenticate the user
    // 2. Update the video in the database
    // 3. Handle different actions (like, dislike, view, etc.)

    switch (action) {
      case 'like':
        return NextResponse.json({
          message: 'Video liked successfully',
          likeCount: mockVideo.likeCount + (value ? 1 : -1),
        });

      case 'dislike':
        return NextResponse.json({
          message: 'Video disliked successfully',
          dislikeCount: mockVideo.dislikeCount + (value ? 1 : -1),
        });

      case 'view':
        return NextResponse.json({
          message: 'View count updated',
          viewCount: mockVideo.viewCount + 1,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}