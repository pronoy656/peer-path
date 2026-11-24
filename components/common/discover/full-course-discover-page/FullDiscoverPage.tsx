"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, X } from "lucide-react";
import DepartmentTabs from "../department-tabs/DepartmentTabs";
import CourseCard from "../course-card/CourseCard";
import CoursePreference from "../course-Preference-section/CoursePreference";
import { useAppStore } from "@/lib/store/AppStore";
import {
  enrollBatch,
  getPreferences,
  toggleSaveCourse,
} from "@/lib/services/enrollment";
import type { Course, Department } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function FullDiscoverPage() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();

  const savedPrefs = getPreferences(state, currentUser?.id);
  const [departmentOverride, setDepartmentOverride] =
    useState<Department | null>(null);
  const [semesterOverride, setSemesterOverride] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const selectedDepartment = departmentOverride ?? savedPrefs.department;
  const selectedSemester = semesterOverride ?? String(savedPrefs.semester);

  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  const creditLimit = 14;
  const creditPct = Math.min(100, Math.round((totalCredits / creditLimit) * 100));

  const handleAddCourse = (course: Course) => {
    if (selectedCourses.find((c) => c.id === course.id)) {
      setSelectedCourses((prev) => prev.filter((c) => c.id !== course.id));
      showToast(`Removed ${course.code} from selection`, "info");
    } else if (totalCredits + course.credits <= creditLimit) {
      setSelectedCourses((prev) => [...prev, course]);
      showToast(`Added ${course.code} to semester selection`);
    } else {
      showToast("Cannot exceed 14 credits per semester.", "error");
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleConfirmEnrollment = () => {
    if (!currentUser) {
      showToast("Please sign in to confirm course enrollment.", "info");
      router.push("/signIn");
      return;
    }
    const res = enrollBatch(
      state,
      dispatch,
      currentUser.id,
      selectedCourses.map((c) => c.id)
    );
    if (res.ok) {
      showToast(res.message);
      setSelectedCourses([]);
      setMobileSheetOpen(false);
    } else {
      showToast(res.message, "info");
    }
  };

  const handleSaveForLater = () => {
    for (const c of selectedCourses) {
      const alreadySaved = (
        state.savedCourseIds[currentUser?.id || "guest"] ?? []
      ).includes(c.id);
      if (!alreadySaved) {
        toggleSaveCourse(state, dispatch, currentUser?.id, c.id);
      }
    }
    showToast(`Saved ${selectedCourses.length} course(s) for later.`);
  };

  const selectionPanelContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Semester plan
          </p>
          <h3 className="font-display font-bold text-lg text-foreground">
            Selected courses
          </h3>
        </div>
        <span
          className={`text-sm font-bold ${
            totalCredits > creditLimit ? "text-danger" : "text-primary"
          }`}
        >
          {totalCredits} / {creditLimit} cr
        </span>
      </div>

      {/* Credit limit progress bar */}
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-200 ${
            totalCredits > creditLimit ? "bg-danger" : "bg-accent"
          }`}
          style={{ width: `${creditPct}%` }}
        />
      </div>

      {selectedCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
          Add courses from the grid to build your semester schedule.
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {selectedCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-xl border border-border bg-background p-3 flex items-start justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary">
                  {course.code} · {course.credits} cr
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {course.title}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${course.title}`}
                onClick={() => handleRemoveCourse(course.id)}
                className="p-1 rounded-lg text-muted-foreground hover:text-danger hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 pt-2">
        <Button
          type="button"
          variant="accent"
          size="md"
          className="w-full"
          onClick={handleConfirmEnrollment}
          disabled={
            selectedCourses.length === 0 || totalCredits > creditLimit
          }
        >
          Confirm enrollment
        </Button>
        {selectedCourses.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleSaveForLater}
          >
            Save for later
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-16 pb-24 lg:pb-16">
      {/* Page Header */}
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Semester course planner
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            Discover your next ULAB courses
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Filter by department and semester, stay within the 14-credit limit,
            and get rule-based recommendations.
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar under navbar */}
      <div className="sticky top-16 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <DepartmentTabs
            selectedDepartment={selectedDepartment}
            onSelectDepartment={(dept) => setDepartmentOverride(dept)}
          />

          <div className="flex items-center gap-2.5">
            <label
              htmlFor="discover-semester"
              className="text-sm font-medium text-muted-foreground"
            >
              Semester
            </label>
            <select
              id="discover-semester"
              value={selectedSemester}
              onChange={(e) => setSemesterOverride(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-card text-sm font-semibold text-foreground"
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content + Desktop Sticky Selection Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="space-y-4 min-w-0">
            <h2 className="text-xl font-bold font-display text-foreground">
              {selectedDepartment} · Semester {selectedSemester}
            </h2>
            <CourseCard
              department={selectedDepartment}
              semester={selectedSemester}
              onAddCourse={handleAddCourse}
              selectedCourses={selectedCourses.map((c) => c.id)}
              onResetSemester={() => setSemesterOverride("1")}
            />
          </div>

          <aside className="hidden lg:block sticky top-36 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            {selectionPanelContent}
          </aside>
        </div>

        {/* Distinct Amber-accented Recommendations section */}
        <CoursePreference
          selectedDepartment={selectedDepartment}
          selectedSemester={Number(selectedSemester) || 1}
          onAddCourse={handleAddCourse}
          selectedCourseIds={selectedCourses.map((c) => c.id)}
        />
      </div>

      {/* Mobile Fixed Bottom Selection Bar */}
      {selectedCourses.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border px-4 py-3 shadow-[var(--shadow-modal)] flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-foreground">
              {selectedCourses.length} course
              {selectedCourses.length === 1 ? "" : "s"} · {totalCredits} credits
            </p>
            <p className="text-xs text-muted-foreground">
              Limit: {creditLimit} credits
            </p>
          </div>
          <Button
            type="button"
            variant="accent"
            size="md"
            onClick={() => setMobileSheetOpen(true)}
          >
            View plan <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      {mobileSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end"
          onClick={() => setMobileSheetOpen(false)}
        >
          <div
            className="w-full bg-card rounded-t-2xl p-6 shadow-[var(--shadow-modal)] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                type="button"
                aria-label="Close selection panel"
                onClick={() => setMobileSheetOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectionPanelContent}
          </div>
        </div>
      )}
    </div>
  );
}
