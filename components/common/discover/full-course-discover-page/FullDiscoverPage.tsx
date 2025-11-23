/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react'

// export default function FullDiscoverPage() {
//   return (
//     <div>FullDiscoverPage</div>
//   )
// }

"use client";

import { useState } from "react";
import DiscoverBanner from "../discover-banner/DiscoverBanner";
import DepartmentTabs from "../department-tabs/DepartmentTabs";
import SemesterTabs from "../semester-tabs/SemesterTabs";
import CourseCard from "../course-card/CourseCard";
import CoursePreview from "../courese-preview/CoursePreview";
import CoursePreference from "../course-Preference-section/CoursePreference";
// import { CourseHero } from "./course-hero"
// import { DepartmentTabs } from "./department-tabs"
// import { SemesterTabs } from "./semester-tabs"
// import { CourseGrid } from "./course-grid"
// import { PreferencesSection } from "./preferences-section"
// import { CoursePreviewSection } from "./course-preview-section"

export default function FullDiscoverPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("CSE");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);

  const handleAddCourse = (course: any) => {
    // Check if course already selected
    if (selectedCourses.find((c) => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
    } else {
      // Calculate total credits
      const totalCredits = selectedCourses.reduce(
        (sum, c) => sum + c.credits,
        0
      );
      if (totalCredits + course.credits <= 14) {
        setSelectedCourses([...selectedCourses, course]);
      } else {
        alert("Cannot exceed 14 credits per semester");
      }
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <DiscoverBanner />

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Department Selection */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Select Department
          </h2>
          <DepartmentTabs
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
          />
        </div>

        {/* Semester Selection */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Select Semester
          </h2>
          <SemesterTabs
            selectedSemester={selectedSemester}
            onSelectSemester={setSelectedSemester}
          />
        </div>

        {/* Course Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Available Courses - {selectedDepartment} (Semester{" "}
            {selectedSemester})
          </h2>
          <CourseCard
            department={selectedDepartment}
            semester={selectedSemester}
            onAddCourse={handleAddCourse}
            selectedCourses={selectedCourses.map((c) => c.id)}
          />
        </div>

        {selectedCourses.length > 0 && (
          <CoursePreview
            courses={selectedCourses}
            onRemoveCourse={handleRemoveCourse}
          />
        )}

        {/* Preferences Section */}
        <CoursePreference />
      </div>
    </div>
  );
}
