"use client";

import CourseCardDesign from "../course-card-design/CourseCardDesign";
import { useAppStore } from "@/lib/store/AppStore";
import { getInstructorForCourse, searchCourses } from "@/lib/services/courses";
import type { Course, Department } from "@/lib/types";
import { BookOpen } from "lucide-react";

interface CourseGridProps {
  department: Department;
  semester: string;
  onAddCourse?: (course: Course) => void;
  selectedCourses?: string[];
  onResetSemester?: () => void;
}

export default function CourseCard({
  department,
  semester,
  onAddCourse,
  selectedCourses = [],
  onResetSemester,
}: CourseGridProps) {
  const { state } = useAppStore();
  const semesterNum = Number(semester);
  const courses = searchCourses(state, {
    department,
    semester: Number.isNaN(semesterNum) ? "All" : semesterNum,
  });

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border bg-card/50">
        <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-lg font-semibold text-foreground">
          No {department} courses listed for Semester {semester} yet.
        </p>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Try Semesters 1–4 for {department} or browse the full catalog.
        </p>
        {onResetSemester && (
          <button
            type="button"
            onClick={onResetSemester}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Jump to Semester 1
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course) => {
        const instructor = getInstructorForCourse(state, course);
        return (
          <CourseCardDesign
            key={course.id}
            course={course}
            instructorName={instructor?.name ?? "ULAB Faculty"}
            onAddCourse={onAddCourse}
            isSelected={selectedCourses.includes(course.id)}
          />
        );
      })}
    </div>
  );
}
