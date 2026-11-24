"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Search } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getJobs } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function JobsPage() {
  const { state } = useAppStore();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "All" | "Full-time" | "Part-time" | "Internship"
  >("All");

  const jobs = getJobs(state).filter((j) => j.status === "open");

  const filtered = jobs.filter((job) => {
    const q = query.trim().toLowerCase();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);
    const matchesType = typeFilter === "All" || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Careers
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            Alumni job board
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Internships, fellowships, and full-time openings across Dhaka and
            Bangladesh posted by ULAB graduates.
          </p>
        </div>
      </section>

      <section className="bg-card border-b border-border py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by job title, company, or Dhaka location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-border rounded-lg bg-card text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["All", "Full-time", "Internship", "Part-time"] as const).map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-colors ${
                    typeFilter === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-6 h-6" />}
            title="No jobs matched your filters"
            description="Try clearing your search or selecting All job types."
            actionLabel="Clear filters"
            onAction={() => {
              setQuery("");
              setTypeFilter("All");
            }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((job) => {
              const poster = state.users.find((u) => u.id === job.postedById);
              return (
                <Card key={job.id} className="p-6 justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="saved">{job.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Posted by {poster?.name ?? "ULAB Alumni"}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold font-display">
                      {job.title}
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Briefcase className="w-3.5 h-3.5" />
                        BDT {job.salaryMin.toLocaleString()}–
                        {job.salaryMax.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-end">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="accent" size="sm">
                        View &amp; apply
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
