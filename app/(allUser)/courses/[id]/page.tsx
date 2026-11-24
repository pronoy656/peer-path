"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";
import CourseHeader from "./components/CourseHeader";
import CourseHero from "./components/CourseHero";
import CourseSyllabus from "./components/CourseSyllabus";
import CourseReviews from "./components/CourseReviews";
import CourseSidebar from "./components/CourseSidebar";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getCourseById,
  getCourseMaterials,
  getCourseReviews,
  getInstructorForCourse,
} from "@/lib/services/courses";
import {
  enroll,
  isCourseSaved,
  isEnrolledInCourse,
  toggleSaveCourse,
} from "@/lib/services/enrollment";
import { Card } from "@/components/ui/card";

export default function CoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast, hydrated } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 180);
    return () => clearTimeout(timer);
  }, [id]);

  const course = getCourseById(state, id as string);

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen mt-20 container mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-72 rounded-2xl bg-muted" />
        <div className="h-10 w-1/2 rounded bg-muted" />
        <div className="h-40 rounded-xl bg-muted" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-20">
        <h1 className="text-4xl font-bold mb-3">Course Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The requested course could not be found in the ULAB PeerPath catalog.
        </p>
        <div className="flex gap-3">
          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold"
          >
            Browse All Courses
          </Link>
          <Link
            href="/discover"
            className="px-5 py-2.5 rounded-lg border border-border font-semibold"
          >
            Go to Discover
          </Link>
        </div>
      </div>
    );
  }

  const instructor = getInstructorForCourse(state, course);
  const reviews = getCourseReviews(state, course.id);
  const materials = getCourseMaterials(state, course.id);
  const isEnrolled = isEnrolledInCourse(state, currentUser?.id, course.id);
  const isSaved = isCourseSaved(state, currentUser?.id, course.id);

  const handleEnroll = () => {
    if (!currentUser) {
      showToast("Please sign in to enroll in courses.", "info");
      router.push("/signIn");
      return;
    }
    const res = enroll(state, dispatch, currentUser.id, course.id);
    showToast(res.message, res.ok ? "success" : "info");
  };

  const handleToggleSave = () => {
    const saved = toggleSaveCourse(state, dispatch, currentUser?.id, course.id);
    showToast(
      saved ? `Saved ${course.code} to your list` : `Removed ${course.code} from saved`,
      "info"
    );
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Course link: " + url, "info");
    }
  };

  return (
    <div className="min-h-screen flex flex-col mt-20">
      <CourseHeader image={course.image} title={course.title} />

      <main className="flex-1">
        <CourseHero
          course={course}
          instructor={instructor}
          reviewCount={reviews.length}
          isEnrolled={isEnrolled}
          onEnroll={handleEnroll}
          isSaved={isSaved}
          onToggleSave={handleToggleSave}
          onShare={handleShare}
        />

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-12">
                <CourseSyllabus syllabus={course.syllabus} />

                {/* Course Materials uploaded by Faculty */}
                <div>
                  <h2 className="text-3xl font-bold mb-6">Course Materials</h2>
                  {materials.length === 0 ? (
                    <Card className="p-6 border-dashed text-muted-foreground text-sm">
                      No lecture notes or lab sheets uploaded yet by the instructor.
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {materials.map((mat) => (
                        <Card key={mat.id} className="p-4 flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-primary/15 text-primary shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-semibold text-foreground">
                                {mat.title}
                              </h3>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary font-medium">
                                {mat.type}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {mat.urlOrNote}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <CourseReviews courseId={course.id} />
              </div>

              <div className="lg:col-span-1">
                <CourseSidebar course={course} instructor={instructor} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
