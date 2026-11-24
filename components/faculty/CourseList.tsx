"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Course } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface CourseListProps {
  title: string;
  courses: Course[];
}

export default function CourseList({ title, courses }: CourseListProps) {
  if (courses.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border p-6">
      <h3 className="text-lg font-bold font-display text-foreground mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        {title}
      </h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block p-3.5 bg-background rounded-xl hover:bg-muted transition-colors border border-border group"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge department={course.department}>{course.code}</Badge>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                    {course.title}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Semester {course.semester} · {course.credits} credits
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
