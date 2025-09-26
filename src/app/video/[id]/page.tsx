"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import VideoInfo from "@/components/VideoInfo";
import CommentSection from "@/components/CommentSection";
import RelatedVideos from "@/components/RelatedVideos";
import { Video, Comment } from "@/types";

// YouTube Embed Player Component
function YouTubePlayer({ videoId }: { videoId: string }) {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      paddingBottom: '56.25%', // 16:9 aspect ratio
      height: 0,
      backgroundColor: '#000',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <iframe
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

// Mock comments for now (in a real app, these would come from your database)
const mockComments: Comment[] = [
  {
    id: "1",
    content: "Absolutely incredible! Those tricks are insane 🔥",
    videoId: "1",
    userId: "2",
    user: {
      id: "2",
      username: "trick_master",
      email: "tricks@example.com",
      subscriberCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    likeCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    content: "Great video quality and amazing skateboarding skills!",
    videoId: "1",
    userId: "3",
    user: {
      id: "3",
      username: "skate_fan",
      email: "fan@example.com",
      subscriberCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    likeCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function VideoPage() {
  const params = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch the specific video
        const videoResponse = await fetch(`/api/videos/${params.id}`);
        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video');
        }
        const videoData = await videoResponse.json();
        setVideo(videoData.video);

        // Fetch related videos
        const relatedResponse = await fetch('/api/youtube?category=skateboarding&maxResults=8');
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          // Filter out the current video from related videos
          const filteredRelated = relatedData.videos.filter((v: Video) => v.id !== params.id);
          setRelatedVideos(filteredRelated.slice(0, 6));
        }

        // Set mock comments (in a real app, fetch from your database)
        setComments(mockComments);

      } catch (err: any) {
        console.error('Error fetching video:', err);
        setError(err.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="md:ml-60 transition-all duration-300 max-w-6xl mx-auto px-4 py-6">
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="w-full pb-[56.25%] bg-gray-300 rounded-xl mb-4 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <div className="h-8 bg-gray-300 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="md:ml-60 transition-all duration-300 max-w-6xl mx-auto px-4 py-6 text-center">
          <div className="bg-red-50 rounded-xl border border-red-200 p-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {error ? 'Error Loading Video' : 'Video Not Found'}
            </h1>
            <p className="text-gray-600 text-base mb-6">
              {error || "The video you're looking for doesn't exist or may have been removed."}
            </p>
            <a 
              href="/" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg no-underline font-medium transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Main Video Content */}
          <div className={`grid gap-6 ${isLargeScreen ? 'grid-cols-[1fr_350px]' : 'grid-cols-1'}`}>
            {/* Video and Info Section */}
            <div className="min-w-0">
              <YouTubePlayer videoId={video.id} />
              <VideoInfo video={video} />
              <CommentSection comments={comments} videoId={video.id} />
            </div>

            {/* Sidebar - Related Videos */}
            <div className="min-w-0">
              <RelatedVideos videos={relatedVideos} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
