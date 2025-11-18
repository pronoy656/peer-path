// import React from "react";

// export default function Courses() {
//   return <div>Courses</div>;
// }

"use client";

import { ArrowRight, Star, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  students: number;
  rating: number;
  image: string;
}

export default function CourseCard({ course }: { course: Course }) {
  const [isHovered, setIsHovered] = useState(false);

  const getLevelBadgeStyle = (level: string) => {
    const levelLower = level.toLowerCase();
    switch (levelLower) {
      case "beginner":
        return {
          borderColor: "border-green-500",
          textColor: "text-green-500",
          bgColor: "bg-green-100",
        };
      case "intermediate":
        return {
          borderColor: "border-blue-500",
          textColor: "text-blue-500",
          bgColor: "bg-blue-100",
        };
      case "advanced":
        return {
          borderColor: "border-orange-500",
          textColor: "text-orange-500",
          bgColor: "bg-orange-100",
        };
      default:
        return {
          borderColor: "border-primary",
          textColor: "text-primary",
          bgColor: "bg-primary/10",
        };
    }
  };

  const badgeStyle = getLevelBadgeStyle(course.level);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:border-primary/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {/* Title */}
        <h3 className="text-balance line-clamp-2 font-bold text-foreground text-base leading-tight">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center justify-between gap-2 py-2">
          {/* Students Count */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {(course.students / 1000).toFixed(1)}k
            </span>
          </div>

          {/* Level Badge */}
          <div
            className={`inline-flex rounded-full border-2 ${badgeStyle.borderColor} px-3 py-1 text-xs ${badgeStyle.bgColor} font-semibold ${badgeStyle.textColor}`}
          >
            {course.level}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* View Details Button */}
        <button
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 w-full ${
            isHovered
              ? "bg-yellow-400 text-yellow-950 shadow-yellow-200"
              : "bg-primary/10 text-black border border-primary/80 hover:bg-primary/15"
          }`}
        >
          <span>View Details</span>
          <ArrowRight
            className={`h-4 w-4 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
