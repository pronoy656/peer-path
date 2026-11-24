"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, GraduationCap, Users } from "lucide-react";
import StudentCard from "./StudentCard";
import { useAppStore } from "@/lib/store/AppStore";
import { getStudentsList } from "@/lib/services/people";

const DEPARTMENTS = ["All Departments", "CSE", "BBA", "MSJ", "English", "Bangla"];

export default function Student() {
  const { state } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");

  const students = getStudentsList(state);

  const batches = useMemo(() => {
    const set = new Set(students.map((s) => s.batch).filter(Boolean) as string[]);
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
        selectedDepartment === "All Departments" ||
        student.department === selectedDepartment;

      const matchesBatch =
        selectedBatch === "All Batches" || student.batch === selectedBatch;

      return matchesSearch && matchesDepartment && matchesBatch;
    });
  }, [students, searchQuery, selectedDepartment, selectedBatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl bg-yellow-400 py-20 px-6 sm:px-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-1/5 right-8 opacity-10 pointer-events-none">
            <GraduationCap className="w-72 h-72" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Find Your <span className="text-white drop-shadow-sm">Peers</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-900/85 font-medium">
              Connect with {students.length} ULAB students across departments and
              batches for study groups, projects, and course advice.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 lg:col-span-5">
              <label
                htmlFor="student-search"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Search Students
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="student-search"
                  type="text"
                  placeholder="Search by name, ID, email, or interest..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="student-dept"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="student-dept"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all appearance-none font-medium cursor-pointer"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="student-batch"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Batch
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="student-batch"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all appearance-none font-medium cursor-pointer"
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
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Students{" "}
            <span className="text-gray-400 font-normal text-lg ml-2">
              ({filteredStudents.length})
            </span>
          </h2>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No students match your filter
            </h3>
            <p className="text-gray-500 mb-4">
              Try clearing your search or selecting All Departments.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDepartment("All Departments");
                setSelectedBatch("All Batches");
              }}
              className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
