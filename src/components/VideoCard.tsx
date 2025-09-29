"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Plus, Check } from "lucide-react";
import { Video } from "@/types";
import { useState, useEffect } from "react";

interface VideoCardProps {
  video: Video;
  isLargeScreen?: boolean;
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

export default function VideoCard({ video, isLargeScreen = true }: VideoCardProps) {
  const [isInWatchLater, setIsInWatchLater] = useState(false);

  useEffect(() => {
    // Check if video is in watch later
    const checkWatchLater = () => {
      try {
        const watchLaterData = localStorage.getItem("watchLater");
        if (watchLaterData) {
          const watchLaterVideos = JSON.parse(watchLaterData);
          const isInList = watchLaterVideos.some((v: Video) => v.id === video.id);
          setIsInWatchLater(isInList);
        }
      } catch (error) {
        console.error("Error checking watch later:", error);
      }
    };

    checkWatchLater();
  }, [video.id]);

  const addToWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const watchLaterData = localStorage.getItem("watchLater");
      let watchLaterVideos = watchLaterData ? JSON.parse(watchLaterData) : [];
      
      if (isInWatchLater) {
        // Remove from watch later
        watchLaterVideos = watchLaterVideos.filter((v: Video) => v.id !== video.id);
        setIsInWatchLater(false);
      } else {
        // Add to watch later
        watchLaterVideos.push(video);
        setIsInWatchLater(true);
      }
      
      localStorage.setItem("watchLater", JSON.stringify(watchLaterVideos));
    } catch (error) {
      console.error("Error updating watch later:", error);
    }
  };

  const addToHistory = () => {
    try {
      const historyData = localStorage.getItem("watchHistory");
      let historyVideos = historyData ? JSON.parse(historyData) : [];
      
      // Remove if already exists to avoid duplicates
      historyVideos = historyVideos.filter((v: Video) => v.id !== video.id);
      
      // Add to beginning of array
      historyVideos.unshift(video);
      
      // Keep only last 100 videos
      if (historyVideos.length > 100) {
        historyVideos = historyVideos.slice(0, 100);
      }
      
      localStorage.setItem("watchHistory", JSON.stringify(historyVideos));
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  return (
    <div
      className="video-card-mobile"
      style={{
        cursor: "pointer",
        width: "100%",
        transition: "transform 0.2s ease-in-out",
        padding: "0",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      <Link href={`/video/${video.id}`} onClick={addToHistory}>
        <div
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#1a1a1a",
            borderRadius: isLargeScreen ? "12px" : "8px",
            overflow: "hidden",
            marginBottom: isLargeScreen ? "12px" : "8px",
            aspectRatio: "16/9",
            boxShadow: isLargeScreen ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => {
            const button = e.currentTarget.querySelector('button[onClick]') as HTMLButtonElement;
            if (button) {
              button.style.opacity = "1";
            }
          }}
          onMouseLeave={(e) => {
            const button = e.currentTarget.querySelector('button[onClick]') as HTMLButtonElement;
            if (button) {
              button.style.opacity = "0";
            }
          }}
        >
          <Image
            src={video.thumbnail || "/api/placeholder/400/225"}
            alt={video.title}
            width={400}
            height={225}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            unoptimized
          />
          {/* Duration Badge */}
          <div
            style={{
              position: "absolute",
              bottom: isLargeScreen ? "8px" : "4px",
              right: isLargeScreen ? "8px" : "4px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              fontSize: isLargeScreen ? "12px" : "10px",
              fontWeight: "600",
              padding: isLargeScreen ? "2px 6px" : "1px 4px",
              borderRadius: isLargeScreen ? "4px" : "3px",
              backdropFilter: "blur(4px)",
            }}
          >
            {formatDuration(video.duration)}
          </div>

          {/* Watch Later Button */}
          <button
            onClick={addToWatchLater}
            style={{
              position: "absolute",
              top: isLargeScreen ? "8px" : "4px",
              right: isLargeScreen ? "8px" : "4px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: isLargeScreen ? "32px" : "28px",
              height: isLargeScreen ? "32px" : "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "all 0.2s ease",
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.7";
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            }}
          >
            {isInWatchLater ? (
              <Check size={isLargeScreen ? 16 : 14} />
            ) : (
              <Plus size={isLargeScreen ? 16 : 14} />
            )}
          </button>
        </div>
      </Link>

      {/* Video Info */}
      <div style={{ 
        display: "flex", 
        gap: isLargeScreen ? "12px" : "10px", 
        paddingLeft: isLargeScreen ? "2px" : "0",
        marginTop: isLargeScreen ? "0" : "4px"
      }}>
        {/* Channel Avatar */}
        <Link href={`/channel/${video.user.id}`}>
          <div
            style={{
              width: isLargeScreen ? "36px" : "32px",
              height: isLargeScreen ? "36px" : "32px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              fontSize: isLargeScreen ? "14px" : "12px",
              flexShrink: 0,
              marginTop: "4px",
              transition: "transform 0.2s ease-in-out",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {video.user.username.charAt(0).toUpperCase()}
          </div>
        </Link>

        {/* Video Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/video/${video.id}`} onClick={addToHistory}>
            <h3
              style={{
                fontSize: isLargeScreen ? "14px" : "13px",
                fontWeight: "500",
                color: "#ffffff",
                lineHeight: "1.4",
                marginBottom: isLargeScreen ? "4px" : "2px",
                display: "-webkit-box",
                WebkitLineClamp: isLargeScreen ? 2 : 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                transition: "color 0.2s ease-in-out",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              {video.title}
            </h3>
          </Link>

          <Link href={`/channel/${video.user.id}`}>
            <p
              style={{
                fontSize: isLargeScreen ? "12px" : "11px",
                color: "#cccccc",
                marginBottom: isLargeScreen ? "4px" : "2px",
                transition: "color 0.2s ease-in-out",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#cccccc";
              }}
            >
              {video.user.username}
            </p>
          </Link>

          <div
            style={{
              fontSize: isLargeScreen ? "12px" : "10px",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: isLargeScreen ? "4px" : "3px",
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
