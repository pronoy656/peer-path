/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react'

// export default function CourseCardDesign() {
//   return (
//     <div>CourseCardDesign</div>
//   )
// }

"use client";

import { useState } from "react";
import { Heart, Plus } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    code: string;
    credits: number;
    instructor: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    description: string;
  };
  onAddCourse?: (course: any) => void;
  isSelected?: boolean;
}

export default function CourseCardDesign({
  course,
  onAddCourse,
  isSelected = false,
}: CourseCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const difficultyColors = {
    Beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Intermediate: "bg-blue-50 text-blue-700 border border-blue-200",
    Advanced: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  return (
    <div
      className={`group relative bg-card rounded-xl border-2 border-primary/30 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 space-y-3 flex flex-col flex-grow">
        {/* Header with Code and Favorite */}
        <div className="flex items-start justify-between">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
            {course.code}
          </span>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        {/* Course Name */}
        <h3 className="text-lg font-bold text-foreground leading-tight">
          {course.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        {/* Difficulty Badge */}
        <div
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full w-fit ${
            difficultyColors[course.difficulty]
          }`}
        >
          {course.difficulty}
        </div>

        {/* Course Details */}
        <div className="space-y-2 pt-2 border-t border-primary/20 flex-grow">
          {/* Credits */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Credits</span>
            <span className="font-semibold text-foreground">
              {course.credits}
            </span>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <span className="font-medium truncate">{course.instructor}</span>
          </div>
        </div>

        {/* Buttons Container - Fixed positioning */}
        <div className="space-y-3 pt-4 border-t border-primary/20">
          <button className="w-full px-4 py-2 bg-primary text-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300 border border-primary/30">
            View Details
          </button>

          <button
            onClick={() => onAddCourse?.(course)}
            className="w-full px-4 py-2 bg-primary/15 text-primary rounded-lg font-semibold hover:bg-primary/25 transition-colors duration-300 border border-primary/50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
