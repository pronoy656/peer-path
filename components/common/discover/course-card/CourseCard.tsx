"use client";

import { BookOpen, Check, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getInstructorForCourse, searchCourses } from "@/lib/services/courses";
import type { Course, Department } from "@/lib/types";
import UnifiedCourseCard from "@/components/common/home/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

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
      <EmptyState
        icon={<BookOpen className="w-6 h-6" />}
        title={`No ${department} courses in Semester ${semester}`}
        description="Courses for this department are currently seeded in Semesters 1–4."
        actionLabel={onResetSemester ? "Jump to Semester 1" : undefined}
        onAction={onResetSemester}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {courses.map((course) => {
        const instructor = getInstructorForCourse(state, course);
        const isSelected = selectedCourses.includes(course.id);
        return (
          <UnifiedCourseCard
            key={course.id}
            course={course}
            instructorName={instructor?.name}
            actionSlot={
              <Button
                type="button"
                size="sm"
                variant={isSelected ? "secondary" : "default"}
                onClick={() => onAddCourse?.(course)}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </>
                )}
              </Button>
            }
          />
        );
      })}
    </div>
  );
}
