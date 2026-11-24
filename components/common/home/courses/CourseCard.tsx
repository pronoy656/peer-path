"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/types";

export default function UnifiedCourseCard({
  course,
  instructorName,
  actionSlot,
}: {
  course: Course;
  instructorName?: string;
  actionSlot?: React.ReactNode;
}) {
  const [imgError, setImgError] = useState(false);
  const seatsLeft = Math.max(0, course.seatsTotal - course.seatsTaken);

  return (
    <div className="group bg-card border border-border rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 hover:border-foreground/25 transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* 16:10 Top Image */}
      <Link
        href={`/courses/${course.id}`}
        className="relative block aspect-[16/10] w-full bg-muted overflow-hidden"
      >
        {!imgError && course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary">
            <span className="font-display font-bold text-xl">{course.code}</span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {course.department}
            </span>
          </div>
        )}
      </Link>

      {/* Card Body (strict anatomy order) */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Department badge + semester */}
        <div className="flex items-center justify-between gap-2">
          <Badge department={course.department}>{course.department}</Badge>
          <span className="text-xs font-medium text-muted-foreground">
            Sem {course.semester} · {course.code}
          </span>
        </div>

        {/* Title (2 lines max) */}
        <Link href={`/courses/${course.id}`} className="block">
          <h3 className="font-display font-semibold text-[18px] leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>

        {/* Instructor + Rating */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate font-medium">
            {instructorName ?? "ULAB Faculty"}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-foreground shrink-0">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            {course.rating > 0 ? course.rating.toFixed(1) : "New"}
          </span>
        </div>

        {/* Footer row: Credits · Seats left + Actions */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-muted-foreground">
            {course.credits} credits ·{" "}
            <span
              className={
                seatsLeft === 0 ? "text-danger font-semibold" : "text-foreground"
              }
            >
              {seatsLeft === 0 ? "Full" : `${seatsLeft} seats left`}
            </span>
          </span>
          {actionSlot}
        </div>
      </div>
    </div>
  );
}
