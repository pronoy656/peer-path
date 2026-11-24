"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkIcon, Check, Plus, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getPreferences, savePreferences } from "@/lib/services/enrollment";
import {
  getInstructorForCourse,
  getRecommendedCourses,
} from "@/lib/services/courses";
import type { Course, Department, StudentPreferences } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CoursePreferenceProps {
  selectedDepartment?: Department;
  selectedSemester?: number;
  onAddCourse?: (course: Course) => void;
  selectedCourseIds?: string[];
}

export default function CoursePreference({
  selectedDepartment = "CSE",
  selectedSemester = 1,
  onAddCourse,
  selectedCourseIds = [],
}: CoursePreferenceProps) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const saved = getPreferences(state, currentUser?.id);

  const [draft, setDraft] = useState<Partial<StudentPreferences>>({});
  const preferences: StudentPreferences = {
    ...saved,
    ...draft,
  };

  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [hasRequestedRecs, setHasRequestedRecs] = useState(false);

  const handlePreferenceChange = <K extends keyof StudentPreferences>(
    key: K,
    value: StudentPreferences[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    savePreferences(dispatch, currentUser?.id, {
      ...preferences,
      department: selectedDepartment,
      semester: selectedSemester,
    });
    showToast("Learning preferences saved!");
  };

  const handleGetRecommendations = () => {
    const recs = getRecommendedCourses(state, {
      department: selectedDepartment,
      semester: selectedSemester,
      courseLevel: preferences.courseLevel,
      userId: currentUser?.id,
    });
    setRecommendations(recs);
    setHasRequestedRecs(true);
    showToast(
      `Found ${recs.length} recommended courses for ${selectedDepartment}.`,
      "info"
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border border-l-4 border-l-accent bg-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Recommended for you
          </p>
          <h2 className="text-2xl font-bold font-display text-foreground">
            Tailor your semester suggestions
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Set your preferred credits, time slot, and level. Suggestions adapt
            to your department and next-semester progression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label
              htmlFor="pref-credits"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Preferred credits
            </label>
            <select
              id="pref-credits"
              value={preferences.creditRange}
              onChange={(e) =>
                handlePreferenceChange(
                  "creditRange",
                  e.target.value as StudentPreferences["creditRange"]
                )
              }
              className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground"
            >
              <option value="3">3 Credits</option>
              <option value="4">4 Credits</option>
              <option value="5">5+ Credits</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pref-schedule"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Time preference
            </label>
            <select
              id="pref-schedule"
              value={preferences.schedule}
              onChange={(e) =>
                handlePreferenceChange(
                  "schedule",
                  e.target.value as StudentPreferences["schedule"]
                )
              }
              className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground"
            >
              <option value="morning">Morning (9 AM – 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM – 3 PM)</option>
              <option value="evening">Evening (3 PM – 6 PM)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pref-level"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Course level
            </label>
            <select
              id="pref-level"
              value={preferences.courseLevel}
              onChange={(e) =>
                handlePreferenceChange(
                  "courseLevel",
                  e.target.value as StudentPreferences["courseLevel"]
                )
              }
              className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="button" variant="default" onClick={handleSave}>
            <BookmarkIcon className="w-4 h-4" />
            Save preferences
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetRecommendations}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            Get recommendations
          </Button>
        </div>
      </div>

      {hasRequestedRecs && (
        <div className="rounded-2xl border border-border border-l-4 border-l-accent bg-card p-6 space-y-5 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suggestions · {selectedDepartment}
            </p>
            <h3 className="text-xl font-bold font-display text-foreground mt-0.5">
              Recommended next courses ({recommendations.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((course) => {
              const instructor = getInstructorForCourse(state, course);
              const isSelected = selectedCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge department={course.department}>
                        {course.code}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Sem {course.semester} · {course.credits} cr
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-base text-foreground line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {instructor?.name ?? "ULAB Faculty"}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Details
                      </Button>
                    </Link>
                    {onAddCourse && (
                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "secondary" : "default"}
                        onClick={() => onAddCourse(course)}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        {isSelected ? "Added" : "Add"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
