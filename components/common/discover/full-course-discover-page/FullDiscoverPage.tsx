"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DiscoverBanner from "../discover-banner/DiscoverBanner";
import DepartmentTabs from "../department-tabs/DepartmentTabs";
import SemesterTabs from "../semester-tabs/SemesterTabs";
import CourseCard from "../course-card/CourseCard";
import CoursePreview from "../courese-preview/CoursePreview";
import CoursePreference from "../course-Preference-section/CoursePreference";
import { useAppStore } from "@/lib/store/AppStore";
import {
  enrollBatch,
  getPreferences,
  toggleSaveCourse,
} from "@/lib/services/enrollment";
import type { Course, Department } from "@/lib/types";

export default function FullDiscoverPage() {
  const { state, dispatch, currentUser, showToast, hydrated } = useAppStore();
  const router = useRouter();

  const savedPrefs = getPreferences(state, currentUser?.id);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>(
    savedPrefs.department
  );
  const [selectedSemester, setSelectedSemester] = useState<string>(
    String(savedPrefs.semester)
  );
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    const prefs = getPreferences(state, currentUser?.id);
    setSelectedDepartment(prefs.department);
    setSelectedSemester(String(prefs.semester));
  }, [hydrated, currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddCourse = (course: Course) => {
    if (selectedCourses.find((c) => c.id === course.id)) {
      setSelectedCourses((prev) => prev.filter((c) => c.id !== course.id));
      showToast(`Removed ${course.code} from selection`, "info");
    } else {
      const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
      if (totalCredits + course.credits <= 14) {
        setSelectedCourses((prev) => [...prev, course]);
        showToast(`Added ${course.code} to semester selection`);
      } else {
        showToast("Cannot exceed 14 credits per semester.", "error");
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <DiscoverBanner />

      <div id="discover-catalog" className="container mx-auto px-4 py-12 space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Select Department
          </h2>
          <DepartmentTabs
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Select Semester
          </h2>
          <SemesterTabs
            selectedSemester={selectedSemester}
            onSelectSemester={setSelectedSemester}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Available Courses — {selectedDepartment} (Semester{" "}
            {selectedSemester})
          </h2>
          <CourseCard
            department={selectedDepartment}
            semester={selectedSemester}
            onAddCourse={handleAddCourse}
            selectedCourses={selectedCourses.map((c) => c.id)}
            onResetSemester={() => setSelectedSemester("1")}
          />
        </div>

        {selectedCourses.length > 0 && (
          <CoursePreview
            courses={selectedCourses}
            onRemoveCourse={handleRemoveCourse}
            onConfirmEnrollment={handleConfirmEnrollment}
            onSaveForLater={handleSaveForLater}
          />
        )}

        <CoursePreference
          selectedDepartment={selectedDepartment}
          selectedSemester={Number(selectedSemester) || 1}
          onAddCourse={handleAddCourse}
          selectedCourseIds={selectedCourses.map((c) => c.id)}
        />
      </div>
    </div>
  );
}
