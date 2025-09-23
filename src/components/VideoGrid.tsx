"use client";

import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/types";

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setColumns(4); // Large desktop: 4 columns
      } else if (width >= 1024) {
        setColumns(3); // Desktop: 3 columns
      } else if (width >= 768) {
        setColumns(2); // Tablet: 2 columns
      } else {
        setColumns(1); // Mobile: 1 column
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  if (videos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <p style={{ color: "#6b7280", fontSize: "18px", marginBottom: "16px" }}>
          No videos found
        </p>
        <p style={{ color: "#9ca3af" }}>
          Try adjusting your search or category filter
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: columns === 1 ? "16px" : columns === 2 ? "20px" : "24px",
        width: "100%",
      }}
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
