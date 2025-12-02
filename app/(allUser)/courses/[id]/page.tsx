"use client";

import { useParams } from "next/navigation";

import { useState } from "react";
import { courseDetails } from "./courseDetails";
import CourseHeader from "./CourseHeader";
import CourseHero from "./CourseHero";
import CourseSyllabus from "./CourseSyllabus";
import CourseReviews from "./CourseReviews";
import CourseSidebar from "./CourseSidebar";

export default function CoursePage() {
  const { id } = useParams();
  const course = courseDetails[id as string] || courseDetails["1"];

  const [isSaved, setIsSaved] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = () => {
    setIsEnrolled(true);
    alert("Successfully enrolled! Welcome to the course 🎉");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CourseHeader image={course.image} title={course.title} />

      <main className="flex-1">
        <CourseHero
          course={course}
          isEnrolled={isEnrolled}
          onEnroll={handleEnroll}
          isSaved={isSaved}
          onToggleSave={() => setIsSaved(!isSaved)}
        />

        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-16">
                <CourseSyllabus syllabus={course.syllabus} />
                <CourseReviews
                  courseId={id as string}
                  isEnrolled={isEnrolled}
                />
              </div>

              {/* Right Sidebar */}
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
