"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoGrid from "@/components/VideoGrid";
import CategoryFilter from "@/components/CategoryFilter";
import { Video, VideoCategory } from "@/types";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    VideoCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch videos from YouTube API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/youtube?category=${selectedCategory}&maxResults=12`
        );
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setError(null);
        }

        setVideos(data.videos || []);
      } catch (err) {
        setError("Failed to fetch videos");
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory]);

  // Filter videos by search query
  useEffect(() => {
    let filtered = videos;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          video.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onSearch={setSearchQuery} onSidebarToggle={setIsSidebarOpen} />

      {/* Category Filter - positioned like YouTube */}
      <div
        className={`sticky top-14 z-30 bg-gray-900 border-b border-gray-700 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : ""
        }`}
      >
        <div className="px-4 lg:px-6 py-3">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      <main
        className={`transition-all duration-300 px-4 lg:px-6 py-6 ${
          isSidebarOpen ? "ml-60" : ""
        }`}
      >
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 text-base">
              Loading awesome{" "}
              {selectedCategory === "all" ? "extreme sports" : selectedCategory}{" "}
              videos...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 bg-red-900 rounded-lg border border-red-700 mx-4">
            <p className="text-red-300 text-base mb-2">⚠️ {error}</p>
            <p className="text-gray-400 text-sm">
              Please configure your YouTube API key in .env.local
            </p>
          </div>
        )}

        {/* Video Grid */}
        {!loading && <VideoGrid videos={filteredVideos} />}
      </main>
    </div>
  );
}
