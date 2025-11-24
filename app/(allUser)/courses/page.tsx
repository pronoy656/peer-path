"use client";

import { useState } from "react";


import courses from "./courses.json";
import CourseCard from "./CourseCard";
import { Filter, Search } from "lucide-react";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filtered = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "All" || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 md:py-20 bg-linear-to-b from-primary/5 to-transparent">
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

        {/* Search & Filter Section */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  Difficulty:
                </span>
                {["All", "Beginner", "Intermediate", "Advanced"].map(
                  (level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedDifficulty === level
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {level}
                    </button>
                  )
                )}
              </div>

              <p className="text-sm text-foreground/60">
                Showing {filtered.length} of {courses.length} courses
              </p>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-xl font-semibold text-foreground/60">
                  No courses found
                </p>
                <p className="text-foreground/40">
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
