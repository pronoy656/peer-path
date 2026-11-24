"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, BookmarkIcon, Sparkles, Plus, Check } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getPreferences, savePreferences } from "@/lib/services/enrollment";
import {
  getInstructorForCourse,
  getRecommendedCourses,
} from "@/lib/services/courses";
import type { Course, Department, StudentPreferences } from "@/lib/types";

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
  const { state, dispatch, currentUser, showToast, hydrated } = useAppStore();
  const initial = getPreferences(state, currentUser?.id);

  const [preferences, setPreferences] = useState<StudentPreferences>(initial);
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [hasRequestedRecs, setHasRequestedRecs] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setPreferences(getPreferences(state, currentUser?.id));
  }, [hydrated, currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePreferenceChange = <K extends keyof StudentPreferences>(
    key: K,
    value: StudentPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const updated: StudentPreferences = {
      ...preferences,
      department: selectedDepartment,
      semester: selectedSemester,
    };
    savePreferences(dispatch, currentUser?.id, updated);
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
    showToast(`Found ${recs.length} recommended courses for ${selectedDepartment}.`, "info");
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/5 via-secondary/5 to-primary/5 border-2 border-primary/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full -ml-20 -mb-20 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Your Learning Preferences
            </h2>
          </div>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            Customize your course discovery experience by setting your study
            preferences. We will recommend ULAB courses that match your
            department, semester progression, and level.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label
                htmlFor="pref-credits"
                className="block text-sm font-semibold text-foreground"
              >
                Preferred Credits
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
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground font-medium hover:border-primary focus:border-primary outline-none transition-colors"
              >
                <option value="3">3 Credits</option>
                <option value="4">4 Credits</option>
                <option value="5">5+ Credits</option>
              </select>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="pref-schedule"
                className="block text-sm font-semibold text-foreground"
              >
                Time Preference
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
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground font-medium hover:border-primary focus:border-primary outline-none transition-colors"
              >
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                <option value="evening">Evening (3 PM - 6 PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="pref-level"
                className="block text-sm font-semibold text-foreground"
              >
                Course Level
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
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground font-medium hover:border-primary focus:border-primary outline-none transition-colors"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-border/50">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300"
            >
              <BookmarkIcon className="w-4 h-4" />
              Save Preferences
            </button>
            <button
              type="button"
              onClick={handleGetRecommendations}
              className="flex items-center gap-2 px-6 py-3 bg-card text-foreground border-2 border-border rounded-lg font-semibold hover:border-primary transition-colors duration-300"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Get Recommendations
            </button>
          </div>
        </div>
      </div>

      {hasRequestedRecs && (
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Recommended for You ({selectedDepartment})
              </h3>
              <p className="text-sm text-muted-foreground">
                Matched by department, next-semester sequence, level ({preferences.courseLevel}), and peer ratings
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((course) => {
              const instructor = getInstructorForCourse(state, course);
              const isSelected = selectedCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="rounded-xl border border-border p-4 flex flex-col justify-between bg-background"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">{course.code}</span>
                      <span className="text-muted-foreground">
                        Sem {course.semester} • {course.credits} Cr
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {instructor?.name ?? "ULAB Faculty"}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 text-center px-3 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-muted"
                    >
                      View Details
                    </Link>
                    {onAddCourse && (
                      <button
                        type="button"
                        onClick={() => onAddCourse(course)}
                        className="px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground flex items-center gap-1"
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Add
                          </>
                        )}
                      </button>
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
