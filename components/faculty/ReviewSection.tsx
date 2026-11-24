"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { addFacultyReview } from "@/lib/services/courses";
import { getFacultyReviews } from "@/lib/services/people";
import { Button } from "@/components/ui/button";

interface ReviewSectionProps {
  facultyId: string;
}

export default function ReviewSection({ facultyId }: ReviewSectionProps) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const reviews = getFacultyReviews(state, facultyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in to submit a faculty review.", "info");
      return;
    }
    if (!newComment.trim()) return;
    addFacultyReview(dispatch, {
      facultyId,
      authorId: currentUser.id,
      rating: newRating,
      content: newComment,
    });
    setNewComment("");
    setNewRating(5);
    showToast("Faculty review submitted!");
  };

  return (
    <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border p-6">
      <h3 className="text-lg font-bold font-display text-foreground mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Student reviews ({reviews.length})
      </h3>

      <div className="space-y-5 mb-8">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const author = state.users.find((u) => u.id === review.authorId);
            const replyAuthor = review.reply
              ? state.users.find((u) => u.id === review.reply?.authorId)
              : undefined;
            return (
              <div
                key={review.id}
                className="border-b border-border last:border-0 pb-5 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm text-foreground">
                    {author?.name ?? "ULAB Student"}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(review.rating)
                          ? "text-accent fill-accent"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {review.content}
                </p>
                {review.reply && (
                  <div className="mt-3 rounded-lg bg-background border-l-4 border-accent p-3 text-xs text-foreground/85">
                    <span className="font-semibold text-foreground">
                      {replyAuthor?.name ?? "Faculty"} replied:{" "}
                    </span>
                    {review.reply.content}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground text-sm py-4">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>

      <div className="bg-background border border-border rounded-xl p-5">
        <h4 className="font-bold font-display text-foreground mb-4">
          Write a review
        </h4>
        {currentUser ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} stars`}
                    onClick={() => setNewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating
                          ? "text-accent fill-accent"
                          : "text-border"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="faculty-review-text"
                className="block text-sm font-medium mb-1.5"
              >
                Your experience
              </label>
              <textarea
                id="faculty-review-text"
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this faculty member..."
                className="w-full p-3 border border-border rounded-lg text-sm resize-none bg-card"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="default">
                <ThumbsUp className="w-4 h-4" />
                Submit review
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              Sign in with your PeerPath account to share a review.
            </p>
            <Link href="/signIn">
              <Button variant="default" size="sm">
                Sign in
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
