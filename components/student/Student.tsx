"use client";

import React, { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import StudentCard from "./StudentCard";
import { useAppStore } from "@/lib/store/AppStore";
import { getStudentsList } from "@/lib/services/people";
import { EmptyState } from "@/components/ui/empty-state";

const DEPARTMENTS = ["All", "CSE", "BBA", "MSJ", "English", "Bangla"];

export default function Student() {
  const { state } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");

  const students = getStudentsList(state);

  const batches = useMemo(() => {
    const set = new Set(
      students.map((s) => s.batch).filter(Boolean) as string[]
    );
    return ["All Batches", ...Array.from(set).sort()];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !q ||
        (student.studentId?.toLowerCase().includes(q) ?? false) ||
        student.email.toLowerCase().includes(q) ||
        student.name.toLowerCase().includes(q) ||
        (student.interests?.some((i) => i.toLowerCase().includes(q)) ?? false);

      const matchesDepartment =
        selectedDepartment === "All" ||
        student.department === selectedDepartment;

      const matchesBatch =
        selectedBatch === "All Batches" || student.batch === selectedBatch;

      return matchesSearch && matchesDepartment && matchesBatch;
    });
  }, [students, searchQuery, selectedDepartment, selectedBatch]);

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Student directory
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            Find your ULAB peers
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Connect with {students.length} students across batches for study
            groups, lab partners, and course advice.
          </p>
        </div>
      </section>

      <section className="bg-card border-b border-border py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-3">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, student ID, email, or interest..."
                className="w-full h-10 pl-10 pr-4 border border-border rounded-lg bg-card text-sm text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              aria-label="Filter by batch"
              className="h-10 px-3 border border-border rounded-lg bg-card text-sm font-medium text-foreground"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch === "All Batches" ? batch : `Batch ${batch}`}
                </option>
              ))}
            </select>
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
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="No students matched"
            description="Try adjusting your search or selecting All Departments."
            actionLabel="Reset filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedDepartment("All");
              setSelectedBatch("All Batches");
            }}
          />
        )}
      </div>
    </div>
  );
}
