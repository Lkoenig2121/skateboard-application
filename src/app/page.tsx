"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoGrid from "@/components/VideoGrid";
import CategoryFilter from "@/components/CategoryFilter";
import { Video, VideoCategory } from "@/types";

// Mock data for development
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Epic Skateboard Tricks at Venice Beach",
    description:
      "Amazing skateboard tricks and stunts at the famous Venice Beach skate park.",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "/videos/sample1.mp4",
    duration: 180,
    viewCount: 1250,
    likeCount: 89,
    dislikeCount: 3,
    category: "skateboarding",
    tags: ["skateboarding", "venice beach", "tricks", "street"],
    userId: "1",
    user: {
      id: "1",
      username: "skater_pro",
      email: "skater@example.com",
      subscriberCount: 5420,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Mountain Biking Adventure - Trail Riding",
    description:
      "Thrilling mountain bike ride through challenging trails and beautiful scenery.",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "/videos/sample2.mp4",
    duration: 320,
    viewCount: 892,
    likeCount: 67,
    dislikeCount: 1,
    category: "biking",
    tags: ["mountain biking", "trails", "adventure", "nature"],
    userId: "2",
    user: {
      id: "2",
      username: "trail_rider",
      email: "rider@example.com",
      subscriberCount: 3210,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "BMX Freestyle Competition Highlights",
    description:
      "Best moments from the recent BMX freestyle competition with incredible stunts.",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "/videos/sample3.mp4",
    duration: 240,
    viewCount: 2340,
    likeCount: 156,
    dislikeCount: 8,
    category: "bmx",
    tags: ["bmx", "freestyle", "competition", "stunts"],
    userId: "3",
    user: {
      id: "3",
      username: "bmx_master",
      email: "bmx@example.com",
      subscriberCount: 8750,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Home() {
  const [videos] = useState<Video[]>(mockVideos);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(mockVideos);
  const [selectedCategory, setSelectedCategory] = useState<
    VideoCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filtered = videos;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (video) => video.category === selectedCategory
      );
    }

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
  }, [videos, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />

      <main className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Video Grid */}
        <VideoGrid videos={filteredVideos} />
      </main>
    </div>
  );
}
