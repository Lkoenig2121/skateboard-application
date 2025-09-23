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

  // Fetch videos from YouTube API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/youtube?category=${selectedCategory}&maxResults=12`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setError(null);
        }
        
        setVideos(data.videos || []);
      } catch (err) {
        setError('Failed to fetch videos');
        console.error('Error fetching videos:', err);
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
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
        {/* Category Filter */}
        <div className="mb-8 lg:mb-10">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f4f6', 
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading awesome {selectedCategory === 'all' ? 'extreme sports' : selectedCategory} videos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 0',
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            margin: '16px 0'
          }}>
            <p style={{ color: '#dc2626', fontSize: '16px', marginBottom: '8px' }}>
              ⚠️ {error}
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
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
