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

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
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
    <div className="py-4">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900 mb-3">
        {video.title}
      </h1>

      {/* Video Meta */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center space-x-4 text-gray-600 mb-2 sm:mb-0">
          <div className="flex items-center space-x-1">
            <Eye size={16} />
            <span>{formatViewCount(video.viewCount)} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 transition-colors ${
                isLiked ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <ThumbsUp size={20} />
              <span className="text-sm font-medium">
                {formatViewCount(video.likeCount + (isLiked ? 1 : 0))}
              </span>
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={handleDislike}
              className={`px-4 py-2 hover:bg-gray-200 transition-colors ${
                isDisliked ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <ThumbsDown size={20} />
            </button>
          </div>

          <button
            onClick={handleShare}
            className="yt-button yt-button-secondary"
          >
            <Share size={16} />
            <span>Share</span>
          </button>

          <button className="yt-button yt-button-secondary">
            <Flag size={16} />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-start justify-between py-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {video.user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{video.user.username}</h3>
            <p className="text-sm text-gray-600">
              {formatViewCount(video.user.subscriberCount)} subscribers
            </p>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isSubscribed
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Description */}
      {video.description && (
        <div className="mt-4 p-3 bg-gray-100 rounded-xl">
          <div className="text-sm text-gray-900 whitespace-pre-wrap">
            {showFullDescription ? video.description : truncatedDescription}
          </div>
          {video.description.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-gray-700 hover:text-gray-900 font-medium mt-2 text-sm"
            >
              {showFullDescription ? "Show less" : "...more"}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {video.tags.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag, index) => (
              <span
                key={index}
                className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium"
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
