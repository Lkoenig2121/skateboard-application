"use client";

import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Upload Video
              </h1>
              <p className="text-gray-600">
                Share your skateboarding and biking content with the community
              </p>
            </div>

            <VideoUpload />
          </div>
        </div>
      </main>
    </div>
  );
}
