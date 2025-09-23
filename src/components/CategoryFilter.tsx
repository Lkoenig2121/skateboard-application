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
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-3 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
            selectedCategory === category.value
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
