"use client";

import { VideoCategory } from "@/types";

interface CategoryFilterProps {
  selectedCategory: VideoCategory | "all";
  onCategoryChange: (category: VideoCategory | "all") => void;
}

const categories: { value: VideoCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "skateboarding", label: "Skateboarding" },
  { value: "biking", label: "Mountain Biking" },
  { value: "bmx", label: "BMX" },
  { value: "longboarding", label: "Longboarding" },
  { value: "scooter", label: "Scooter" },
  { value: "other", label: "Other" },
];

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        paddingBottom: "8px",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category.value;
        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              border: "1px solid transparent",
              cursor: "pointer",
              backgroundColor: isActive ? "#f1f1f1" : "#272727",
              color: isActive ? "#0f0f0f" : "#f1f1f1",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "#3f3f3f";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "#272727";
              }
            }}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
