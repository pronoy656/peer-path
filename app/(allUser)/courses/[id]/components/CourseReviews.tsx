/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { courseDetails } from "../data/courseDetails";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";



export default function CourseReviews({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const [reviews, setReviews] = useState(
    courseDetails[courseId]?.reviewsList || []
  );
  const [showForm, setShowForm] = useState(false);

  const handleNewReview = ({ rating, title, text }: any) => {
    const newReview = {
      id: Date.now(),
      author: "You",
      rating,
      title,
      text,
      helpful: 0,
      date: "just now",
    };
    setReviews([newReview, ...reviews]);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Student Reviews</h2>
        {isEnrolled && !showForm && (
          <Button onClick={() => setShowForm(true)} size="lg">
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          onSubmit={handleNewReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-6">
        {reviews.map((review: any) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
