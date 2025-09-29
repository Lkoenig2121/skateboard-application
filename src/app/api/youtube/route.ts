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
  // Updated regex to handle fractional seconds (e.g., PT3M45.5S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseFloat(match[3] || '0'); // Use parseFloat to handle decimal seconds
  
  // Round up to the nearest second to ensure videos don't end early
  return hours * 3600 + minutes * 60 + Math.ceil(seconds);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'skateboarding';
  const maxResults = searchParams.get('maxResults') || '12';

  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    // Map our categories to YouTube search terms
    const searchTerms: { [key: string]: string } = {
      'all': 'skateboarding OR bmx OR "mountain biking" OR longboarding OR scooter',
      'skateboarding': 'skateboarding tricks OR street skating OR skate park',
      'biking': 'mountain biking OR MTB OR trail riding',
      'bmx': 'BMX tricks OR BMX freestyle OR BMX park',
      'longboarding': 'longboarding OR longboard dancing OR downhill longboard',
      'scooter': 'scooter tricks OR pro scooter OR scooter park',
      'other': 'extreme sports OR action sports',
      'trending': 'trending skateboarding OR viral skateboarding OR popular skateboarding',
      'music': 'skateboarding music OR skateboarding songs OR skateboarding soundtrack',
      'gaming': 'skateboarding game OR skateboarding gaming OR skateboarding video game',
      'sports': 'skateboarding competition OR skateboarding tournament OR skateboarding sports',
      'shorts': 'skateboarding shorts OR short skateboarding OR skateboarding clips',
      'kickflips': 'kickflip OR kickflip tricks OR kickflip tutorial OR kickflip compilation',
      'compilations': 'skateboarding compilation OR skateboarding montage OR best skateboarding tricks',
      'street-skating': 'street skating OR street skateboarding OR urban skating OR city skating',
      'skate-park': 'skate park OR skatepark OR skate park tricks OR bowl riding OR ramp skating'
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
    const mockVideosByCategory = {
      all: [
        {
          id: "fallback-skate-1",
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
        },
        {
          id: "fallback-bmx-1",
          title: "BMX Street Riding - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample2.mp4",
          duration: 240,
          viewCount: 890,
          likeCount: 67,
          dislikeCount: 2,
          category: "bmx",
          tags: ["bmx", "fallback"],
          userId: "2",
          user: {
            id: "2",
            username: "BMX Pro",
            email: "bmx@example.com",
            subscriberCount: 3200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "fallback-mtb-1",
          title: "Mountain Biking Adventures - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample3.mp4",
          duration: 320,
          viewCount: 2100,
          likeCount: 145,
          dislikeCount: 8,
          category: "biking",
          tags: ["mountain biking", "fallback"],
          userId: "3",
          user: {
            id: "3",
            username: "MTB Rider",
            email: "mtb@example.com",
            subscriberCount: 7800,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "fallback-longboard-1",
          title: "Longboarding Downhill - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample4.mp4",
          duration: 195,
          viewCount: 1560,
          likeCount: 98,
          dislikeCount: 5,
          category: "longboarding",
          tags: ["longboarding", "fallback"],
          userId: "4",
          user: {
            id: "4",
            username: "Longboard Pro",
            email: "longboard@example.com",
            subscriberCount: 4200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      skateboarding: [
        {
          id: "fallback-skate-1",
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
        },
        {
          id: "fallback-skate-2",
          title: "Street Skating Session - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample5.mp4",
          duration: 220,
          viewCount: 980,
          likeCount: 72,
          dislikeCount: 4,
          category: "skateboarding",
          tags: ["skateboarding", "street", "fallback"],
          userId: "5",
          user: {
            id: "5",
            username: "Street Skater",
            email: "street@example.com",
            subscriberCount: 2800,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      bmx: [
        {
          id: "fallback-bmx-1",
          title: "BMX Street Riding - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample2.mp4",
          duration: 240,
          viewCount: 890,
          likeCount: 67,
          dislikeCount: 2,
          category: "bmx",
          tags: ["bmx", "fallback"],
          userId: "2",
          user: {
            id: "2",
            username: "BMX Pro",
            email: "bmx@example.com",
            subscriberCount: 3200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      biking: [
        {
          id: "fallback-mtb-1",
          title: "Mountain Biking Adventures - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample3.mp4",
          duration: 320,
          viewCount: 2100,
          likeCount: 145,
          dislikeCount: 8,
          category: "biking",
          tags: ["mountain biking", "fallback"],
          userId: "3",
          user: {
            id: "3",
            username: "MTB Rider",
            email: "mtb@example.com",
            subscriberCount: 7800,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      longboarding: [
        {
          id: "fallback-longboard-1",
          title: "Longboarding Downhill - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample4.mp4",
          duration: 195,
          viewCount: 1560,
          likeCount: 98,
          dislikeCount: 5,
          category: "longboarding",
          tags: ["longboarding", "fallback"],
          userId: "4",
          user: {
            id: "4",
            username: "Longboard Pro",
            email: "longboard@example.com",
            subscriberCount: 4200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      scooter: [
        {
          id: "fallback-scooter-1",
          title: "Scooter Tricks Compilation - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample6.mp4",
          duration: 165,
          viewCount: 750,
          likeCount: 54,
          dislikeCount: 3,
          category: "scooter",
          tags: ["scooter", "fallback"],
          userId: "6",
          user: {
            id: "6",
            username: "Scooter Pro",
            email: "scooter@example.com",
            subscriberCount: 1900,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      other: [
        {
          id: "fallback-other-1",
          title: "Extreme Sports Mix - YouTube API Unavailable",
          description: "Please configure your YouTube API key to see real videos",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sample7.mp4",
          duration: 280,
          viewCount: 1100,
          likeCount: 78,
          dislikeCount: 6,
          category: "other",
          tags: ["extreme sports", "fallback"],
          userId: "7",
          user: {
            id: "7",
            username: "Extreme Sports",
            email: "extreme@example.com",
            subscriberCount: 3500,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      trending: [
        {
          id: "trending-1",
          title: "🔥 VIRAL Skateboarding Compilation - YouTube API Unavailable",
          description: "Most viral skateboarding moments - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/trending1.mp4",
          duration: 300,
          viewCount: 50000,
          likeCount: 2500,
          dislikeCount: 50,
          category: "trending",
          tags: ["trending", "viral", "fallback"],
          userId: "trending",
          user: {
            id: "trending",
            username: "Trending Channel",
            email: "trending@example.com",
            subscriberCount: 100000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      music: [
        {
          id: "music-1",
          title: "🎵 Skateboarding Music Mix - YouTube API Unavailable",
          description: "Best music for skateboarding - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/music1.mp4",
          duration: 180,
          viewCount: 15000,
          likeCount: 800,
          dislikeCount: 20,
          category: "music",
          tags: ["music", "skateboarding", "fallback"],
          userId: "music",
          user: {
            id: "music",
            username: "Music Channel",
            email: "music@example.com",
            subscriberCount: 25000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      gaming: [
        {
          id: "gaming-1",
          title: "🎮 Skateboarding Gameplay - YouTube API Unavailable",
          description: "Best skateboarding games - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/gaming1.mp4",
          duration: 240,
          viewCount: 8000,
          likeCount: 400,
          dislikeCount: 15,
          category: "gaming",
          tags: ["gaming", "skateboarding", "fallback"],
          userId: "gaming",
          user: {
            id: "gaming",
            username: "Gaming Channel",
            email: "gaming@example.com",
            subscriberCount: 15000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      sports: [
        {
          id: "sports-1",
          title: "🏆 Skateboarding Competition - YouTube API Unavailable",
          description: "Professional skateboarding competitions - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/sports1.mp4",
          duration: 360,
          viewCount: 12000,
          likeCount: 600,
          dislikeCount: 25,
          category: "sports",
          tags: ["sports", "competition", "fallback"],
          userId: "sports",
          user: {
            id: "sports",
            username: "Sports Channel",
            email: "sports@example.com",
            subscriberCount: 30000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      shorts: [
        {
          id: "shorts-1",
          title: "⚡ Quick Skateboarding Tricks - YouTube API Unavailable",
          description: "Short skateboarding clips - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/shorts1.mp4",
          duration: 30,
          viewCount: 25000,
          likeCount: 1200,
          dislikeCount: 40,
          category: "shorts",
          tags: ["shorts", "quick", "fallback"],
          userId: "shorts",
          user: {
            id: "shorts",
            username: "Shorts Channel",
            email: "shorts@example.com",
            subscriberCount: 50000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      kickflips: [
        {
          id: "kickflip-1",
          title: "🛹 Epic Kickflip Compilation - YouTube API Unavailable",
          description: "Best kickflip tricks and tutorials - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/kickflip1.mp4",
          duration: 180,
          viewCount: 15000,
          likeCount: 800,
          dislikeCount: 20,
          category: "kickflips",
          tags: ["kickflip", "tricks", "fallback"],
          userId: "kickflip",
          user: {
            id: "kickflip",
            username: "Kickflip Pro",
            email: "kickflip@example.com",
            subscriberCount: 25000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      compilations: [
        {
          id: "compilation-1",
          title: "🎬 Best Skateboarding Compilation - YouTube API Unavailable",
          description: "Epic skateboarding montage - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/compilation1.mp4",
          duration: 300,
          viewCount: 25000,
          likeCount: 1200,
          dislikeCount: 30,
          category: "compilations",
          tags: ["compilation", "montage", "fallback"],
          userId: "compilation",
          user: {
            id: "compilation",
            username: "Compilation Channel",
            email: "compilation@example.com",
            subscriberCount: 40000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      "street-skating": [
        {
          id: "street-1",
          title: "🏙️ Street Skating Session - YouTube API Unavailable",
          description: "Raw street skating in the city - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/street1.mp4",
          duration: 240,
          viewCount: 18000,
          likeCount: 900,
          dislikeCount: 25,
          category: "street-skating",
          tags: ["street", "urban", "fallback"],
          userId: "street",
          user: {
            id: "street",
            username: "Street Skater",
            email: "street@example.com",
            subscriberCount: 30000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      "skate-park": [
        {
          id: "park-1",
          title: "🛹 Skate Park Session - YouTube API Unavailable",
          description: "Epic skate park tricks and bowl riding - YouTube API Unavailable",
          thumbnail: "/api/placeholder/400/225",
          videoUrl: "/videos/park1.mp4",
          duration: 200,
          viewCount: 12000,
          likeCount: 600,
          dislikeCount: 15,
          category: "skate-park",
          tags: ["skatepark", "bowl", "fallback"],
          userId: "park",
          user: {
            id: "park",
            username: "Park Rider",
            email: "park@example.com",
            subscriberCount: 20000,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    };

    const mockVideos = mockVideosByCategory[category as keyof typeof mockVideosByCategory] || mockVideosByCategory.all;

    return NextResponse.json({ 
      videos: mockVideos,
      error: 'YouTube API unavailable - showing fallback data'
    });
  }
}