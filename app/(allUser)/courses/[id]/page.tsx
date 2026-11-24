"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookMarked,
  CheckCircle2,
  FileText,
  Share2,
  Star,
} from "lucide-react";
import CourseSyllabus from "./components/CourseSyllabus";
import CourseReviews from "./components/CourseReviews";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CardSkeleton } from "@/components/ui/skeleton";

export default function CoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast, hydrated } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timer);
  }, [id]);

  const course = getCourseById(state, id as string);

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-20 bg-background">
        <h1 className="text-3xl font-bold font-display mb-2">
          Course not found
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md text-sm">
          This course could not be found in the ULAB PeerPath catalog.
        </p>
        <div className="flex gap-3">
          <Link href="/courses">
            <Button variant="default">Browse courses</Button>
          </Link>
          <Link href="/discover">
            <Button variant="outline">Open Discover</Button>
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
  const seatsPct = Math.min(
    100,
    Math.round((course.seatsTaken / Math.max(1, course.seatsTotal)) * 100)
  );
  const seatsLeft = Math.max(0, course.seatsTotal - course.seatsTaken);

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
      saved
        ? `Saved ${course.code} to your list`
        : `Removed ${course.code} from saved`,
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
    <div className="min-h-screen bg-background pt-16 pb-20">
      {/* Top Breadcrumb + Hero Band */}
      <section className="bg-card border-b border-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Column Header + Body */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border bg-muted">
                {!imgError && course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    onError={() => setImgError(true)}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary">
                    <span className="font-display font-bold text-3xl">
                      {course.code}
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {course.department}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge department={course.department}>
                    {course.department}
                  </Badge>
                  <Badge variant="neutral">{course.code}</Badge>
                  <Badge variant="neutral">Semester {course.semester}</Badge>
                  <Badge variant="neutral">{course.difficulty}</Badge>
                  {isEnrolled && <Badge variant="enrolled">Enrolled</Badge>}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
                  {course.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    {course.rating > 0 ? course.rating.toFixed(1) : "New"} (
                    {reviews.length} review{reviews.length === 1 ? "" : "s"})
                  </span>
                  <span>·</span>
                  <span>{course.schedule || "Regular ULAB slot"}</span>
                </div>
              </div>
            </div>

            {/* Sticky Conversion Sidebar Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <Card className="p-6 gap-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Semester registration
                    </p>
                    <p className="text-xl font-bold font-display text-foreground mt-0.5">
                      Free for ULAB
                    </p>
                  </div>
                  <Badge variant="saved">{course.credits} credits</Badge>
                </div>

                {/* Seats left progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Seats filled</span>
                    <span className="text-foreground font-semibold">
                      {course.seatsTaken} / {course.seatsTotal} ({seatsLeft}{" "}
                      left)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${seatsPct}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Button
                    type="button"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    onClick={handleEnroll}
                    disabled={isEnrolled || seatsLeft === 0}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Enrolled
                      </>
                    ) : seatsLeft === 0 ? (
                      "Section full"
                    ) : (
                      "Enroll in this course"
                    )}
                  </Button>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={handleToggleSave}
                    >
                      <BookMarked
                        className={`w-4 h-4 ${
                          isSaved ? "fill-primary text-primary" : ""
                        }`}
                      />
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Instructor mini-card */}
                <div className="pt-4 border-t border-border space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Instructor
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={instructor?.avatar}
                      name={instructor?.name ?? "ULAB Faculty"}
                      size="md"
                      department={course.department}
                      avatarColor={instructor?.avatarColor}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {instructor?.name ?? "ULAB Faculty"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {instructor?.title ?? "Faculty"} · {course.department}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={instructor ? `/faculty/${instructor.id}` : "/faculty"}
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View faculty profile
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="lg:max-w-[65%] space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold font-display text-foreground">
              About this course
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </div>

          <CourseSyllabus syllabus={course.syllabus} />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-foreground">
              Course materials
            </h2>
            {materials.length === 0 ? (
              <Card className="p-6 border-dashed text-sm text-muted-foreground">
                No lecture slides or lab sheets uploaded yet by the instructor.
              </Card>
            ) : (
              <div className="space-y-3">
                {materials.map((mat) => (
                  <Card
                    key={mat.id}
                    className="p-4 flex flex-row items-start gap-4"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-foreground">
                          {mat.title}
                        </h3>
                        <Badge variant="neutral">{mat.type}</Badge>
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
      </section>
    </div>
  );
}
