"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Upload,
  Menu,
  Mic,
  Bell,
  Video,
  User,
  LogOut,
  Settings,
  Home,
  Play,
  Clock,
  ThumbsUp,
  History,
  PlaySquare,
  Flame,
  Music,
  Film,
  Radio,
  Gamepad2,
  Trophy,
  Lightbulb,
} from "lucide-react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onSidebarToggle?: (isOpen: boolean) => void;
}

export default function Header({ onSearch, onSidebarToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/me");
        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();

    // Check screen size and auto-open sidebar on large screens
    const handleResize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      // Only auto-open on very large screens
      if (window.innerWidth >= 1200) {
        setIsSidebarOpen(true);
        onSidebarToggle?.(true);
      } else if (!isLarge && isSidebarOpen) {
        // Close sidebar on mobile if it was open
        setIsSidebarOpen(false);
        onSidebarToggle?.(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, onSidebarToggle]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If onSearch prop is provided, use it (for search page)
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // Otherwise, navigate to search page
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setShowProfileDropdown(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Header - Dark YouTube Theme */}
      <header className="bg-gray-900 sticky top-0 z-50 h-14 px-4 flex items-center">
        {/* Left Section - Menu & Logo (Fixed Width) */}
        <div className="flex items-center w-52 min-w-0">
          <button
            onClick={() => {
              const newState = !isSidebarOpen;
              setIsSidebarOpen(newState);
              onSidebarToggle?.(newState);
            }}
            className="p-2 hover:bg-gray-800 rounded-full mr-4 flex-shrink-0 text-white"
          >
            <Menu size={20} />
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 no-underline min-w-0"
          >
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
              <Video size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white ml-1 hidden sm:block truncate">
              SkateTube
            </span>
          </Link>
        </div>

        {/* Center Section - Search (Flexible) */}
        <div className="flex-1 flex justify-center px-8 hidden md:flex">
          <div className="flex max-w-2xl w-full">
            <form onSubmit={handleSearch} className="flex flex-1 max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 h-10 px-4 text-base border border-gray-600 rounded-l-full bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-16 h-10 border border-gray-600 border-l-0 rounded-r-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center flex-shrink-0"
              >
                <Search size={20} className="text-gray-300" />
              </button>
            </form>
            <button className="ml-2 p-2 hover:bg-gray-800 rounded-full flex-shrink-0">
              <Mic size={20} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Right Section - Actions & Profile (Fixed Width) */}
        <div className="flex items-center gap-1 w-52 justify-end">
          <button className="md:hidden p-2 hover:bg-gray-800 rounded-full text-white">
            <Search size={20} />
          </button>

          <Link
            href="/upload"
            className="p-2 hover:bg-gray-800 rounded-full text-white"
            title="Create"
          >
            <Upload size={20} />
          </Link>

          <button
            className="p-2 hover:bg-gray-800 rounded-full text-white"
            title="Notifications"
          >
            <Bell size={20} />
          </button>

          <div className="relative ml-2">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center"
            >
              <User size={18} className="text-white" />
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white no-underline"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User size={18} />
                      <span>Your profile</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white">
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white"
                    >
                      <LogOut size={18} />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white no-underline"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User size={18} />
                      <span>Sign in</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white no-underline"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Settings size={18} />
                      <span>Sign up</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* YouTube-style Dark Sidebar */}
      <div
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-gray-900 border-r border-gray-700 transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-60" : "w-0"
        } overflow-hidden overflow-y-auto`}
      >
        <div className="py-2 w-60">
          {/* Main Navigation */}
          <div className="px-3">
            <Link
              href="/"
              className="flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white no-underline"
            >
              <Home size={20} />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Play size={20} />
              <span className="text-sm font-medium">Shorts</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <PlaySquare size={20} />
              <span className="text-sm font-medium">Subscriptions</span>
            </button>
          </div>

          <hr className="border-gray-700 my-3" />

          {/* You section */}
          <div className="px-3">
            <div className="px-3 py-2">
              <span className="text-sm font-medium text-white">You</span>
            </div>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <User size={20} />
              <span className="text-sm">Your channel</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <History size={20} />
              <span className="text-sm">History</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <PlaySquare size={20} />
              <span className="text-sm">Your videos</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Clock size={20} />
              <span className="text-sm">Watch later</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <ThumbsUp size={20} />
              <span className="text-sm">Liked videos</span>
            </button>
          </div>

          <hr className="border-gray-700 my-3" />

          {/* Explore section */}
          <div className="px-3">
            <div className="px-3 py-2">
              <span className="text-sm font-medium text-white">Explore</span>
            </div>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Flame size={20} />
              <span className="text-sm">Trending</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Music size={20} />
              <span className="text-sm">Music</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Film size={20} />
              <span className="text-sm">Movies</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Radio size={20} />
              <span className="text-sm">Live</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Gamepad2 size={20} />
              <span className="text-sm">Gaming</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Trophy size={20} />
              <span className="text-sm">Sports</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <Lightbulb size={20} />
              <span className="text-sm">Learning</span>
            </button>
          </div>

          <hr className="border-gray-700 my-3" />

          {/* Subscriptions section */}
          <div className="px-3">
            <div className="px-3 py-2">
              <span className="text-sm font-medium text-white">
                Subscriptions
              </span>
            </div>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="text-sm">The Matt Kohr...</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-sm">Scump</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <span className="text-sm">Dashy</span>
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-gray-800 rounded-lg text-white">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
              <span className="text-sm">OpTic Gaming</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
