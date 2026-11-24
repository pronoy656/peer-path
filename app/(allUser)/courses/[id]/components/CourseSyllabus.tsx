"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CourseSyllabus({
  syllabus = [],
}: {
  syllabus?: { week: number; topic: string }[];
}) {
  const [openWeek, setOpenWeek] = useState<number | null>(
    syllabus[0]?.week ?? null
  );

  if (!syllabus || syllabus.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No syllabus available.</p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-display text-foreground">
        Weekly syllabus
      </h2>
      <div className="space-y-2.5">
        {syllabus.map((item) => {
          const isOpen = openWeek === item.week;
          return (
            <div
              key={item.week}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenWeek(isOpen ? null : item.week)}
                aria-expanded={isOpen}
                className="w-full px-5 py-3.5 flex items-center justify-between gap-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    W{item.week}
                  </span>
                  <span className="font-semibold text-sm text-foreground">
                    {item.topic}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-150 shrink-0",
                    isOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-sm text-muted-foreground border-t border-border bg-background">
                  Week {item.week} covers guided lectures, reading notes, and
                  hands-on practice on {item.topic.toLowerCase()}.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
