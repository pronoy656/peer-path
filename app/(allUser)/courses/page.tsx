"use client";

import { useState } from "react";
import { Filter, Search, BookOpen } from "lucide-react";
import CourseCard from "./CourseCard";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getCourses,
  getInstructorForCourse,
  searchCourses,
} from "@/lib/services/courses";
import type { Department, Difficulty } from "@/lib/types";

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
    <div className="min-h-screen flex flex-col pt-16">
      <main className="flex-1">
        {/* Header */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore ULAB Courses
            </h1>
            <p className="text-xl text-foreground/70">
              Browse {allCourses.length} semester courses across 5 ULAB
              departments with peer reviews and live seat availability
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by course title, instructor, or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  />
                </div>

                <div>
                  <select
                    aria-label="Filter by department"
                    value={selectedDepartment}
                    onChange={(e) =>
                      setSelectedDepartment(
                        e.target.value as Department | "All"
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    <option value="All">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="BBA">BBA</option>
                    <option value="MSJ">MSJ</option>
                    <option value="English">English</option>
                    <option value="Bangla">Bangla</option>
                  </select>
                </div>

                <div>
                  <select
                    aria-label="Filter by semester"
                    value={selectedSemester}
                    onChange={(e) =>
                      setSelectedSemester(
                        e.target.value === "All"
                          ? "All"
                          : Number(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    <option value="All">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" /> Difficulty:
                </span>
                {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedDifficulty === level
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {level}
                    </button>
                  )
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} of {allCourses.length} courses
              </p>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((course) => {
                  const instructor = getInstructorForCourse(state, course);
                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      instructorName={instructor?.name ?? "ULAB Faculty"}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card/50">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-2xl font-semibold text-foreground">
                  No courses found
                </p>
                <p className="mt-2 text-muted-foreground mb-6">
                  Try adjusting your search, department, semester, or difficulty
                  filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
