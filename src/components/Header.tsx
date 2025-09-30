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
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const router = useRouter();

  // Mock notification data
  const notifications = [
    {
      id: 1,
      type: "new_video",
      title: "New video from Tony Hawk",
      message: "Check out my latest skateboarding tricks!",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "like",
      title: "Your video got a like",
      message: "Skateboard Tricks Compilation received 5 new likes",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "comment",
      title: "New comment on your video",
      message: "Amazing tricks! Keep it up!",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "subscription",
      title: "New subscriber",
      message: "SkateboardPro subscribed to your channel",
      time: "1 day ago",
      read: true,
    },
  ];

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
    };

    // Auto-open on very large screens (1200px+) only on initial load
    if (window.innerWidth >= 1200) {
      setIsSidebarOpen(true);
      onSidebarToggle?.(true);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onSidebarToggle]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setShowProfileDropdown(false);
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: isLargeScreen ? "170px" : "120px",
          }}
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
              padding: isLargeScreen ? "8px" : "6px",
              borderRadius: "50%",
              cursor: "pointer",
              marginRight: isLargeScreen ? "16px" : "8px",
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
                  width: isLargeScreen ? "32px" : "24px",
                  height: isLargeScreen ? "24px" : "18px",
                  backgroundColor: "#ff0000",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: isLargeScreen ? "4px" : "3px",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: isLargeScreen
                      ? "8px solid white"
                      : "6px solid white",
                    borderTop: isLargeScreen
                      ? "5px solid transparent"
                      : "4px solid transparent",
                    borderBottom: isLargeScreen
                      ? "5px solid transparent"
                      : "4px solid transparent",
                    marginLeft: isLargeScreen ? "2px" : "1px",
                  }}
                />
              </div>
              <span
                style={{
                  color: "white",
                  fontSize: isLargeScreen ? "20px" : "16px",
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
            flex: isLargeScreen ? 1 : 0,
            maxWidth: isLargeScreen ? "728px" : "80px",
            display: "flex",
            justifyContent: "center",
            padding: isLargeScreen ? "0 40px" : "0 2px",
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
                  height: isLargeScreen ? "40px" : "28px",
                  padding: isLargeScreen ? "0 16px" : "0 8px",
                  backgroundColor: "#121212",
                  border: "1px solid #303030",
                  borderRadius: isLargeScreen ? "20px 0 0 20px" : "14px",
                  color: "white",
                  fontSize: isLargeScreen ? "16px" : "12px",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1c62b9")}
                onBlur={(e) => (e.target.style.borderColor = "#303030")}
              />
              {isLargeScreen && (
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
              )}
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
                display: isLargeScreen ? "flex" : "none",
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
            width: isLargeScreen ? "auto" : "80px",
            minWidth: isLargeScreen ? "170px" : "80px",
            justifyContent: "flex-end",
            flexShrink: 0,
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
              display: isLargeScreen ? "flex" : "none",
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

          <div style={{ position: "relative" }} data-dropdown>
            <button
              onClick={() =>
                setShowNotificationsDropdown(!showNotificationsDropdown)
              }
              style={{
                background: showNotificationsDropdown
                  ? "rgba(255,255,255,0.1)"
                  : "none",
                border: "none",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                cursor: "pointer",
                marginRight: "8px",
                display: isLargeScreen ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  showNotificationsDropdown
                    ? "rgba(255,255,255,0.1)"
                    : "transparent")
              }
            >
              <Bell size={20} />
              {notifications.some((n) => !n.read) && (
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
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  width: isLargeScreen ? "400px" : "320px",
                  maxWidth: "90vw",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333333",
                  borderRadius: "12px",
                  boxShadow: isLargeScreen
                    ? "0 4px 32px rgba(0,0,0,0.2)"
                    : "0 2px 16px rgba(0,0,0,0.3)",
                  zIndex: 60,
                  marginTop: "8px",
                  maxHeight: "500px",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #333333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                    }}
                  >
                    Notifications
                  </h3>
                  <button
                    onClick={() => setShowNotificationsDropdown(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#cccccc",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#333333")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    ✕
                  </button>
                </div>

                {/* Notifications List */}
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        style={{
                          padding: "16px 20px",
                          borderBottom: "1px solid #2a2a2a",
                          backgroundColor: notification.read
                            ? "transparent"
                            : "#1a1a1a",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2a2a2a")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            notification.read ? "transparent" : "#1a1a1a")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              backgroundColor: notification.read
                                ? "transparent"
                                : "#3b82f6",
                              borderRadius: "50%",
                              marginTop: "6px",
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4
                              style={{
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: "500",
                                margin: "0 0 4px 0",
                                lineHeight: "1.4",
                              }}
                            >
                              {notification.title}
                            </h4>
                            <p
                              style={{
                                color: "#cccccc",
                                fontSize: "13px",
                                margin: "0 0 4px 0",
                                lineHeight: "1.4",
                              }}
                            >
                              {notification.message}
                            </p>
                            <span
                              style={{
                                color: "#999999",
                                fontSize: "12px",
                              }}
                            >
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "32px 20px",
                        textAlign: "center",
                        color: "#cccccc",
                      }}
                    >
                      <Bell
                        size={32}
                        style={{ marginBottom: "12px", opacity: 0.5 }}
                      />
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        No notifications yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div
                    style={{
                      padding: "12px 20px",
                      borderTop: "1px solid #333333",
                      textAlign: "center",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3b82f6",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            data-dropdown
          >
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: isLoggedIn ? "#3ea6ff" : "#333333",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                minWidth: "32px",
                minHeight: "32px",
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
              {isLoggedIn ? "U" : <User size={16} />}
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
