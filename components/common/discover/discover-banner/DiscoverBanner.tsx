"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses } from "@/lib/services/courses";

export default function DiscoverBanner() {
  const { state } = useAppStore();
  const coursesCount = getCourses(state).length;
  const facultyCount = state.facultyProfiles.length;
  const studentsCount = state.users.filter((u) => u.role === "student").length;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-background pt-28 pb-16">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="space-y-6 flex flex-col justify-center">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 w-fit">
              <span className="text-sm font-semibold text-primary">
                ULAB Semester Planner
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Discover Your{" "}
              <span className="text-primary">Perfect Courses</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Browse ULAB courses organized by department and semester. Build
              your semester schedule up to 14 credits and get tailored
              recommendations.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#discover-catalog"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/courses"
                className="px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors duration-300"
              >
                Full Catalog
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {coursesCount}
                </p>
                <p className="text-sm text-muted-foreground">Active Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {facultyCount}
                </p>
                <p className="text-sm text-muted-foreground">ULAB Faculty</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {studentsCount}
                </p>
                <p className="text-sm text-muted-foreground">Peers Enrolled</p>
              </div>
            </div>
          </div>

          <div className="relative h-full min-h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/ulab-campus-1.jpg"
              alt="ULAB students discovering semester courses"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
