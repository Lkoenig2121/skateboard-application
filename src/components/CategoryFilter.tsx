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
      className="flex gap-3 overflow-x-auto scrollbar-hide"
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 border cursor-pointer ${
            selectedCategory === category.value
              ? "bg-white text-gray-900 border-white"
              : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
