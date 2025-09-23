"use client";

import { useState } from "react";
import { Send, ThumbsUp, Reply, User } from "lucide-react";
import { Comment } from "@/types";

interface CommentSectionProps {
  comments: Comment[];
  videoId: string;
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const commentDate = date instanceof Date ? date : new Date(date);
  
  // Check if the date is valid
  if (isNaN(commentDate.getTime())) {
    return "recently";
  }
  
  const diffInMs = now.getTime() - commentDate.getTime();
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
  const [replyText, setReplyText] = useState("");

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        flexShrink: 0
      }}>
        {comment.user.username.charAt(0).toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontWeight: '500', fontSize: '13px', color: '#111827' }}>
            @{comment.user.username}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        <p style={{
          fontSize: '14px',
          color: '#111827',
          lineHeight: '1.4',
          marginBottom: '8px',
          wordBreak: 'break-word'
        }}>
          {comment.content}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setIsLiked(!isLiked)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              color: isLiked ? '#3b82f6' : '#6b7280',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ThumbsUp size={16} />
            <span>{comment.likeCount + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Reply size={16} />
            <span>Reply</span>
          </button>
        </div>

        {showReplyForm && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={16} style={{ color: '#6b7280' }} />
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to @${comment.user.username}...`}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    resize: 'vertical',
                    minHeight: '60px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText("");
                    }}
                    style={{
                      padding: '6px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6b7280',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!replyText.trim()}
                    style={{
                      padding: '6px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'white',
                      backgroundColor: replyText.trim() ? '#3b82f6' : '#9ca3af',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (replyText.trim()) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (replyText.trim()) {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                      }
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '16px', paddingLeft: '16px', borderLeft: '2px solid #f3f4f6' }}>
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
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Here you would typically send the comment to your API
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setNewComment("");
      setIsSubmitting(false);
      setShowCommentForm(false);
      // You would also add the new comment to the comments list
    }, 1000);
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '24px'
      }}>
        {comments.length} Comments
      </h3>

      {/* Add Comment Form */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            flexShrink: 0
          }}>
            U
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setShowCommentForm(true)}
              placeholder="Add a comment..."
              style={{
                width: '100%',
                padding: showCommentForm ? '8px 0' : '4px 0',
                border: 'none',
                borderBottom: showCommentForm ? '2px solid #3b82f6' : '1px solid #d1d5db',
                backgroundColor: 'transparent',
                resize: 'none',
                outline: 'none',
                fontSize: '14px',
                minHeight: showCommentForm ? '60px' : '20px',
                transition: 'all 0.2s'
              }}
              rows={showCommentForm ? 3 : 1}
            />
            {showCommentForm && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setNewComment("");
                    setShowCommentForm(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: newComment.trim() && !isSubmitting ? '#3b82f6' : '#9ca3af',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (newComment.trim() && !isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newComment.trim() && !isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                    }
                  }}
                >
                  {isSubmitting ? "Commenting..." : "Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
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
