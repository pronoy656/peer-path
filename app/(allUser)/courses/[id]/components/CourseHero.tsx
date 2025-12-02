/* eslint-disable @typescript-eslint/no-explicit-any */

import { BookMarked, Share2 } from "lucide-react";
import RatingStars from "./RatingStars";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function CourseHero({
  course,
  isEnrolled,
  onEnroll,
  isSaved,
  onToggleSave,
}: any) {
  const safe = {
    title: course.title || "Loading...",
    instructor: course.instructor || "Unknown",
    rating: course.rating ?? 0,
    reviews: course.reviews ?? 0,
    students: course.students ?? 0,
    difficulty: course.difficulty || "All Levels",
    duration: course.duration || "Self-paced",
    price: course.price || "$99",
    description: course.description || "Description coming soon.",
  };

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100 mb-3">
                {safe.title}
              </h1>
              <p className="text-xl text-blue-700 dark:text-blue-300">
                by <span className="font-semibold">{safe.instructor}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <RatingStars
                rating={safe.rating}
                reviews={safe.reviews}
                size="lg"
              />
              <div className="hidden md:block h-16 w-px bg-border" />
              <div>
                <p className="font-semibold text-lg">
                  {Number(safe.students).toLocaleString()} students
                </p>
                <p className="text-muted-foreground">
                  {safe.difficulty} • {safe.duration}
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-foreground/80">
              {safe.description}
            </p>
          </div>

          <div>
            <Card className="p-6 sticky top-24 shadow-xl border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {safe.price}
              </div>
              <Button
                size="lg"
                className="w-full mb-3"
                onClick={onEnroll}
                disabled={isEnrolled}
              >
                {isEnrolled ? "Enrolled" : "Enroll Now"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full mb-3"
                onClick={onToggleSave}
              >
                <BookMarked
                  className={`h-5 w-5 mr-2 ${
                    isSaved ? "fill-blue-600 text-blue-600" : ""
                  }`}
                />
                {isSaved ? "Saved" : "Save Course"}
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Share2 className="h-5 w-5 mr-2" /> Share
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
