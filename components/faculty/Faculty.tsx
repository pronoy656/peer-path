"use client";

import React, { useState, useMemo } from "react";
// import { facultyData } from "@/lib/FacultyData";
// import FacultyCard from "./FacultyCard";
import { Search, Filter, GraduationCap } from "lucide-react";
import { facultyData } from "@/lib/FacultyData";
import FacultyCard from "./FacultyCard";

export default function Faculty() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const departments = useMemo(() => {
    const depts = new Set(facultyData.map((f) => f.department));
    return ["All", ...Array.from(depts)];
  }, []);

  const filteredFaculty = useMemo(() => {
    return facultyData.filter((faculty) => {
      const matchesSearch = faculty.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDept =
        selectedDepartment === "All" ||
        faculty.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDepartment]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
      {/* Banner Section */}
      <div className="max-w-7xl mx-auto rounded-2xl  bg-yellow-400 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Our Distinguished <span className="text-white">Faculty</span>
            </h1>
            <p className="text-xl text-black/80 font-medium">
              Connect with world-class researchers and dedicated educators who
              are shaping the future.
            </p>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute right-0 -top-20 right-28 opacity-10 translate-y-1/3 translate-x-1/4">
          <GraduationCap className="w-96 h-96 text-black" />
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 relative z-20">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full md:w-64 pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all appearance-none cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaculty.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No faculty members found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
