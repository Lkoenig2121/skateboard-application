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
    <div 
      style={{
        cursor: 'pointer',
        width: '100%',
        transition: 'transform 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail */}
      <Link href={`/video/${video.id}`}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '12px',
            aspectRatio: '16/9',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Image
            src={video.thumbnail || "/api/placeholder/400/225"}
            alt={video.title}
            width={400}
            height={225}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            unoptimized
          />
          {/* Duration Badge */}
          <div 
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)',
            }}
          >
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div style={{ display: 'flex', gap: '12px', paddingLeft: '2px' }}>
        {/* Channel Avatar */}
        <Link href={`/channel/${video.user.id}`}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              flexShrink: 0,
              marginTop: '4px',
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {video.user.username.charAt(0).toUpperCase()}
          </div>
        </Link>

        {/* Video Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/video/${video.id}`}>
            <h3 
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#111827',
                lineHeight: '1.4',
                marginBottom: '4px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 0.2s ease-in-out',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#111827';
              }}
            >
              {video.title}
            </h3>
          </Link>

          <Link href={`/channel/${video.user.id}`}>
            <p 
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px',
                transition: 'color 0.2s ease-in-out',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              {video.user.username}
            </p>
          </Link>

          <div 
            style={{
              fontSize: '12px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{formatViewCount(video.viewCount)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
