import { NextRequest, NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const mockVideos = [
  {
    id: '1',
    title: 'Epic Skateboard Tricks at Venice Beach',
    description: 'Amazing skateboard tricks and stunts at the famous Venice Beach skate park.',
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
      subscriberCount: 5420,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Mountain Biking Adventure - Trail Riding',
    description: 'Thrilling mountain bike ride through challenging trails and beautiful scenery.',
    thumbnail: '/api/placeholder/400/225',
    videoUrl: '/videos/sample2.mp4',
    duration: 320,
    viewCount: 892,
    likeCount: 67,
    dislikeCount: 1,
    category: 'biking',
    tags: ['mountain biking', 'trails', 'adventure', 'nature'],
    userId: '2',
    user: {
      id: '2',
      username: 'trail_rider',
      email: 'rider@example.com',
      subscriberCount: 3210,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = searchParams.get('limit') || '10';
  const offset = searchParams.get('offset') || '0';

  let filteredVideos = [...mockVideos];

  // Filter by category
  if (category && category !== 'all') {
    filteredVideos = filteredVideos.filter(video => video.category === category);
  }

  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase();
    filteredVideos = filteredVideos.filter(video =>
      video.title.toLowerCase().includes(searchLower) ||
      video.description?.toLowerCase().includes(searchLower) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply pagination
  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);
  const paginatedVideos = filteredVideos.slice(offsetNum, offsetNum + limitNum);

  return NextResponse.json({
    videos: paginatedVideos,
    total: filteredVideos.length,
    hasMore: offsetNum + limitNum < filteredVideos.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, tags, thumbnail } = body;

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Authenticate the user
    // 2. Save the video metadata to the database
    // 3. Handle file uploads to cloud storage
    // 4. Process the video (encoding, thumbnail generation, etc.)

    const newVideo = {
      id: Date.now().toString(),
      title,
      description: description || '',
      thumbnail: thumbnail || '/api/placeholder/400/225',
      videoUrl: '/videos/uploaded-video.mp4', // This would be the actual uploaded video URL
      duration: 0, // This would be determined after processing
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      category,
      tags: tags || [],
      userId: 'current-user-id', // This would come from authentication
      user: {
        id: 'current-user-id',
        username: 'current-user',
        email: 'user@example.com',
        subscriberCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      message: 'Video uploaded successfully',
      video: newVideo,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}