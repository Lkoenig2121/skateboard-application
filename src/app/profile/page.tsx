"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import VideoGrid from "@/components/VideoGrid";
import { User, Video } from "@/types";
import {
  Settings,
  Calendar,
  Users,
  Play,
  Eye,
  ThumbsUp,
  Upload,
  Edit,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "about">("videos");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
    
    // Check screen size for responsive behavior
    const handleResize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current user
      const userResponse = await fetch("/api/auth/me");
      const userData = await userResponse.json();
      
      if (!userData.authenticated || !userData.user) {
        router.push("/login");
        return;
      }

      setUser(userData.user);

      // Fetch user's videos (for demo, we'll get skateboarding videos)
      const videosResponse = await fetch(
        "/api/youtube?category=skateboarding&maxResults=12"
      );
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData.videos || []);
      }
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
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
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "24px 16px",
            }}
          >
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
              ></div>
              <p style={{ color: "#cccccc", fontSize: "16px" }}>
                Loading profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "24px 16px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                border: "1px solid #333333",
              }}
            >
              <p
                style={{
                  color: "#ff6b6b",
                  fontSize: "16px",
                  marginBottom: "16px",
                }}
              >
                ⚠️ {error}
              </p>
              <button
                onClick={() => router.push("/")}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
        {/* Profile Header */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: isLargeScreen ? "32px" : "24px",
            marginBottom: "24px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            border: "1px solid #333333",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: isLargeScreen ? "24px" : "16px",
              marginBottom: "24px",
              flexDirection: isLargeScreen ? "row" : "column",
              textAlign: isLargeScreen ? "left" : "center",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: isLargeScreen ? "120px" : "100px",
                height: isLargeScreen ? "120px" : "100px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: isLargeScreen ? "48px" : "40px",
                fontWeight: "bold",
                flexShrink: 0,
                margin: isLargeScreen ? "0" : "0 auto",
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                  justifyContent: isLargeScreen ? "flex-start" : "center",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  style={{
                    fontSize: isLargeScreen ? "28px" : "24px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {user.username}
                </h1>
                {user.role === "admin" && (
                  <span
                    style={{
                      backgroundColor: "#fbbf24",
                      color: "#92400e",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: isLargeScreen ? "16px" : "14px",
                  color: "#cccccc",
                  marginBottom: "16px",
                }}
              >
                {user.email}
              </p>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  gap: isLargeScreen ? "24px" : "16px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  justifyContent: isLargeScreen ? "flex-start" : "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Users size={16} color="#cccccc" />
                  <span style={{ fontSize: "14px", color: "#cccccc" }}>
                    {formatNumber(user.subscriberCount)} subscribers
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Play size={16} color="#cccccc" />
                  <span style={{ fontSize: "14px", color: "#cccccc" }}>
                    {videos.length} videos
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Calendar size={16} color="#cccccc" />
                  <span style={{ fontSize: "14px", color: "#cccccc" }}>
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexShrink: 0,
                flexDirection: isLargeScreen ? "row" : "column",
                width: isLargeScreen ? "auto" : "100%",
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#2a2a2a",
                  color: "#ffffff",
                  border: "1px solid #444444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                  width: isLargeScreen ? "auto" : "100%",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3a3a3a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2a2a2a")
                }
              >
                <Edit size={16} />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#ff6b6b",
                  transition: "background-color 0.2s",
                  width: isLargeScreen ? "auto" : "100%",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3a3a3a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2a2a2a")
                }
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                marginBottom: "24px",
                border: "1px solid #333333",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#cccccc",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {user.bio}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid #333333" }}>
            <div
              style={{
                display: "flex",
                gap: isLargeScreen ? "32px" : "24px",
                overflowX: "auto",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <button
                onClick={() => setActiveTab("videos")}
                style={{
                  padding: "12px 0",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: activeTab === "videos" ? "#3b82f6" : "#cccccc",
                  borderBottom:
                    activeTab === "videos"
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                Videos ({videos.length})
              </button>
              <button
                onClick={() => setActiveTab("about")}
                style={{
                  padding: "12px 0",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: activeTab === "about" ? "#3b82f6" : "#cccccc",
                  borderBottom:
                    activeTab === "about"
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                About
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "videos" && (
          <div>
            {videos.length > 0 ? (
              <VideoGrid videos={videos} />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  backgroundColor: "#1a1a1a",
                  borderRadius: "12px",
                  border: "1px solid #333333",
                }}
              >
                <Upload
                  size={48}
                  color="#cccccc"
                  style={{ margin: "0 auto 16px" }}
                />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  No videos yet
                </h3>
                <p style={{ color: "#cccccc", fontSize: "14px" }}>
                  Start uploading videos to share with the community!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              padding: isLargeScreen ? "32px" : "24px",
              border: "1px solid #333333",
            }}
          >
            <h2
              style={{
                fontSize: isLargeScreen ? "20px" : "18px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "24px",
              }}
            >
              About {user.username}
            </h2>

            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  Description
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#cccccc",
                    lineHeight: "1.5",
                  }}
                >
                  {user.bio || "No description provided."}
                </p>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  Channel Details
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#cccccc",
                  }}
                >
                  <div>Subscribers: {formatNumber(user.subscriberCount)}</div>
                  <div>Total videos: {videos.length}</div>
                  <div>Joined: {formatDate(user.createdAt)}</div>
                  <div>
                    Account type:{" "}
                    {user.role === "admin" ? "Administrator" : "User"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
