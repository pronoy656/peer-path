"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, GraduationCap } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getFacultyList } from "@/lib/services/people";
import FacultyCard from "./FacultyCard";

export default function Faculty() {
  const { state } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const facultyList = getFacultyList(state);

  const departments = useMemo(() => {
    const depts = new Set(facultyList.map((f) => f.department || "CSE"));
    return ["All", ...Array.from(depts)];
  }, [facultyList]);

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((faculty) => {
      const matchesSearch =
        faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.researchArea.some((r) =>
          r.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesDept =
        selectedDepartment === "All" ||
        faculty.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [facultyList, searchQuery, selectedDepartment]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl bg-yellow-400 py-14 px-6 sm:px-10 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              ULAB Faculty <span className="text-white">Directory</span>
            </h1>
            <p className="text-lg sm:text-xl text-black/85 font-medium">
              Check office hours, research areas, course loads, and message ULAB
              professors directly.
            </p>
          </div>
          <div className="absolute right-8 -bottom-10 opacity-10 pointer-events-none">
            <GraduationCap className="w-72 h-72 text-black" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 relative z-20 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty by name or research area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                aria-label="Filter faculty by department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full md:w-64 pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all appearance-none cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No faculty members found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or department filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDepartment("All");
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
