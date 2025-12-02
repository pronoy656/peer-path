"use client";

import { useParams } from "next/navigation";
import { courseDetails } from "./data/courseDetails";
import CourseHeader from "./components/CourseHeader";
import CourseHero from "./components/CourseHero";
import CourseSyllabus from "./components/CourseSyllabus";
import CourseReviews from "./components/CourseReviews";
import CourseSidebar from "./components/CourseSidebar";
import { useState } from "react";

const fallbackCourse = {
  title: "Course Not Found",
  instructor: "Unknown Instructor",
  rating: 0,
  reviews: 0,
  students: 0,
  difficulty: "Unknown",
  duration: "Unknown",
  price: "N/A",
  description: "This course does not exist.",
  image: "/placeholder.svg",
  syllabus: [],
  reviewsList: [],
};

export default function CoursePage() {
  const { id } = useParams();
  const course = courseDetails[id as string] || fallbackCourse;

  const [isSaved, setIsSaved] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <CourseHeader image={course.image} title={course.title} />

      <main className="flex-1">
        <CourseHero
          course={course}
          isEnrolled={isEnrolled}
          onEnroll={() => {
            setIsEnrolled(true);
            alert("Enrolled successfully!");
          }}
          isSaved={isSaved}
          onToggleSave={() => setIsSaved(!isSaved)}
        />

        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-16">
                <CourseSyllabus syllabus={course.syllabus} />
                <CourseReviews
                  courseId={id as string}
                  isEnrolled={isEnrolled}
                />
              </div>
              <div className="lg:col-span-1">
                <CourseSidebar course={course} instructor={course.instructor} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
