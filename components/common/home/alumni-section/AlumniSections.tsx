"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SuccessCard } from "./SuccessCard";
import { useAppStore } from "@/lib/store/AppStore";
import { getAlumniList, getEvents, getJobs } from "@/lib/services/people";

export function AlumniSections() {
  const { state } = useAppStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const alumniList = getAlumniList(state);
  const jobsCount = getJobs(state).length;
  const eventsCount = getEvents(state).length;

  useEffect(() => {
    if (alumniList.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % alumniList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [alumniList.length]);

  if (alumniList.length === 0) return null;

  const getCardProps = (index: number) => {
    const a = alumniList[index];
    return {
      id: a.id,
      name: a.name,
      role: a.currentRole,
      company: a.company,
      image: a.avatar || "/avater-2.jpg",
      testimonial: a.journey,
      batch: a.batch || "191",
      impact: a.expertise[0] || a.department || "Mentorship",
    };
  };

  return (
    <section className="w-full bg-linear-to-b from-background to-muted/40 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-foreground" />
            <span className="text-sm font-semibold text-amber-700">
              ULAB Alumni Mentor Network
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Learn Directly From ULAB Graduates
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Connect with {alumniList.length} verified ULAB alumni across
            Dhaka&apos;s software, media, business, and development sectors.
          </p>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-linear-to-br from-primary/20 via-secondary/10 to-background border border-primary/20 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Award className="w-6 h-6 text-foreground" />
                </div>
                How Alumni Support ULAB Students
              </h3>
              <ul className="space-y-4">
                {[
                  "1-on-1 mentorship requests for career, thesis, and portfolio reviews",
                  "Verified Dhaka & remote job and internship postings in BDT",
                  "Campus mock technical interviews and design critique nights",
                  "Department-specific advice across CSE, BBA, MSJ, English & Bangla",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/25 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-linear-to-tl from-secondary/5 to-primary/20 border border-primary/20 rounded-2xl p-8 flex flex-col justify-center">
              <p className="text-foreground/75 mb-6 leading-relaxed">
                Our alumni community bridges the gap between ULAB classrooms and
                real careers in Bangladesh.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/70 rounded-xl border border-primary/20">
                  <span className="text-foreground/70 font-medium">
                    Active Alumni Mentors
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {alumniList.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background/70 rounded-xl border border-primary/20">
                  <span className="text-foreground/70 font-medium">
                    Open Alumni Job Listings
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {jobsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background/70 rounded-xl border border-primary/20">
                  <span className="text-foreground/70 font-medium">
                    Upcoming Campus Events
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {eventsCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-12">
          <div className="flex items-center justify-center overflow-hidden">
            <div className="flex gap-4 justify-center items-center w-full max-w-6xl px-4">
              <div className="hidden lg:block w-1/4 flex-shrink-0">
                <SuccessCard
                  {...getCardProps(
                    (activeSlide - 1 + alumniList.length) % alumniList.length
                  )}
                  isActive={false}
                />
              </div>

              <div className="w-full lg:w-1/2 flex-shrink-0">
                <SuccessCard {...getCardProps(activeSlide)} isActive={true} />
              </div>

              <div className="hidden lg:block w-1/4 flex-shrink-0">
                <SuccessCard
                  {...getCardProps((activeSlide + 1) % alumniList.length)}
                  isActive={false}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveSlide(
                (prev) => (prev - 1 + alumniList.length) % alumniList.length
              )
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous alumni story"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSlide((prev) => (prev + 1) % alumniList.length)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next alumni story"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 mt-6">
            {alumniList.map((a, index) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === activeSlide
                    ? "bg-primary w-8 h-3 shadow"
                    : "bg-gray-300 w-3 h-3 hover:bg-gray-400"
                }`}
                aria-label={`View alumni ${a.name}`}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-r from-primary/15 via-secondary/10 to-primary/15 p-10 lg:p-14">
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Connect With ULAB Alumni?
            </h3>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl">
              Explore mentor profiles, request 1-on-1 guidance, or apply to
              internships and full-time roles posted by graduates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link href="/alumni">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-full font-semibold flex items-center justify-center gap-2 text-base w-full sm:w-auto">
                  Browse Alumni Mentors
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  variant="outline"
                  className="px-8 py-6 rounded-full font-semibold bg-background hover:bg-muted border-primary/40 text-base w-full sm:w-auto"
                >
                  Explore Job Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
