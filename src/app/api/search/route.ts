import { NextResponse } from 'next/server';
import axios from 'axios';
import { Video } from '@/types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Helper to convert ISO 8601 duration to seconds
function convertISO8601ToSeconds(iso8601Duration: string): number {
  const durationRegex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
  const matches = iso8601Duration.match(durationRegex);

  if (!matches) return 0;

  const days = parseInt(matches[1] || '0', 10);
  const hours = parseInt(matches[2] || '0', 10);
  const minutes = parseInt(matches[3] || '0', 10);
  const seconds = parseFloat(matches[4] || '0');

  return days * 86400 + hours * 3600 + minutes * 60 + Math.ceil(seconds);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const maxResults = searchParams.get('maxResults') || '12';

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
  }

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // Enhanced search query to focus on skateboarding and action sports
    const enhancedQuery = `${query} skateboarding OR bmx OR longboarding OR scooter OR "action sports"`;

    // Step 1: Search for videos by title/description
    const videoSearchResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        q: enhancedQuery,
        part: 'snippet',
        type: 'video',
        maxResults: Math.ceil(parseInt(maxResults) / 2), // Get half from video search
        regionCode: 'US',
        relevanceLanguage: 'en',
        safeSearch: 'moderate',
        order: 'relevance',
      },
    });

    // Step 2: Search for channels by username, then get their videos
    const channelSearchResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        q: `${query} skateboarding`,
        part: 'snippet',
        type: 'channel',
        maxResults: 5, // Get up to 5 matching channels
        regionCode: 'US',
        relevanceLanguage: 'en',
        order: 'relevance',
      },
    });

    // Get videos from matching channels
    let channelVideos: any[] = [];
    if (channelSearchResponse.data.items && channelSearchResponse.data.items.length > 0) {
      for (const channel of channelSearchResponse.data.items.slice(0, 3)) { // Limit to 3 channels
        try {
          const channelVideosResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
            params: {
              key: YOUTUBE_API_KEY,
              channelId: channel.id.channelId,
              part: 'snippet',
              type: 'video',
              maxResults: 3, // Get 3 videos per channel
              order: 'relevance',
              safeSearch: 'moderate',
            },
          });
          channelVideos = channelVideos.concat(channelVideosResponse.data.items);
        } catch (channelError) {
          console.warn('Error fetching videos for channel:', channel.snippet.title);
        }
      }
    }

    // Combine all video results and remove duplicates
    const allVideoItems = [...videoSearchResponse.data.items, ...channelVideos];
    const uniqueVideoItems = allVideoItems.filter((item, index, self) => 
      index === self.findIndex(t => t.id.videoId === item.id.videoId)
    ).slice(0, parseInt(maxResults)); // Limit to requested max results

    const videoIds = uniqueVideoItems.map((item: any) => item.id.videoId).join(',');

    if (!videoIds) {
      return NextResponse.json({ videos: [], query, totalResults: 0 });
    }

    // Step 3: Get video details (including duration)
    const videosResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        key: YOUTUBE_API_KEY,
        id: videoIds,
        part: 'snippet,contentDetails,statistics',
      },
    });

    const videos: Video[] = videosResponse.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
      duration: convertISO8601ToSeconds(item.contentDetails.duration),
      viewCount: parseInt(item.statistics.viewCount || '0', 10),
      likeCount: parseInt(item.statistics.likeCount || '0', 10),
      dislikeCount: 0, // YouTube API no longer provides public dislike count
      category: 'other', // We could try to categorize based on title/description
      tags: item.snippet.tags || [],
      userId: item.snippet.channelId,
      user: {
        id: item.snippet.channelId,
        username: item.snippet.channelTitle,
        email: '', // Not available from YouTube API
        subscriberCount: 0, // Not directly available from video details
        createdAt: new Date(item.snippet.publishedAt),
        updatedAt: new Date(item.snippet.publishedAt),
      },
      createdAt: new Date(item.snippet.publishedAt),
      updatedAt: new Date(item.snippet.publishedAt),
    }));

    // Calculate total results from both searches
    const totalResults = (videoSearchResponse.data.pageInfo.totalResults || 0) + channelVideos.length;

    return NextResponse.json({ videos, query, totalResults, channelMatches: channelSearchResponse.data.items.length });
  } catch (error: any) {
    console.error('YouTube Search API error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error?.message || 'Failed to search videos from YouTube API' },
      { status: error.response?.status || 500 }
    );
  }
}