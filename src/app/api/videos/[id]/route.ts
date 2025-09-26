import { NextResponse } from 'next/server';
import axios from 'axios';
import { Video } from '@/types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Helper to convert ISO 8601 duration to seconds
function convertISO8601ToSeconds(iso8601Duration: string): number {
  // Updated regex to handle fractional seconds (e.g., PT3M45.5S) and days
  const durationRegex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
  const matches = iso8601Duration.match(durationRegex);

  if (!matches) return 0;

  const days = parseInt(matches[1] || '0', 10);
  const hours = parseInt(matches[2] || '0', 10);
  const minutes = parseInt(matches[3] || '0', 10);
  const seconds = parseFloat(matches[4] || '0'); // Use parseFloat to handle decimal seconds

  // Round up to the nearest second to ensure videos don't end early
  return days * 86400 + hours * 3600 + minutes * 60 + Math.ceil(seconds);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: videoId } = await params;

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
  }

  try {
    // Fetch video details from YouTube API
    const videoResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        key: YOUTUBE_API_KEY,
        id: videoId,
        part: 'snippet,contentDetails,statistics',
      },
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const item = videoResponse.data.items[0];

    // Fetch channel details
    const channelResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
      params: {
        key: YOUTUBE_API_KEY,
        id: item.snippet.channelId,
        part: 'snippet,statistics',
      },
    });

    const channelData = channelResponse.data.items?.[0];

    const video: Video = {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
      duration: convertISO8601ToSeconds(item.contentDetails.duration),
      viewCount: parseInt(item.statistics.viewCount || '0', 10),
      likeCount: parseInt(item.statistics.likeCount || '0', 10),
      dislikeCount: 0, // YouTube API no longer provides public dislike count
      category: 'skateboarding', // Default since we're focusing on skateboarding content
      tags: item.snippet.tags || [],
      userId: item.snippet.channelId,
      user: {
        id: item.snippet.channelId,
        username: item.snippet.channelTitle,
        email: '', // Not available from YouTube API
        avatar: channelData?.snippet?.thumbnails?.default?.url,
        bio: channelData?.snippet?.description,
        subscriberCount: parseInt(channelData?.statistics?.subscriberCount || '0', 10),
        createdAt: new Date(channelData?.snippet?.publishedAt || item.snippet.publishedAt),
        updatedAt: new Date(channelData?.snippet?.publishedAt || item.snippet.publishedAt),
      },
      createdAt: new Date(item.snippet.publishedAt),
      updatedAt: new Date(item.snippet.publishedAt),
    };

    return NextResponse.json({ video });
  } catch (error: any) {
    console.error('YouTube API error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error?.message || 'Failed to fetch video from YouTube API' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, value } = body;

    // In a real app, you would:
    // 1. Authenticate the user
    // 2. Update the video interaction in your database
    // 3. Handle different actions (like, dislike, view, etc.)
    // Note: We can't actually update YouTube's like/dislike counts via API

    switch (action) {
      case 'like':
        return NextResponse.json({
          message: 'Like action recorded',
          success: true,
        });

      case 'dislike':
        return NextResponse.json({
          message: 'Dislike action recorded',
          success: true,
        });

      case 'view':
        return NextResponse.json({
          message: 'View recorded',
          success: true,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error handling video interaction:', error);
    return NextResponse.json(
      { error: 'Failed to process video interaction' },
      { status: 500 }
    );
  }
}