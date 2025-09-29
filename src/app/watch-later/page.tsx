"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoGrid from "@/components/VideoGrid";
import { Video } from "@/types";

export default function WatchLaterPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Load watch later videos from localStorage
    const loadWatchLater = () => {
      try {
        const watchLaterData = localStorage.getItem("watchLater");
        if (watchLaterData) {
          const savedVideos = JSON.parse(watchLaterData);
          setVideos(savedVideos);
        }
      } catch (error) {
        console.error("Error loading watch later:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchLater();
  }, []);

  const clearWatchLater = () => {
    localStorage.removeItem("watchLater");
    setVideos([]);
  };

  const removeVideo = (videoId: string) => {
    const updatedVideos = videos.filter(video => video.id !== videoId);
    setVideos(updatedVideos);
    localStorage.setItem("watchLater", JSON.stringify(updatedVideos));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        margin: 0,
        padding: 0,
        width: "100%",
        position: "relative",
      }}
    >
      <Header onSidebarToggle={setIsSidebarOpen} />

      <main
        className="main-content-mobile"
        style={{
          transition: "margin-left 0.3s ease",
          padding: "16px 0",
          marginLeft: isSidebarOpen ? "240px" : "0",
        }}
      >
        {/* Page Header */}
        <div
          style={{
            padding: "24px 16px",
            borderBottom: "1px solid #303030",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#ffffff",
                margin: 0,
              }}
            >
              Watch Later
            </h1>
            {videos.length > 0 && (
              <button
                onClick={clearWatchLater}
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff3333";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff4444";
                }}
              >
                Clear All
              </button>
            )}
          </div>
          <p
            style={{
              color: "#cccccc",
              fontSize: "16px",
              margin: 0,
            }}
          >
            {videos.length > 0
              ? `${videos.length} video${videos.length === 1 ? "" : "s"} saved to watch later`
              : "No videos saved to watch later"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #333333",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#cccccc", fontSize: "16px" }}>
              Loading your watch later list...
            </p>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && <VideoGrid videos={videos} />}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#1a1a1a",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "32px",
              }}
            >
              ⏰
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              No videos in your watch later
            </h2>
            <p
              style={{
                color: "#cccccc",
                fontSize: "16px",
                marginBottom: "24px",
              }}
            >
              Videos you save will appear here
            </p>
            <a
              href="/"
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                display: "inline-block",
              }}
            >
              Discover Videos
            </a>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}