"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store/AppStore";
import { getAlumniList, getEvents, getJobs } from "@/lib/services/people";

export function AlumniSections() {
  const { state } = useAppStore();
  const alumniList = getAlumniList(state);
  const featured = alumniList.slice(0, 3);
  const jobsCount = getJobs(state).length;
  const eventsCount = getEvents(state).length;

  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Alumni network
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Learn directly from ULAB graduates
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {alumniList.length} mentors, {jobsCount} open Dhaka roles, and{" "}
              {eventsCount} upcoming campus sessions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/alumni">
              <Button variant="outline" size="md">
                All mentors
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="default" size="md">
                Browse jobs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((mentor) => (
            <Link
              key={mentor.id}
              href={`/alumni/${mentor.id}`}
              className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={mentor.avatar}
                    name={mentor.name}
                    size="md"
                    department={mentor.department}
                    avatarColor={mentor.avatarColor}
                  />
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-base text-foreground truncate group-hover:text-primary">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      {mentor.currentRole} · {mentor.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge department={mentor.department}>
                    {mentor.department}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Batch {mentor.batch}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {mentor.journey}
                </p>
              </div>

              <span className="text-xs font-semibold text-primary group-hover:underline">
                View mentor profile →
              </span>
            </Link>
          ))}
        </div>

        {/* Navy CTA Band */}
        <div className="rounded-2xl bg-sidebar text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">
              Start this semester
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Ready to build your ULAB semester plan?
            </h3>
            <p className="text-sm sm:text-base text-sidebar-foreground/80">
              Try any of the 6 campus roles or sign up in seconds with your ULAB
              email.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/discover">
              <Button variant="accent" size="lg">
                Start discovering
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/signIn">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white/25 text-white hover:bg-white/10"
              >
                Try demo roles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
