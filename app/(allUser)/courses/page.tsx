"use client";

import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getCourses,
  getInstructorForCourse,
  searchCourses,
} from "@/lib/services/courses";
import type { Department, Difficulty } from "@/lib/types";
import UnifiedCourseCard from "@/components/common/home/courses/CourseCard";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

const DEPARTMENTS: Array<Department | "All"> = [
  "All",
  "CSE",
  "BBA",
  "MSJ",
  "English",
  "Bangla",
];

const DIFFICULTIES: Array<Difficulty | "All"> = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function CoursesPage() {
  const { state } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "All"
  >("All");
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | "All"
  >("All");
  const [selectedSemester, setSelectedSemester] = useState<number | "All">(
    "All"
  );

  const allCourses = getCourses(state);
  const filtered = searchCourses(state, {
    query: searchTerm,
    department: selectedDepartment,
    difficulty: selectedDifficulty,
    semester: selectedSemester,
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty("All");
    setSelectedDepartment("All");
    setSelectedSemester("All");
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Course directory
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            Explore ULAB courses
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Browse {allCourses.length} courses across 5 departments with weekly
            syllabi, seat counts, and peer reviews.
          </p>
        </div>
      </section>

      <section className="bg-card border-b border-border py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by course title, code, or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-border rounded-lg bg-card text-sm text-foreground"
              />
            </div>

            <select
              aria-label="Filter by semester"
              value={selectedSemester}
              onChange={(e) =>
                setSelectedSemester(
                  e.target.value === "All" ? "All" : Number(e.target.value)
                )
              }
              className="h-10 px-3 border border-border rounded-lg bg-card text-sm font-medium text-foreground"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {DEPARTMENTS.map((dept) => {
                const selected = selectedDepartment === dept;
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDepartment(dept)}
                    className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-colors ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {dept === "All" ? "All Depts" : dept}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {DIFFICULTIES.map((level) => {
                const selected = selectedDifficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedDifficulty(level)}
                    className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-colors ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Showing {filtered.length} of {allCourses.length} courses
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((course) => {
                const instructor = getInstructorForCourse(state, course);
                return (
                  <UnifiedCourseCard
                    key={course.id}
                    course={course}
                    instructorName={instructor?.name}
                    actionSlot={
                      <Link
                        href={`/courses/${course.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        View →
                      </Link>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen className="w-6 h-6" />}
              title="No courses match your filters"
              description="Try clearing your search or selecting a different department or difficulty."
              actionLabel="Clear all filters"
              onAction={resetFilters}
            />
          )}
        </div>
      </section>
    </div>
  );
}
