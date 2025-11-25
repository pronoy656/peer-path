/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import { Filter, Search } from "lucide-react";

// Import the full JSON with description & courseCode
import courses from "./courses.json";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filtered = courses.filter((course: any) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "All" || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Courses
            </h1>
            <p className="text-xl text-foreground/60">
              Browse {courses.length} courses with verified student reviews and
              ratings
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-5">
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by course title, instructor, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" /> Difficulty:
                </span>
                {["All", "Beginner", "Intermediate", "Advanced"].map(
                  (level) => (
                    <button
                      key={level}
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
                Showing {filtered.length} of {courses.length} courses
              </p>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((course: any) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl font-semibold text-muted-foreground">
                  No courses found
                </p>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
