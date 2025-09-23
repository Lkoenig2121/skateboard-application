"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { Video } from "@/types";

interface RelatedVideosProps {
  videos: Video[];
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const videoDate = date instanceof Date ? date : new Date(date);
  
  // Check if the date is valid
  if (isNaN(videoDate.getTime())) {
    return "recently";
  }
  
  const diffInMs = now.getTime() - videoDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
}

export default function RelatedVideos({ videos }: RelatedVideosProps) {
  return (
    <div className="yt-sidebar">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={`/video/${video.id}`}
          className="yt-sidebar-video"
        >
          <div className="yt-sidebar-thumbnail">
            <Image
              src={video.thumbnail || "/api/placeholder/160/90"}
              alt={video.title}
              width={160}
              height={90}
              className="w-full h-full object-cover"
              unoptimized
            />
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>

          <div className="yt-sidebar-info">
            <h4 className="yt-sidebar-title">{video.title}</h4>
            <p className="yt-sidebar-channel">{video.user.username}</p>
            <div className="yt-sidebar-meta">
              <span>{formatViewCount(video.viewCount)} views</span>
              <span className="mx-1">•</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>
          </div>
        </Link>
      ))}

      {videos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No related videos found</p>
        </div>
      )}
    </div>
  );
}
