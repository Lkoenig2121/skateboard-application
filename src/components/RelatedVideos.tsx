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
    <div style={{ width: "100%" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#ffffff",
          marginBottom: "16px",
          paddingLeft: "4px",
        }}
      >
        Related Videos
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            style={{
              display: "flex",
              gap: "8px",
              padding: "4px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1a1a1a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <div
              style={{
                position: "relative",
                width: "168px",
                height: "94px",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={video.thumbnail || "/api/placeholder/168/94"}
                alt={video.title}
                width={168}
                height={94}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                unoptimized
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "500",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                {formatDuration(video.duration)}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#ffffff",
                  lineHeight: "1.3",
                  marginBottom: "4px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {video.title}
              </h4>

              <p
                style={{
                  fontSize: "12px",
                  color: "#cccccc",
                  marginBottom: "2px",
                  fontWeight: "400",
                }}
              >
                {video.user.username}
              </p>

              <div
                style={{
                  fontSize: "12px",
                  color: "#cccccc",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Eye size={12} />
                <span>{formatViewCount(video.viewCount)} views</span>
                <span>•</span>
                <span>{formatTimeAgo(video.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}

        {videos.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              No related videos found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
