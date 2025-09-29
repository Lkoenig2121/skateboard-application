"use client";

import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/types";

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // More aggressive mobile breakpoint for better mobile experience
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (videos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <p style={{ color: "#cccccc", fontSize: "18px", marginBottom: "16px" }}>
          No videos found
        </p>
        <p style={{ color: "#999999" }}>
          Try adjusting your search or category filter
        </p>
      </div>
    );
  }

  // Responsive grid configuration
  const getGridConfig = () => {
    if (isLargeScreen) {
      // Desktop: 4-5 columns with larger cards
      return {
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
        padding: "0 8px",
      };
    } else {
      // Mobile: Single column that takes full width
      return {
        gridTemplateColumns: "1fr",
        gap: "8px",
        padding: "0 16px",
        maxWidth: "100%",
        width: "100%",
        boxSizing: "border-box",
      };
    }
  };

  return (
    <div
      className="video-grid-mobile"
      style={{
        display: "grid",
        width: "100%",
        maxWidth: "100%",
        ...getGridConfig(),
      }}
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} isLargeScreen={isLargeScreen} />
      ))}
    </div>
  );
}
