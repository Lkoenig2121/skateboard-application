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
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
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
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Header />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}
        >
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f4f6",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            ></div>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Header />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "#fef2f2",
              borderRadius: "12px",
              border: "1px solid #fecaca",
            }}
          >
            <p
              style={{
                color: "#dc2626",
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
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Header />

      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}
      >
        {/* Profile Header */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "48px",
                fontWeight: "bold",
                flexShrink: 0,
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
                }}
              >
                <h1
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#111827",
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
                  fontSize: "16px",
                  color: "#6b7280",
                  marginBottom: "16px",
                }}
              >
                {user.email}
              </p>

              {/* Stats */}
              <div
                style={{ display: "flex", gap: "24px", marginBottom: "16px" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Users size={16} color="#6b7280" />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {formatNumber(user.subscriberCount)} subscribers
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Play size={16} color="#6b7280" />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {videos.length} videos
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Calendar size={16} color="#6b7280" />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e5e7eb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
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
                  backgroundColor: "#fef2f2",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#dc2626",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fee2e2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fef2f2")
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
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {user.bio}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", gap: "32px" }}>
              <button
                onClick={() => setActiveTab("videos")}
                style={{
                  padding: "12px 0",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: activeTab === "videos" ? "#3b82f6" : "#6b7280",
                  borderBottom:
                    activeTab === "videos"
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                  transition: "color 0.2s",
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
                  color: activeTab === "about" ? "#3b82f6" : "#6b7280",
                  borderBottom:
                    activeTab === "about"
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                  transition: "color 0.2s",
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
                  backgroundColor: "white",
                  borderRadius: "12px",
                }}
              >
                <Upload
                  size={48}
                  color="#9ca3af"
                  style={{ margin: "0 auto 16px" }}
                />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  No videos yet
                </h3>
                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  Start uploading videos to share with the community!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#111827",
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
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Description
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
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
                    color: "#374151",
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
                    color: "#6b7280",
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
      </main>
    </div>
  );
}
