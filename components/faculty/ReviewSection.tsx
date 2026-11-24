"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { addCourseReview, addFacultyReview } from "@/lib/services/courses";
import { getFacultyReviews } from "@/lib/services/people";

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

  void addCourseReview;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-yellow-500" />
        Student Reviews ({reviews.length})
      </h3>

      <div className="space-y-6 mb-10">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const author = state.users.find((u) => u.id === review.authorId);
            const replyAuthor = review.reply
              ? state.users.find((u) => u.id === review.reply?.authorId)
              : undefined;
            return (
              <div
                key={review.id}
                className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">
                    {author?.name ?? "ULAB Student"}
                  </div>
                  <span className="text-xs text-gray-400">
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
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.content}
                </p>
                {review.reply && (
                  <div className="mt-3 rounded-lg bg-yellow-50/70 border-l-4 border-yellow-400 p-3 text-xs text-gray-700">
                    <span className="font-semibold text-gray-900">
                      {replyAuthor?.name ?? "Faculty"} replied:{" "}
                    </span>
                    {review.reply.content}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>
        {currentUser ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} stars`}
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="faculty-review-text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Experience
              </label>
              <textarea
                id="faculty-review-text"
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this faculty member..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all resize-none bg-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                Submit Review
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-600">
              Sign in with your PeerPath account to share a review.
            </p>
            <Link
              href="/signIn"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg text-sm"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
