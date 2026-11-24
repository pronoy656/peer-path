"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses } from "@/lib/services/courses";

export default function HeroSection() {
  const { state } = useAppStore();
  const approvedCourses = getCourses(state);
  const departmentCount = new Set(approvedCourses.map((c) => c.department)).size;
  const facultyCount = state.facultyProfiles.length;
  const alumniCount = state.alumniProfiles.length;

  const platformBanner = state.announcements.find((a) => a.isPlatformWide);

  return (
    <section className="bg-background pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {platformBanner && (
          <div className="rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-accent-foreground shrink-0">
                <Megaphone className="w-4 h-4" />
              </span>
              <div>
                <span className="font-semibold">{platformBanner.title}: </span>
                <span className="text-muted-foreground">
                  {platformBanner.content}
                </span>
              </div>
            </div>
            <Link
              href="/discover"
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              Explore Discover →
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              University of Liberal Arts Bangladesh
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold font-display tracking-tight leading-[1.05] text-foreground">
              Find your path at ULAB.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Plan your semester across {departmentCount} departments, read
              honest senior course reviews, check faculty office hours, and
              connect with ULAB alumni mentors.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/discover">
                <Button variant="accent" size="lg">
                  Discover courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/faculty">
                <Button variant="outline" size="lg">
                  Browse faculty
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-[var(--shadow-card-hover)] aspect-[16/10]">
              <Image
                src="/ulab-campus-1.jpg"
                alt="ULAB Permanent Campus"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:min-w-[280px] rounded-xl bg-card/95 backdrop-blur-sm border border-border px-4 py-3 shadow-[var(--shadow-card)]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Live ULAB catalog
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {approvedCourses.length} courses · {departmentCount} departments ·{" "}
                  {facultyCount + alumniCount} faculty &amp; mentors
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
