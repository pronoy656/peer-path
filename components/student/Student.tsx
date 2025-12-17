"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, GraduationCap, Users } from "lucide-react";
import StudentCard, { StudentProps } from "./StudentCard";

// Mock Data
const MOCK_STUDENTS: StudentProps[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@university.edu",
    studentId: "223014073",
    department: "Computer Science",
    batch: "223",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@university.edu",
    studentId: "223014008",
    department: "Software Engineering",
    batch: "223",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    studentId: "224015046",
    department: "Computer Science",
    batch: "224",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@university.edu",
    studentId: "222013012",
    department: "Information Technology",
    batch: "222",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "j.wilson@university.edu",
    studentId: "225016089",
    department: "Software Engineering",
    batch: "225",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "l.anderson@university.edu",
    studentId: "223014099",
    department: "Data Science",
    batch: "223",
  },
];

const DEPARTMENTS = [
  "All Departments",
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
];

const BATCHES = ["All Batches", "222", "223", "224", "225"];

export default function Student() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((student) => {
      // Search (ID or Email)
      const matchesSearch =
        student.studentId.includes(searchQuery) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by Department
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        student.department === selectedDepartment;

      // Filter by Batch
      const matchesBatch =
        selectedBatch === "All Batches" || student.batch === selectedBatch;

      return matchesSearch && matchesDepartment && matchesBatch;
    });
  }, [searchQuery, selectedDepartment, selectedBatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32 pt-24">
      {/* Banner Section */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-yellow-400 py-28 px-4 sm:px-6 lg:px-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-1/5 right-1/5 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <GraduationCap className="w-96 h-96" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Find Your <span className="text-white drop-shadow-md">Peers</span>
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl font-medium">
            Connect with students from your department and batch. Build your
            network today.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Search Box */}
            <div className="md:col-span-6 lg:col-span-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Name, ID, or Email..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
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

              {/* Batch Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batch
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all appearance-none font-medium cursor-pointer"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                  >
                    {BATCHES.map((batch) => (
                      <option key={batch} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Students{" "}
            <span className="text-gray-400 font-normal text-lg ml-2">
              ({filteredStudents.length})
            </span>
          </h2>
        </div>

        {/* Student Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} {...student} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No students found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We could not find any students matching your search filters. Try
              adjusting your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDepartment("All Departments");
                setSelectedBatch("All Batches");
              }}
              className="mt-6 text-yellow-600 font-bold hover:text-yellow-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
