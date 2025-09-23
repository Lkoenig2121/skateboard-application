"use client";

import { useState, useRef } from "react";
import { Upload, X, Tag, FileVideo } from "lucide-react";
import { VideoCategory, UploadProgress } from "@/types";

const categories: { value: VideoCategory; label: string }[] = [
  { value: "skateboarding", label: "Skateboarding" },
  { value: "biking", label: "Biking" },
  { value: "bmx", label: "BMX" },
  { value: "longboarding", label: "Longboarding" },
  { value: "scooter", label: "Scooter" },
  { value: "other", label: "Other" },
];

export default function VideoUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: "idle",
  });

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<VideoCategory>("skateboarding");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("video/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);

      // Generate title from filename if empty
      if (!title) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
      }
    } else {
      alert("Please select a video file");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setThumbnail(file);
        const url = URL.createObjectURL(file);
        setThumbnailPreview(url);
      } else {
        alert("Please select an image file");
      }
    }
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      !tags.includes(tagInput.trim()) &&
      tags.length < 10
    ) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setTitle("");
    setDescription("");
    setCategory("skateboarding");
    setTags([]);
    setTagInput("");
    setThumbnail(null);
    setThumbnailPreview(null);
    setUploadProgress({ progress: 0, status: "idle" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return;

    setUploadProgress({ progress: 0, status: "uploading" });

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { progress: 100, status: "processing" };
        }
        return { ...prev, progress: newProgress };
      });
    }, 500);

    // Simulate processing
    setTimeout(() => {
      setUploadProgress({ progress: 100, status: "completed" });
      setTimeout(() => {
        resetForm();
        alert("Video uploaded successfully!");
      }, 2000);
    }, 6000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Video Upload Area */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Video File *
        </label>

        {!selectedFile ? (
          <div
            className={`upload-area ${dragActive ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Upload size={32} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  Drop your video here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports MP4, AVI, MOV files up to 500MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary"
              >
                Choose File
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileVideo size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-ghost p-2"
              >
                <X size={20} />
              </button>
            </div>

            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="w-full max-w-md rounded-lg"
              />
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Video Details */}
      {selectedFile && (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Enter video title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="form-textarea"
              placeholder="Describe your video..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VideoCategory)}
              className="form-select"
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags (max 10)
            </label>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 form-input"
                  placeholder="Add a tag..."
                  disabled={tags.length >= 10}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-primary/60 hover:text-primary transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Custom Thumbnail (optional)
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="btn btn-outline w-full sm:w-auto"
              >
                Choose Thumbnail
              </button>
              {thumbnailPreview && (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress.status !== "idle" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {uploadProgress.status === "uploading" && "Uploading..."}
                  {uploadProgress.status === "processing" && "Processing..."}
                  {uploadProgress.status === "completed" && "Upload completed!"}
                  {uploadProgress.status === "error" && "Upload failed"}
                </span>
                <span>{uploadProgress.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    uploadProgress.status === "error"
                      ? "bg-destructive"
                      : "bg-primary"
                  }`}
                  style={{ width: `${uploadProgress.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline px-6 order-2 sm:order-1"
              disabled={
                uploadProgress.status === "uploading" ||
                uploadProgress.status === "processing"
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !selectedFile ||
                !title.trim() ||
                uploadProgress.status === "uploading" ||
                uploadProgress.status === "processing"
              }
              className="btn btn-primary px-6 order-1 sm:order-2"
            >
              {uploadProgress.status === "uploading" ||
              uploadProgress.status === "processing"
                ? "Uploading..."
                : "Upload Video"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
