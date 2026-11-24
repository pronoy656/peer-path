"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Search } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getJobs } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="rounded-2xl bg-yellow-400 p-8 sm:p-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-3">
            Alumni Job Board
          </h1>
          <p className="text-slate-900/80 text-lg max-w-2xl">
            Internships, fellowships, and full-time openings across Dhaka and
            Bangladesh shared by ULAB alumni.
          </p>
        </div>

        <Card className="p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by job title, company, or Dhaka location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["All", "Full-time", "Internship", "Part-time"] as const).map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    typeFilter === type
                      ? "bg-slate-900 text-white"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </Card>

        {filtered.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="font-semibold text-lg">No jobs match your filters</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Try clearing your search or selecting All job types.
            </p>
            <Button
              onClick={() => {
                setQuery("");
                setTypeFilter("All");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((job) => {
              const poster = state.users.find((u) => u.id === job.postedById);
              return (
                <Card
                  key={job.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-yellow-400"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-amber-900 text-xs font-semibold">
                        {job.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Posted by {poster?.name ?? "ULAB Alumni"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <p className="text-sm font-medium text-muted-foreground">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Briefcase className="w-4 h-4 text-primary" />
                        BDT {job.salaryMin.toLocaleString()} –{" "}
                        {job.salaryMax.toLocaleString()}/month
                      </span>
                    </div>
                  </div>

                  <Link href={`/jobs/${job.id}`} className="shrink-0">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full sm:w-auto">
                      View &amp; Apply
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
