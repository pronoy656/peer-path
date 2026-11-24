"use client";

import { X } from "lucide-react";
import type { Course } from "@/lib/types";

interface CoursePreviewSectionProps {
  courses: Course[];
  onRemoveCourse: (courseId: string) => void;
  onConfirmEnrollment: () => void;
  onSaveForLater: () => void;
}

export default function CoursePreview({
  courses,
  onRemoveCourse,
  onConfirmEnrollment,
  onSaveForLater,
}: CoursePreviewSectionProps) {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const creditLimit = 14;

  return (
    <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground">
            Selected Courses
          </h2>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p
              className={`text-3xl font-bold ${
                totalCredits > creditLimit ? "text-red-600" : "text-primary"
              }`}
            >
              {totalCredits} / {creditLimit}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-card rounded-lg border border-border p-4 flex items-start justify-between"
            >
              <div className="grow">
                <h3 className="font-semibold text-foreground">{course.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {course.code}
                </p>
                <p className="text-sm font-semibold text-primary mt-2">
                  {course.credits} Credits
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${course.title}`}
                onClick={() => onRemoveCourse(course.id)}
                className="ml-4 p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="button"
            onClick={onConfirmEnrollment}
            disabled={totalCredits > creditLimit}
            className={`flex-1 min-w-[200px] px-6 py-3 rounded-lg font-semibold transition-colors duration-300 border-2 border-primary ${
              totalCredits > creditLimit
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
                : "bg-primary text-foreground hover:bg-primary/90"
            }`}
          >
            Confirm Enrollment
          </button>
          <button
            type="button"
            onClick={onSaveForLater}
            className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
          >
            Save for Later
          </button>
        </div>

        {totalCredits > creditLimit && (
          <p className="text-sm text-red-600 font-semibold">
            Please remove courses to stay within the 14 credit limit.
          </p>
        )}
      </div>
    </div>
  );
}
