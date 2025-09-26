"use client";

import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Flag,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { Video } from "@/types";

interface VideoInfoProps {
  video: Video;
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function formatDate(date: Date | string): string {
  const videoDate = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(videoDate.getTime())) {
    return "Date unavailable";
  }

  return videoDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could show a toast notification here
  };

  const truncatedDescription =
    video.description && video.description.length > 200
      ? video.description.substring(0, 200) + "..."
      : video.description;

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Title */}
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#ffffff",
          marginBottom: "12px",
          lineHeight: "1.3",
        }}
      >
        {video.title}
      </h1>

      {/* Video Meta and Actions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#cccccc",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "14px",
            }}
          >
            <Eye size={16} />
            <span>{formatViewCount(video.viewCount)} views</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "14px",
            }}
          >
            <Calendar size={16} />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2a2a2a",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={handleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: isLiked ? "#3b82f6" : "#ffffff",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3a3a3a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <ThumbsUp size={20} />
              <span>
                {formatViewCount(video.likeCount + (isLiked ? 1 : 0))}
              </span>
            </button>
            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "#d1d5db",
              }}
            ></div>
            <button
              onClick={handleDislike}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: isDisliked ? "#3b82f6" : "#374151",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3a3a3a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <ThumbsDown size={20} />
            </button>
          </div>

          <button
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#2a2a2a",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e5e7eb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2a2a2a")
            }
          >
            <Share size={16} />
            <span>Share</span>
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#2a2a2a",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e5e7eb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2a2a2a")
            }
          >
            <Flag size={16} />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Channel Info */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "16px 0",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          {video.user.avatar ? (
            <img
              src={video.user.avatar}
              alt={video.user.username}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {video.user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3
              style={{
                fontWeight: "500",
                color: "#111827",
                marginBottom: "2px",
              }}
            >
              {video.user.username}
            </h3>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              {formatViewCount(video.user.subscriberCount)} subscribers
            </p>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          style={{
            padding: "10px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "500",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
            backgroundColor: isSubscribed ? "#f3f4f6" : "#111827",
            color: isSubscribed ? "#374151" : "white",
          }}
          onMouseEnter={(e) => {
            if (isSubscribed) {
              e.currentTarget.style.backgroundColor = "#e5e7eb";
            } else {
              e.currentTarget.style.backgroundColor = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (isSubscribed) {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            } else {
              e.currentTarget.style.backgroundColor = "#111827";
            }
          }}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Description */}
      {video.description && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#111827",
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
            }}
          >
            {showFullDescription ? video.description : truncatedDescription}
          </div>
          {video.description.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              style={{
                color: "#ffffff",
                fontWeight: "500",
                marginTop: "8px",
                fontSize: "14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
            >
              {showFullDescription ? "Show less" : "...more"}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {video.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  color: "#3b82f6",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1d4ed8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3b82f6")}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
