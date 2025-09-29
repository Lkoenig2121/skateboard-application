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
        const data = await response.json();
        setIsLoggedIn(data.authenticated === true);
      } catch (error) {
        // Silently handle auth errors - user is just not logged in
        setIsLoggedIn(false);
      }
    };

    // Only check auth status once on mount, not on every render
    checkAuthStatus();

    // Check screen size and auto-open sidebar on large screens
    const handleResize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);

      // Auto-open on very large screens (1200px+), but allow manual toggle
      if (window.innerWidth >= 1200 && !isSidebarOpen) {
        setIsSidebarOpen(true);
        onSidebarToggle?.(true);
      }
      // On smaller screens, close sidebar if it was open
      if (window.innerWidth < 1200 && isSidebarOpen) {
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
      if (onSearch) {
        onSearch(searchQuery);
      } else {
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
      {/* Simple YouTube Header */}
      <header
        style={{
          backgroundColor: "#0f0f0f",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Menu + Logo */}
        <div
          style={{ display: "flex", alignItems: "center", minWidth: "170px" }}
        >
          <button
            onClick={() => {
              const newState = !isSidebarOpen;
              setIsSidebarOpen(newState);
              onSidebarToggle?.(newState);
            }}
            style={{
              background: isSidebarOpen ? "rgba(255,255,255,0.1)" : "none",
              border: "none",
              color: "white",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
              marginRight: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = isSidebarOpen
                ? "rgba(255,255,255,0.1)"
                : "transparent")
            }
          >
            <Menu size={20} />
          </button>

          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "32px",
                  height: "24px",
                  backgroundColor: "#ff0000",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "4px",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid white",
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    marginLeft: "2px",
                  }}
                />
              </div>
              <span
                style={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "400",
                  letterSpacing: "-0.5px",
                }}
              >
                SkateTube
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search */}
        <div
          style={{
            flex: 1,
            maxWidth: "728px",
            display: "flex",
            justifyContent: "center",
            padding: "0 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "640px",
            }}
          >
            <form onSubmit={handleSearch} style={{ display: "flex", flex: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                style={{
                  flex: 1,
                  height: "40px",
                  padding: "0 16px",
                  backgroundColor: "#121212",
                  border: "1px solid #303030",
                  borderRadius: "20px 0 0 20px",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1c62b9")}
                onBlur={(e) => (e.target.style.borderColor = "#303030")}
              />
              <button
                type="submit"
                style={{
                  width: "64px",
                  height: "40px",
                  backgroundColor: "#222222",
                  border: "1px solid #303030",
                  borderLeft: "none",
                  borderRadius: "0 20px 20px 0",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3f3f3f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#222222")
                }
              >
                <Search size={20} />
              </button>
            </form>
            <button
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#222222",
                border: "none",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#222222")
              }
            >
              <Mic size={20} />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: "170px",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Upload size={20} />
          </button>

          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Bell size={20} />
            <div
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "6px",
                height: "6px",
                backgroundColor: "#ff0000",
                borderRadius: "50%",
              }}
            />
          </button>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                width: isLargeScreen ? "32px" : "28px",
                height: isLargeScreen ? "32px" : "28px",
                backgroundColor: isLoggedIn ? "#3ea6ff" : "#333333",
                border: isLargeScreen
                  ? "2px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                fontSize: isLargeScreen ? "14px" : "12px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: isLargeScreen
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 1px 4px rgba(0,0,0,0.2)",
                minWidth: "28px",
                minHeight: "28px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isLoggedIn
                  ? "#2b8ce6"
                  : "#444444")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = isLoggedIn
                  ? "#3ea6ff"
                  : "#333333")
              }
            >
              {isLoggedIn ? "U" : <User size={isLargeScreen ? 16 : 14} />}
            </button>

            {showProfileDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: "8px",
                  width: isLargeScreen ? "250px" : "200px",
                  backgroundColor: "#282828",
                  borderRadius: "8px",
                  boxShadow: isLargeScreen
                    ? "0 4px 32px rgba(0,0,0,0.2)"
                    : "0 2px 16px rgba(0,0,0,0.3)",
                  padding: "8px 0",
                  zIndex: 1000,
                  maxWidth: "90vw",
                }}
              >
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: isLargeScreen ? "12px" : "10px",
                        padding: isLargeScreen ? "8px 16px" : "12px 16px",
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: "transparent",
                        minHeight: isLargeScreen ? "auto" : "44px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User size={isLargeScreen ? 18 : 16} />
                      <span
                        style={{ fontSize: isLargeScreen ? "14px" : "15px" }}
                      >
                        Your profile
                      </span>
                    </Link>
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        margin: "8px 0",
                      }}
                    />
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: isLargeScreen ? "12px" : "10px",
                        padding: isLargeScreen ? "8px 16px" : "12px 16px",
                        color: "white",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        minHeight: isLargeScreen ? "auto" : "44px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <LogOut size={isLargeScreen ? 18 : 16} />
                      <span
                        style={{ fontSize: isLargeScreen ? "14px" : "15px" }}
                      >
                        Sign out
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: isLargeScreen ? "12px" : "10px",
                        padding: isLargeScreen ? "8px 16px" : "12px 16px",
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: "transparent",
                        minHeight: isLargeScreen ? "auto" : "44px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User size={isLargeScreen ? 18 : 16} />
                      <span
                        style={{ fontSize: isLargeScreen ? "14px" : "15px" }}
                      >
                        Sign in
                      </span>
                    </Link>
                    <Link
                      href="/signup"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: isLargeScreen ? "12px" : "10px",
                        padding: isLargeScreen ? "8px 16px" : "12px 16px",
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: "transparent",
                        minHeight: isLargeScreen ? "auto" : "44px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Settings size={isLargeScreen ? 18 : 16} />
                      <span
                        style={{ fontSize: isLargeScreen ? "14px" : "15px" }}
                      >
                        Sign up
                      </span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: "56px",
          left: 0,
          height: "calc(100vh - 56px)",
          width: isSidebarOpen ? "240px" : isLargeScreen ? "72px" : "0",
          backgroundColor: "#0f0f0f",
          borderRight: "1px solid #303030",
          transition: "width 0.3s ease",
          zIndex: 40,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: isSidebarOpen ? "240px" : "72px",
            padding: "12px 0",
            overflowY: "auto",
            height: "100%",
            transition: "width 0.3s ease",
          }}
        >
          {/* Main Navigation */}
          <div
            style={{
              paddingBottom: "12px",
              borderBottom: "1px solid #303030",
              marginBottom: "12px",
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Home size={20} />
              {isSidebarOpen && <span style={{ fontSize: "14px" }}>Home</span>}
            </Link>
            <Link
              href="/shorts"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Play size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Shorts</span>
              )}
            </Link>
            <Link
              href="/subscriptions"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <PlaySquare size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Subscriptions</span>
              )}
            </Link>
          </div>

          {/* You section */}
          <div
            style={{
              paddingBottom: "12px",
              borderBottom: "1px solid #303030",
              marginBottom: "12px",
            }}
          >
            {isSidebarOpen && (
              <div
                style={{
                  padding: "8px 24px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                You
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                cursor: "pointer",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <User size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Your channel</span>
              )}
            </div>
            <Link
              href="/history"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <History size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>History</span>
              )}
            </Link>
            <Link
              href="/watch-later"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Clock size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Watch later</span>
              )}
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                cursor: "pointer",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <ThumbsUp size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Liked videos</span>
              )}
            </div>
          </div>

          {/* Explore section */}
          <div>
            {isSidebarOpen && (
              <div
                style={{
                  padding: "8px 24px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Explore
              </div>
            )}
            <Link
              href="/kickflips"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Flame size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Kickflips</span>
              )}
            </Link>
            <Link
              href="/compilations"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <PlaySquare size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Compilations</span>
              )}
            </Link>
            <Link
              href="/street-skating"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Trophy size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Street Skating</span>
              )}
            </Link>
            <Link
              href="/skate-park"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                textDecoration: "none",
                backgroundColor: "transparent",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Gamepad2 size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Skate Park</span>
              )}
            </Link>
          </div>

          {/* Profile Section */}
          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid #303030",
              marginTop: "12px",
            }}
          >
            {isSidebarOpen && (
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#aaaaaa",
                  padding: "8px 24px 12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Account
              </div>
            )}

            {/* Sign In / Profile */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isSidebarOpen ? "24px" : "0",
                  padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                  color: "white",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  justifyContent: isSidebarOpen ? "flex-start" : "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#1c62b9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  U
                </div>
                {isSidebarOpen && (
                  <span style={{ fontSize: "14px" }}>Your Channel</span>
                )}
              </Link>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isSidebarOpen ? "24px" : "0",
                  padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                  color: "white",
                  cursor: "pointer",
                  justifyContent: isSidebarOpen ? "flex-start" : "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push("/login");
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#333333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  <User size={16} />
                </div>
                {isSidebarOpen && (
                  <span style={{ fontSize: "14px" }}>Sign In</span>
                )}
              </div>
            )}

            {/* Settings */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSidebarOpen ? "24px" : "0",
                padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                color: "white",
                cursor: "pointer",
                justifyContent: isSidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Settings size={20} />
              {isSidebarOpen && (
                <span style={{ fontSize: "14px" }}>Settings</span>
              )}
            </div>

            {/* Logout (only if logged in) */}
            {isLoggedIn && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isSidebarOpen ? "24px" : "0",
                  padding: isSidebarOpen ? "8px 24px" : "8px 16px",
                  color: "white",
                  cursor: "pointer",
                  justifyContent: isSidebarOpen ? "flex-start" : "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                onClick={async () => {
                  try {
                    await fetch("/api/auth/logout", { method: "POST" });
                    setIsLoggedIn(false);
                    setIsSidebarOpen(false);
                    router.push("/");
                  } catch (error) {
                    console.error("Logout failed:", error);
                  }
                }}
              >
                <LogOut size={20} />
                {isSidebarOpen && (
                  <span style={{ fontSize: "14px" }}>Sign Out</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && !isLargeScreen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 30,
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
