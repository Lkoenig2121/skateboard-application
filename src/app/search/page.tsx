"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import VideoGrid from "@/components/VideoGrid";
import { Video } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [channelMatches, setChannelMatches] = useState(0);

  useEffect(() => {
    if (query) {
      searchVideos(query);
    }
  }, [query]);

  const searchVideos = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&maxResults=20`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search videos');
      }

      setVideos(data.videos);
      setTotalResults(data.totalResults);
      setChannelMatches(data.channelMatches || 0);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery);
      window.history.pushState({}, '', url);
      searchVideos(searchQuery);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Results Header */}
        <div className="mb-6">
          {query && (
            <div className="mb-4">
              <h1 className="text-xl font-normal text-gray-900 mb-2">
                Search results for "{query}"
              </h1>
              {!loading && totalResults > 0 && (
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    About {formatNumber(totalResults)} results
                  </p>
                  {channelMatches > 0 && (
                    <p className="text-xs text-purple-600">
                      Including videos from {channelMatches} matching channel{channelMatches > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {!query && (
            <div className="text-center py-12">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Search SkateTube
              </h1>
              <p className="text-base text-gray-600">
                Find skateboarding videos, tutorials, and more
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-base">
              Searching for "{query}"...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 px-6 bg-red-50 rounded-xl border border-red-200 my-4">
            <p className="text-red-600 text-base mb-2">
              ⚠️ {error}
            </p>
            <p className="text-gray-600 text-sm">
              Please try a different search term or check your connection
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && videos.length === 0 && (
          <div className="text-center py-12 px-6 bg-white rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              No results found for "{query}"
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Try different keywords or check your spelling
            </p>
            <div className="text-sm text-gray-600">
              <p>Search suggestions:</p>
              <ul className="list-none p-0 mt-2 space-y-1">
                <li>• Use broader terms like "skateboard" or "tricks"</li>
                <li>• Try "BMX", "longboard", or "scooter"</li>
                <li>• Search for specific channels or usernames</li>
                <li>• Check for typos in your search</li>
              </ul>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && videos.length > 0 && (
          <VideoGrid videos={videos} />
        )}
      </main>
    </div>
  );
}