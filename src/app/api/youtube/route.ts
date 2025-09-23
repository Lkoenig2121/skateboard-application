import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// You'll need to get a YouTube Data API key from Google Cloud Console
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeVideo[];
}

interface VideoDetailsResponse {
  items: Array<{
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
      likeCount?: string;
    };
  }>;
}

// Function to convert ISO 8601 duration to seconds
function convertDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  
  const hours = (match[1] || '').replace('H', '') || '0';
  const minutes = (match[2] || '').replace('M', '') || '0';
  const seconds = (match[3] || '').replace('S', '') || '0';
  
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
}

export async function GET(request: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'skateboarding';
    const maxResults = searchParams.get('maxResults') || '12';

    // Map our categories to YouTube search terms
    const searchTerms: { [key: string]: string } = {
      'all': 'skateboarding OR bmx OR "mountain biking" OR longboarding OR scooter',
      'skateboarding': 'skateboarding tricks OR street skating OR skate park',
      'biking': 'mountain biking OR MTB OR trail riding',
      'bmx': 'BMX tricks OR BMX freestyle OR BMX park',
      'longboarding': 'longboarding OR longboard dancing OR downhill longboard',
      'scooter': 'scooter tricks OR pro scooter OR scooter park',
      'other': 'extreme sports OR action sports'
    };

    const searchQuery = searchTerms[category] || searchTerms['skateboarding'];

    // Search for videos
    const searchResponse = await axios.get<YouTubeSearchResponse>(
      `${YOUTUBE_API_BASE_URL}/search`,
      {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: maxResults,
          order: 'relevance',
          safeSearch: 'strict',
          videoEmbeddable: 'true',
          videoDefinition: 'any',
          videoDuration: 'any'
        }
      }
    );

    const videos = searchResponse.data.items;
    
    if (!videos || videos.length === 0) {
      return NextResponse.json({ videos: [] });
    }

    // Get video IDs for additional details
    const videoIds = videos.map(video => video.id.videoId).join(',');

    // Get video statistics and duration
    const detailsResponse = await axios.get<VideoDetailsResponse>(
      `${YOUTUBE_API_BASE_URL}/videos`,
      {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'contentDetails,statistics',
          id: videoIds
        }
      }
    );

    // Combine data and transform to our format
    const transformedVideos = videos.map((video, index) => {
      const details = detailsResponse.data.items[index];
      const duration = details ? convertDuration(details.contentDetails.duration) : 0;
      const viewCount = details ? parseInt(details.statistics.viewCount) : 0;
      const likeCount = details?.statistics.likeCount ? parseInt(details.statistics.likeCount) : 0;

      return {
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url,
        videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        duration: duration,
        viewCount: viewCount,
        likeCount: likeCount,
        dislikeCount: 0, // YouTube removed public dislike counts
        category: category,
        tags: [category, 'youtube'],
        userId: video.snippet.channelTitle.replace(/\s+/g, '').toLowerCase(),
        user: {
          id: video.snippet.channelTitle.replace(/\s+/g, '').toLowerCase(),
          username: video.snippet.channelTitle,
          email: `${video.snippet.channelTitle.replace(/\s+/g, '').toLowerCase()}@youtube.com`,
          subscriberCount: Math.floor(Math.random() * 100000), // Mock data
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(video.snippet.publishedAt),
        updatedAt: new Date(video.snippet.publishedAt),
      };
    });

    return NextResponse.json({ videos: transformedVideos });

  } catch (error) {
    console.error('YouTube API Error:', error);
    
    // Return fallback mock data if API fails
    const mockVideos = [
      {
        id: "fallback-1",
        title: "Epic Skateboarding Tricks - YouTube API Unavailable",
        description: "Please configure your YouTube API key to see real videos",
        thumbnail: "/api/placeholder/400/225",
        videoUrl: "/videos/sample1.mp4",
        duration: 180,
        viewCount: 1250,
        likeCount: 89,
        dislikeCount: 3,
        category: "skateboarding",
        tags: ["skateboarding", "fallback"],
        userId: "1",
        user: {
          id: "1",
          username: "Demo Channel",
          email: "demo@example.com",
          subscriberCount: 5420,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    return NextResponse.json({ 
      videos: mockVideos,
      error: 'YouTube API unavailable - showing fallback data'
    });
  }
}