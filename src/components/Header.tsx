"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Upload, Menu, Mic, Bell, Video } from "lucide-react";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header
      style={{
        backgroundColor: "white",
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "56px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "0 16px",
        }}
      >
        {/* Left Section - Menu & Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              padding: "8px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              marginRight: "8px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <Menu size={20} color="#374151" />
          </button>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "#dc2626",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Video size={16} color="white" />
              </div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#111827",
                  marginLeft: "4px",
                }}
              >
                SkateTube
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div
          style={{
            flex: 1,
            maxWidth: "512px",
            margin: "0 16px",
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", width: "100%", maxWidth: "400px" }}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  height: "40px",
                  padding: "0 16px",
                  border: "1px solid #d1d5db",
                  borderRight: "none",
                  borderRadius: "20px 0 0 20px",
                  outline: "none",
                  fontSize: "16px",
                  backgroundColor: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              <button
                type="submit"
                style={{
                  width: "64px",
                  height: "40px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "0 20px 20px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#f9fafb")
                }
              >
                <Search size={20} color="#4b5563" />
              </button>
            </div>
            <button
              type="button"
              style={{
                marginLeft: "8px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <Mic size={20} color="#4b5563" />
            </button>
          </form>
        </div>

        {/* Right Section - Actions & Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="md:hidden"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <Search size={20} color="#4b5563" />
          </button>

          <Link
            href="/upload"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              cursor: "pointer",
            }}
            title="Create"
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <Upload size={20} color="#4b5563" />
          </Link>

          <button
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <Bell size={20} color="#4b5563" />
          </button>

          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#2563eb",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginLeft: "8px",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            <span
              style={{ color: "white", fontSize: "14px", fontWeight: "500" }}
            >
              U
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "16px",
          }}
        >
          <form onSubmit={handleSearch}>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  height: "40px",
                  padding: "0 16px",
                  border: "1px solid #d1d5db",
                  borderRight: "none",
                  borderRadius: "20px 0 0 20px",
                  outline: "none",
                  fontSize: "16px",
                  backgroundColor: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              <button
                type="submit"
                style={{
                  width: "64px",
                  height: "40px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "0 20px 20px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Search size={20} color="#4b5563" />
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
