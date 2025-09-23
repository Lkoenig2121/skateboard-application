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
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Loading skeleton */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                width: '100%',
                paddingBottom: '56.25%',
                backgroundColor: '#e5e7eb',
                borderRadius: '12px',
                marginBottom: '16px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
              <div style={{ height: '32px', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            borderRadius: '12px',
            border: '1px solid #fecaca',
            padding: '48px 24px'
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
              {error ? 'Error Loading Video' : 'Video Not Found'}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '24px' }}>
              {error || "The video you're looking for doesn't exist or may have been removed."}
            </p>
            <a 
              href="/" 
              style={{
                display: 'inline-block',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Header />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px'
        }}>
          {/* Main Video Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLargeScreen ? 'minmax(0, 1fr) 350px' : '1fr',
            gap: '24px'
          }}>
            {/* Video and Info Section */}
            <div style={{ minWidth: 0 }}>
              <YouTubePlayer videoId={video.id} />
              <VideoInfo video={video} />
              <CommentSection comments={comments} videoId={video.id} />
            </div>

            {/* Sidebar - Related Videos */}
            <div style={{ minWidth: 0 }}>
              <RelatedVideos videos={relatedVideos} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
