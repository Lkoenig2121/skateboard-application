"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoGrid from "@/components/VideoGrid";
import { Video } from "@/types";

export default function MusicPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchMusicVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/youtube?category=music&maxResults=50");
        const data = await response.json();
        
        if (data.videos) {
          setVideos(data.videos);
        } else {
          throw new Error(data.error || "Failed to fetch music videos");
        }
      } catch (err) {
        console.error("Error fetching music videos:", err);
        setError(err instanceof Error ? err.message : "Failed to load music videos");
      } finally {
        setLoading(false);
      }
    };

    fetchMusicVideos();
  }, []);

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
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#ffffff",
              margin: "0 0 8px 0",
            }}
          >
            🎵 Music
          </h1>
          <p
            style={{
              color: "#cccccc",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Discover the latest music videos and tracks
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
              Loading music videos...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
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
              ⚠️
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Failed to load music videos
            </h2>
            <p
              style={{
                color: "#cccccc",
                fontSize: "16px",
                marginBottom: "24px",
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && <VideoGrid videos={videos} />}

        {/* Empty State */}
        {!loading && !error && videos.length === 0 && (
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
              🎶
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              No music videos found
            </h2>
            <p
              style={{
                color: "#cccccc",
                fontSize: "16px",
                marginBottom: "24px",
              }}
            >
              Check back later for new music content
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
              Browse All Videos
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