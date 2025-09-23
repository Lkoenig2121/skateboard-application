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
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '8px',
        paddingTop: '4px',
        paddingLeft: '2px',
        paddingRight: '2px',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease-in-out',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: selectedCategory === category.value ? '#111827' : '#f3f4f6',
            color: selectedCategory === category.value ? 'white' : '#374151',
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category.value) {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== category.value) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
