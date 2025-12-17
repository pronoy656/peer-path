"use client";

import React, { useState } from "react";
import { Review } from "@/lib/FacultyData";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";

interface ReviewSectionProps {
    reviews: Review[];
    facultyId: string;
}

export default function ReviewSection({
    reviews: initialReviews,
    facultyId,
}: ReviewSectionProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const newReview: Review = {
                id: Math.random().toString(36).substr(2, 9),
                studentName: "Current Student", // Mock name
                rating: newRating,
                comment: newComment,
                date: new Date().toISOString().split("T")[0],
            };
            setReviews([newReview, ...reviews]);
            setNewComment("");
            setNewRating(5);
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-yellow-400" />
                Student Reviews ({reviews.length})
            </h3>

            {/* Existing Reviews */}
            <div className="space-y-6 mb-10">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-gray-900">
                                    {review.studentName}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {review.date}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No reviews yet. Be the first to review!
                    </div>
                )}
            </div>

            {/* Add Review Form */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>
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
                                    onClick={() => setNewRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-6 h-6 ${star <= newRating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Experience
                        </label>
                        <textarea
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
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                            {!isSubmitting && <ThumbsUp className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
