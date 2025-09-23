export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  subscriberCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  category: VideoCategory;
  tags: string[];
  userId: string;
  user: User;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Comment {
  id: string;
  content: string;
  videoId: string;
  userId: string;
  user: User;
  parentId?: string;
  replies?: Comment[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  subscribedToId: string;
  createdAt: Date;
}

export interface VideoLike {
  id: string;
  videoId: string;
  userId: string;
  isLike: boolean; // true for like, false for dislike
  createdAt: Date;
}

export type VideoCategory = 'skateboarding' | 'biking' | 'bmx' | 'longboarding' | 'scooter' | 'other';

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}