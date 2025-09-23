"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Video } from "@/types";

interface VideoCardProps {
  video: Video;
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

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "today";
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="cursor-pointer">
      {/* Thumbnail */}
      <Link href={`/video/${video.id}`}>
        <div
          className="relative w-full bg-gray-200 rounded-xl overflow-hidden mb-3"
          style={{ aspectRatio: "16/9" }}
        >
          <Image
            src={video.thumbnail || "/api/placeholder/400/225"}
            alt={video.title}
            width={400}
            height={225}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            unoptimized
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-medium px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex space-x-3">
        {/* Channel Avatar */}
        <Link href={`/channel/${video.user.id}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 mt-1">
            {video.user.username.charAt(0).toUpperCase()}
          </div>
        </Link>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/video/${video.id}`}>
            <h3 className="text-base font-medium text-gray-900 leading-5 mb-1 line-clamp-2 hover:text-blue-600">
              {video.title}
            </h3>
          </Link>

          <Link href={`/channel/${video.user.id}`}>
            <p className="text-sm text-gray-600 hover:text-gray-900 mb-1">
              {video.user.username}
            </p>
          </Link>

          <div className="text-sm text-gray-600 flex items-center">
            <span>{formatViewCount(video.viewCount)} views</span>
            <span className="mx-1">•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
