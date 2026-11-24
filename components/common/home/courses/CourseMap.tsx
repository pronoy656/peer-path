"use client";

import CourseCard from "./CourseCard";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses, getInstructorForCourse } from "@/lib/services/courses";

export default function CourseMap() {
  const { state } = useAppStore();
  const courses = getCourses(state).slice(0, 8);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Explore ULAB Courses
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse verified semester courses, seats, and peer reviews across all 5 departments
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => {
              const instructor = getInstructorForCourse(state, course);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  instructorName={instructor?.name}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
