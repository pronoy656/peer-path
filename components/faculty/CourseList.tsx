"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Course } from "@/lib/types";

interface CourseListProps {
  title: string;
  courses: Course[];
}

export default function CourseList({ title, courses }: CourseListProps) {
  if (courses.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-yellow-500" />
        {title}
      </h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block p-3.5 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors border border-transparent hover:border-yellow-200 group"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-gray-900 group-hover:text-amber-800">
                  {course.code}: {course.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {course.department} • Semester {course.semester} •{" "}
                  {course.credits} Credits
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
