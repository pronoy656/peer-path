"use client";

import React from "react";
// import { Course } from "@/lib/FacultyData";
import { BookOpen } from "lucide-react";
import { Course } from "@/lib/facultyData";

interface CourseListProps {
  title: string;
  courses: Course[];
}

export default function CourseList({ title, courses }: CourseListProps) {
  if (courses.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-yellow-400" />
        {title}
      </h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-3 bg-gray-50 rounded-xl hover:bg-yellow-50/50 transition-colors border border-transparent hover:border-yellow-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {course.code}: {course.name}
                </div>
                {course.semester && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {course.semester}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
