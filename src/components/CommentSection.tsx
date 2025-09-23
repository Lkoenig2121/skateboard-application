"use client";

import { useState } from "react";
import { Send, ThumbsUp, Reply, User } from "lucide-react";
import { Comment } from "@/types";

interface CommentSectionProps {
  comments: Comment[];
  videoId: string;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
}

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: string) => void;
}

function CommentItem({ comment, onReply }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="yt-comment">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
        {comment.user.username.charAt(0).toUpperCase()}
      </div>

      <div className="yt-comment-content">
        <div className="flex items-center space-x-2 mb-1">
          <span className="yt-comment-author">@{comment.user.username}</span>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        <p className="yt-comment-text">{comment.content}</p>

        <div className="yt-comment-actions">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-1 hover:bg-gray-100 rounded p-2 transition-colors ${
              isLiked ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <ThumbsUp size={16} />
            <span>{comment.likeCount + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center space-x-1 hover:bg-gray-100 rounded p-2 transition-colors"
          >
            <Reply size={16} />
            <span>Reply</span>
          </button>
        </div>

        {showReplyForm && (
          <div className="mt-3">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <textarea
                  placeholder={`Reply to ${comment.user.username}...`}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentSection({
  comments,
  videoId,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Here you would typically send the comment to your API
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setNewComment("");
      setIsSubmitting(false);
      // You would also add the new comment to the comments list
    }, 1000);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {comments.length} Comments
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            U
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border-b border-gray-300 bg-transparent resize-none focus:outline-none focus:border-gray-600"
              rows={1}
            />
            <div className="flex justify-end mt-3 space-x-2">
              <button
                type="button"
                onClick={() => setNewComment("")}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Commenting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
