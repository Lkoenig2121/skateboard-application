"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import VideoInfo from "@/components/VideoInfo";
import CommentSection from "@/components/CommentSection";
import RelatedVideos from "@/components/RelatedVideos";
import { Video, Comment } from "@/types";

// Mock data for development
const mockVideo: Video = {
  id: "1",
  title: "Epic Skateboard Tricks at Venice Beach",
  description: `Amazing skateboard tricks and stunts at the famous Venice Beach skate park. In this video, you'll see some incredible moves including kickflips, ollies, and rail grinds. The Venice Beach skate park is one of the most iconic spots for skateboarding, and this session really shows why.

Join us as we explore the park and showcase some of the best tricks you'll see anywhere. Whether you're a beginner or a pro, there's something here for everyone to enjoy and learn from.

Don't forget to like and subscribe for more awesome skateboarding content!`,
  thumbnail: "/api/placeholder/400/225",
  videoUrl: "/videos/sample1.mp4",
  duration: 180,
  viewCount: 1250,
  likeCount: 89,
  dislikeCount: 3,
  category: "skateboarding",
  tags: ["skateboarding", "venice beach", "tricks", "street"],
  userId: "1",
  user: {
    id: "1",
    username: "skater_pro",
    email: "skater@example.com",
    avatar: "/api/placeholder/40/40",
    bio: "Professional skateboarder and content creator. Skateboarding since 2010.",
    subscriberCount: 5420,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
    content: "Venice Beach is such an iconic spot. Great video quality too!",
    videoId: "1",
    userId: "3",
    user: {
      id: "3",
      username: "beach_rider",
      email: "beach@example.com",
      subscriberCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    likeCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockRelatedVideos: Video[] = [
  {
    id: "2",
    title: "Mountain Biking Adventure - Trail Riding",
    description: "Thrilling mountain bike ride through challenging trails.",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "/videos/sample2.mp4",
    duration: 320,
    viewCount: 892,
    likeCount: 67,
    dislikeCount: 1,
    category: "biking",
    tags: ["mountain biking", "trails"],
    userId: "2",
    user: {
      id: "2",
      username: "trail_rider",
      email: "rider@example.com",
      subscriberCount: 3210,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
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

  useEffect(() => {
    // In a real app, you would fetch the video data from an API
    // For now, we'll use mock data
    setTimeout(() => {
      setVideo(mockVideo);
      setComments(mockComments);
      setRelatedVideos(mockRelatedVideos);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 aspect-video rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Video not found
            </h1>
            <p className="text-gray-600">
              The video you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Video Content */}
          <div className="xl:col-span-2">
            <VideoPlayer video={video} />
            <VideoInfo video={video} />
            <CommentSection comments={comments} videoId={video.id} />
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </main>
    </div>
  );
}
