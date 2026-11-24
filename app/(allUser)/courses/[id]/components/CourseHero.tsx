import { BookMarked, CheckCircle2, Share2 } from "lucide-react";
import RatingStars from "./RatingStars";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Course, FacultyProfile } from "@/lib/types";

export default function CourseHero({
  course,
  instructor,
  reviewCount,
  isEnrolled,
  onEnroll,
  isSaved,
  onToggleSave,
  onShare,
}: {
  course: Course;
  instructor?: FacultyProfile;
  reviewCount: number;
  isEnrolled: boolean;
  onEnroll: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
}) {
  return (
    <section className="py-12 bg-gradient-to-b from-primary/10 to-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/30">
                {course.code}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                {course.department} • Semester {course.semester}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                {course.credits} Credits
              </span>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                Instructor:{" "}
                <span className="font-semibold text-foreground">
                  {instructor?.name ?? "ULAB Faculty"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <RatingStars
                rating={course.rating}
                reviews={reviewCount}
                size="lg"
              />
              <div className="hidden md:block h-14 w-px bg-border" />
              <div>
                <p className="font-semibold text-lg">
                  {course.seatsTaken} / {course.seatsTotal} seats taken
                </p>
                <p className="text-muted-foreground text-sm">
                  {course.difficulty} • {course.schedule || "Regular Schedule"}
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-foreground/80">
              {course.description}
            </p>
          </div>

          <div>
            <Card className="p-6 sticky top-24 shadow-xl border-2 border-primary/30">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-foreground">
                    Free for ULAB
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Semester Course Registration
                  </p>
                </div>
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {course.credits} Credits
                </span>
              </div>

              <Button
                size="lg"
                className="w-full mb-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={onEnroll}
                disabled={isEnrolled || course.seatsTaken >= course.seatsTotal}
              >
                {isEnrolled ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Enrolled
                  </span>
                ) : course.seatsTaken >= course.seatsTotal ? (
                  "Section Full"
                ) : (
                  "Enroll Now"
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full mb-3"
                onClick={onToggleSave}
              >
                <BookMarked
                  className={`h-5 w-5 mr-2 ${
                    isSaved ? "fill-primary text-primary" : ""
                  }`}
                />
                {isSaved ? "Saved" : "Save Course"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onShare}
              >
                <Share2 className="h-5 w-5 mr-2" /> Share
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
