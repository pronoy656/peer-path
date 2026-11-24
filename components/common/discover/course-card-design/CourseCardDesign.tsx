"use client";

import Link from "next/link";
import { Check, Heart, Plus } from "lucide-react";
import type { Course } from "@/lib/types";
import { useAppStore } from "@/lib/store/AppStore";
import { isCourseSaved, toggleSaveCourse } from "@/lib/services/enrollment";

interface CourseCardDesignProps {
  course: Course;
  instructorName: string;
  onAddCourse?: (course: Course) => void;
  isSelected?: boolean;
}

export default function CourseCardDesign({
  course,
  instructorName,
  onAddCourse,
  isSelected = false,
}: CourseCardDesignProps) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const isFavorite = isCourseSaved(state, currentUser?.id, course.id);

  const difficultyColors = {
    Beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Intermediate: "bg-blue-50 text-blue-700 border border-blue-200",
    Advanced: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  const handleToggleSave = () => {
    const saved = toggleSaveCourse(state, dispatch, currentUser?.id, course.id);
    showToast(
      saved ? `Saved ${course.code} to your list` : `Removed ${course.code} from saved`,
      "info"
    );
  };

  return (
    <div
      className={`group relative bg-card rounded-xl border-2 border-primary/30 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative p-6 space-y-3 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
            {course.code}
          </span>
          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={isFavorite ? "Remove from saved courses" : "Save course"}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        <h3 className="text-lg font-bold text-foreground leading-tight">
          {course.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        <div
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full w-fit ${
            difficultyColors[course.difficulty]
          }`}
        >
          {course.difficulty}
        </div>

        <div className="space-y-2 pt-2 border-t border-primary/20 flex-grow">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Credits</span>
            <span className="font-semibold text-foreground">{course.credits}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Seats</span>
            <span className="font-medium text-foreground">
              {course.seatsTaken}/{course.seatsTotal}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <span className="font-medium truncate">{instructorName}</span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-primary/20">
          <Link
            href={`/courses/${course.id}`}
            className="block text-center w-full px-4 py-2 bg-primary text-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300 border border-primary/30"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={() => onAddCourse?.(course)}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-300 border flex items-center justify-center gap-2 ${
              isSelected
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                : "bg-primary/15 text-primary border-primary/50 hover:bg-primary/25"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                Added (Remove)
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
