/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Share2,
  BookMarked as Bookmarked,
  ArrowLeft,
} from "lucide-react";

const courseDetails: Record<string, any> = {
  "1": {
    title: "Full Stack Web Development",
    instructor: "Sarah Chen",
    rating: 4.8,
    reviews: 342,
    students: 1240,
    difficulty: "Intermediate",
    duration: "12 weeks",
    price: "$99",
    description:
      "Master full stack web development with React, Node.js, and databases. Learn to build production-ready applications.",
    image: "/web-development-coding-classroom.jpg",
    syllabus: [
      "Frontend Fundamentals",
      "Backend Development",
      "Database Design",
      "Deployment & DevOps",
      "Real-world Projects",
    ],
    reviewsList: [
      {
        id: 1,
        author: "Alex Johnson",
        rating: 5,
        title: "Excellent course!",
        text: "Best course I've taken. Sarah explains everything clearly.",
        helpful: 24,
        date: "2 weeks ago",
      },
      {
        id: 2,
        author: "Maria Garcia",
        rating: 4,
        title: "Very comprehensive",
        text: "Great content but a bit fast-paced. Worth it though.",
        helpful: 18,
        date: "1 month ago",
      },
      {
        id: 3,
        author: "David Lee",
        rating: 5,
        title: "Changed my career",
        text: "Got a job right after this course. Highly recommend!",
        helpful: 45,
        date: "2 months ago",
      },
    ],
  },
  "2": {
    title: "Data Science Fundamentals",
    instructor: "Prof. Rajesh Kumar",
    rating: 4.9,
    reviews: 512,
    students: 1820,
    difficulty: "Advanced",
    duration: "14 weeks",
    price: "$129",
    description:
      "Comprehensive data science course covering statistics, machine learning, and real-world applications.",
    image: "/data-science-analytics-dashboard.jpg",
    syllabus: [
      "Statistics Basics",
      "Python for Data Analysis",
      "Machine Learning",
      "Deep Learning",
      "Data Visualization",
    ],
    reviewsList: [
      {
        id: 1,
        author: "Sam Chen",
        rating: 5,
        title: "Outstanding!",
        text: "Rajesh's teaching style is incredible. Very practical.",
        helpful: 32,
        date: "3 weeks ago",
      },
      {
        id: 2,
        author: "Emily Brown",
        rating: 4,
        title: "Great foundation",
        text: "Perfect for beginners in data science. Challenging but doable.",
        helpful: 21,
        date: "1 month ago",
      },
    ],
  },
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = courseDetails[courseId] || courseDetails["1"];

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(course.reviewsList);
  const [isSaved, setIsSaved] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      id: reviews.length + 1,
      author: "Your Name",
      rating,
      title: reviewTitle,
      text: reviewText,
      helpful: 0,
      date: "just now",
    };
    setReviews([newReview, ...reviews]);
    setReviewTitle("");
    setReviewText("");
    setRating(5);
    setShowReviewForm(false);
    alert("Review submitted successfully!");
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    alert("Successfully enrolled! Welcome to the course.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Image Section */}
        <section className="relative h-80 md:h-96 bg-gradient-to-b from-blue-600 to-blue-400 overflow-hidden">
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 rounded-lg hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                    {course.title}
                  </h1>
                  <p className="text-lg text-blue-700 dark:text-blue-300">
                    Instructor: {course.instructor}
                  </p>
                </div>

                {/* Rating Summary */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold text-blue-600">
                      {course.rating}
                    </div>
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(course.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-foreground/60">
                        {course.reviews} reviews
                      </p>
                    </div>
                  </div>

                  <div className="h-16 border-l border-border" />

                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">{course.students}</span>{" "}
                      students
                    </p>
                    <p className="text-foreground/60">
                      {course.difficulty} • {course.duration}
                    </p>
                  </div>
                </div>

                <p className="text-lg text-foreground/70">
                  {course.description}
                </p>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-20 space-y-6 border-2 border-blue-200">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Price</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {course.price}
                    </p>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleEnroll}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? "Already Enrolled" : "Enroll Now"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-2 bg-white dark:bg-gray-800 border-blue-200"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmarked
                      className={`h-4 w-4 ${
                        isSaved ? "fill-blue-600 text-blue-600" : ""
                      }`}
                    />
                    {isSaved ? "Saved" : "Save Course"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-2 bg-white dark:bg-gray-800 border-blue-200"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Syllabus */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">{`What You'll Learn`}</h2>
                  <div className="space-y-3">
                    {course.syllabus.map((topic: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg"
                      >
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          ✓
                        </div>
                        <span className="font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Student Reviews</h2>
                    {isEnrolled && (
                      <Button
                        variant={showReviewForm ? "default" : "outline"}
                        onClick={() => setShowReviewForm(!showReviewForm)}
                      >
                        {showReviewForm ? "Cancel" : "Write Review"}
                      </Button>
                    )}
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <Card className="p-6 mb-8">
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-2">
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-border hover:text-foreground/40"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium block mb-2">
                            Review Title
                          </label>
                          <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Summarize your experience..."
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium block mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your honest experience with this course..."
                            rows={5}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          Submit Review
                        </Button>
                      </form>
                    </Card>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map(
                      (review: {
                        id: React.Key | null | undefined;
                        author:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        rating: number;
                        date:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        title:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        text:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        helpful:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }) => (
                        <Card key={review.id} className="p-6">
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold">
                                    {review.author}
                                  </p>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                    Verified Purchase
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-border"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-foreground/60">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div>
                              <h4 className="font-semibold mb-2">
                                {review.title}
                              </h4>
                              <p className="text-foreground/70">
                                {review.text}
                              </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-4 pt-2 border-t border-border">
                              <button className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                                Helpful ({review.helpful})
                              </button>
                              <button className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                Reply
                              </button>
                            </div>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Instructor</h3>
                    <div className="flex gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                        👨‍🏫
                      </div>
                      <div>
                        <p className="font-medium">{course.instructor}</p>
                        <p className="text-xs text-foreground/60">
                          Expert Instructor
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      View Profile
                    </Button>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Course Details</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-foreground/60">Duration</p>
                        <p className="font-medium">{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Level</p>
                        <p className="font-medium">{course.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Students</p>
                        <p className="font-medium">
                          {course.students.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
