"use client";

import React, { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getFacultyList } from "@/lib/services/people";
import FacultyCard from "./FacultyCard";
import { EmptyState } from "@/components/ui/empty-state";

const DEPARTMENTS = ["All", "CSE", "BBA", "MSJ", "English", "Bangla"];

export default function Faculty() {
  const { state } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const facultyList = getFacultyList(state);

  const filteredFaculty = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return facultyList.filter((faculty) => {
      const matchesSearch =
        !q ||
        faculty.name.toLowerCase().includes(q) ||
        faculty.researchArea.some((r) => r.toLowerCase().includes(q));
      const matchesDept =
        selectedDepartment === "All" ||
        faculty.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [facultyList, searchQuery, selectedDepartment]);

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Faculty directory
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            ULAB faculty &amp; office hours
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Check office hours, research interests, course syllabi, and message
            professors directly.
          </p>
        </div>
      </section>

      <section className="bg-card border-b border-border py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search faculty by name or research area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-border rounded-lg bg-card text-sm text-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2">
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

          <p className="text-xs font-medium text-muted-foreground">
            Showing {filteredFaculty.length} of {facultyList.length} faculty
            members
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFaculty.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="No faculty members matched"
            description="Try adjusting your search query or department filter."
            actionLabel="Reset filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedDepartment("All");
            }}
          />
        )}
      </div>
    </div>
  );
}
