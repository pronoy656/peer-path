"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses, getInstructorForCourse } from "@/lib/services/courses";
import UnifiedCourseCard from "./CourseCard";

export default function CourseMap() {
  const { state } = useAppStore();
  const courses = getCourses(state).slice(0, 4);

  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Course catalog
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Popular ULAB courses this semester
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Compare credit loads, seat availability, and verified senior
              ratings before advising.
            </p>
          </div>
          <Link href="/courses" className="shrink-0">
            <Button variant="outline" size="md">
              View all courses
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => {
            const instructor = getInstructorForCourse(state, course);
            return (
              <UnifiedCourseCard
                key={course.id}
                course={course}
                instructorName={instructor?.name}
                actionSlot={
                  <Link
                    href={`/courses/${course.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    Details →
                  </Link>
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
