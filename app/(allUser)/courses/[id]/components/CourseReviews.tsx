"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import ReviewForm from "./ReviewForm";
import { useAppStore } from "@/lib/store/AppStore";
import { addCourseReview, getCourseReviews } from "@/lib/services/courses";
import { Card } from "@/components/ui/card";

export default function CourseReviews({
  courseId,
}: {
  courseId: string;
}) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const reviews = getCourseReviews(state, courseId);

  const handleNewReview = ({
    rating,
    title,
    text,
  }: {
    rating: number;
    title: string;
    text: string;
  }) => {
    if (!currentUser) {
      showToast("Please sign in to write a review.", "info");
      return;
    }
    addCourseReview(dispatch, {
      courseId,
      authorId: currentUser.id,
      rating,
      title,
      content: text,
    });
    setShowForm(false);
    showToast("Your course review has been published!");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Student Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {reviews.length} verified peer review{reviews.length === 1 ? "" : "s"}
          </p>
        </div>

        {currentUser ? (
          !showForm && (
            <Button onClick={() => setShowForm(true)} size="lg">
              Write a Review
            </Button>
          )
        ) : (
          <Link href="/signIn">
            <Button variant="outline" size="lg">
              Sign In to Review
            </Button>
          </Link>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ReviewForm
            onSubmit={handleNewReview}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {reviews.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <p className="font-semibold text-foreground">No reviews yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Be the first ULAB student to share your experience with this course.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const author = state.users.find((u) => u.id === review.authorId);
            const authorName = author?.name ?? "ULAB Student";
            const replyAuthor = review.reply
              ? state.users.find((u) => u.id === review.reply?.authorId)
              : undefined;
            return (
              <Card key={review.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {authorName[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
                    Verified ULAB Peer
                  </span>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(review.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {review.title && (
                  <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                )}
                <p className="text-foreground/80 leading-relaxed">
                  {review.content}
                </p>

                {review.reply && (
                  <div className="mt-4 rounded-xl bg-muted/60 p-4 border-l-4 border-primary">
                    <p className="text-xs font-semibold text-primary mb-1">
                      Reply from {replyAuthor?.name ?? "Instructor"}
                    </p>
                    <p className="text-sm text-foreground/80">
                      {review.reply.content}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
