"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoGrid from "@/components/VideoGrid";
import { Video } from "@/types";

export default function SubscriptionsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>([]);

  useEffect(() => {
    const loadSubscriptions = () => {
      try {
        const subscriptions = localStorage.getItem("subscribedChannels");
        if (subscriptions) {
          const channels = JSON.parse(subscriptions);
          setSubscribedChannels(channels);
        }
      } catch (error) {
        console.error("Error loading subscriptions:", error);
      }
    };

    loadSubscriptions();
  }, []);

  useEffect(() => {
    const fetchSubscriptionVideos = async () => {
      if (subscribedChannels.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // For now, we'll fetch general videos since we don't have channel-specific API
        // In a real app, you'd fetch videos from subscribed channels
        const response = await fetch("/api/youtube?category=all&maxResults=50");
        const data = await response.json();
        
        if (data.videos) {
          setVideos(data.videos);
        } else {
          throw new Error(data.error || "Failed to fetch subscription videos");
        }
      } catch (err) {
        console.error("Error fetching subscription videos:", err);
        setError(err instanceof Error ? err.message : "Failed to load subscription videos");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionVideos();
  }, [subscribedChannels]);

  const subscribeToChannel = (channelName: string) => {
    if (!subscribedChannels.includes(channelName)) {
      const updatedChannels = [...subscribedChannels, channelName];
      setSubscribedChannels(updatedChannels);
      localStorage.setItem("subscribedChannels", JSON.stringify(updatedChannels));
    }
  };

  const unsubscribeFromChannel = (channelName: string) => {
    const updatedChannels = subscribedChannels.filter(channel => channel !== channelName);
    setSubscribedChannels(updatedChannels);
    localStorage.setItem("subscribedChannels", JSON.stringify(updatedChannels));
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
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#ffffff",
              margin: "0 0 8px 0",
            }}
          >
            📺 Subscriptions
          </h1>
          <p
            style={{
              color: "#cccccc",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Latest videos from channels you're subscribed to
          </p>
        </div>

        {/* Subscribed Channels Section */}
        <div
          style={{
            padding: "0 16px 24px",
            borderBottom: "1px solid #303030",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#ffffff",
              margin: "0 0 16px 0",
            }}
          >
            Your Subscriptions ({subscribedChannels.length})
          </h2>
          
          {subscribedChannels.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {subscribedChannels.map((channel) => (
                <div
                  key={channel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1a1a1a",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    border: "1px solid #333333",
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      marginRight: "8px",
                    }}
                  >
                    {channel}
                  </span>
                  <button
                    onClick={() => unsubscribeFromChannel(channel)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ff4444",
                      cursor: "pointer",
                      fontSize: "12px",
                      padding: "2px 4px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                border: "1px solid #333333",
              }}
            >
              <p
                style={{
                  color: "#cccccc",
                  fontSize: "16px",
                  margin: "0 0 16px 0",
                }}
              >
                You're not subscribed to any channels yet
              </p>
              <p
                style={{
                  color: "#999999",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                Subscribe to channels to see their latest videos here
              </p>
            </div>
          )}
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
              Loading subscription videos...
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
              Failed to load subscription videos
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
        {!loading && !error && subscribedChannels.length > 0 && <VideoGrid videos={videos} />}

        {/* Empty State - No Subscriptions */}
        {!loading && !error && subscribedChannels.length === 0 && (
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
              📺
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              No subscriptions yet
            </h2>
            <p
              style={{
                color: "#cccccc",
                fontSize: "16px",
                marginBottom: "24px",
              }}
            >
              Subscribe to channels to see their latest videos here
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
              Discover Channels
            </a>
          </div>
        )}

        {/* Empty State - No Videos from Subscriptions */}
        {!loading && !error && subscribedChannels.length > 0 && videos.length === 0 && (
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
              📺
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              No new videos from your subscriptions
            </h2>
            <p
              style={{
                color: "#cccccc",
                fontSize: "16px",
                marginBottom: "24px",
              }}
            >
              Check back later for new content from your subscribed channels
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