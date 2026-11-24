"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Briefcase, Clock, Mail, Star } from "lucide-react";
import ContactButton from "@/components/faculty/ContactButton";
import ReviewSection from "@/components/faculty/ReviewSection";
import CourseList from "@/components/faculty/CourseList";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses } from "@/lib/services/courses";
import { getFacultyById, getFacultyReviews } from "@/lib/services/people";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FacultyProfilePage() {
  const { id } = useParams();
  const { state } = useAppStore();
  const [activeTab, setActiveTab] = useState<"about" | "courses" | "reviews">(
    "about"
  );

  const faculty = getFacultyById(state, id as string);

  if (!faculty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center bg-background">
        <h1 className="text-3xl font-bold font-display mb-2">
          Faculty member not found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This faculty profile could not be found.
        </p>
        <Link href="/faculty">
          <Button variant="default">Back to faculty directory</Button>
        </Link>
      </div>
    );
  }

  const allCourses = getCourses(state).filter(
    (c) => c.instructorId === faculty.id
  );
  const reviews = getFacultyReviews(state, faculty.id);

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to faculty
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar
                src={faculty.avatar}
                name={faculty.name}
                size="xl"
                department={faculty.department}
                avatarColor={faculty.avatarColor}
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge department={faculty.department}>
                    {faculty.department}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {faculty.title}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  {faculty.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    {faculty.rating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                  <span>·</span>
                  <span>{faculty.experienceYears} years experience</span>
                  <span>·</span>
                  <span>{allCourses.length} courses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="flex gap-2 border-t border-border pt-4">
            {(
              [
                { id: "about", label: "About" },
                { id: "courses", label: `Courses (${allCourses.length})` },
                { id: "reviews", label: `Reviews (${reviews.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {activeTab === "about" && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display mb-2">Biography</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {faculty.bio}
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold font-display mb-2">
                  Teaching methodology
                </h3>
                <p className="text-sm text-foreground/85 border-l-4 border-accent pl-4 py-1 bg-background rounded-r-lg">
                  {faculty.methodology}
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold font-display mb-2">
                  Research areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {faculty.researchArea.map((area) => (
                    <Badge key={area} variant="neutral">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "courses" && (
            <CourseList title="Courses taught" courses={allCourses} />
          )}

          {activeTab === "reviews" && <ReviewSection facultyId={faculty.id} />}
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <Card className="p-6 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-display font-bold text-lg">
              Contact &amp; office hours
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="break-all text-foreground">{faculty.email}</span>
              </div>
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-foreground">{faculty.officeHours}</span>
              </div>
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <Briefcase className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-foreground">
                  {faculty.experienceYears} years teaching
                </span>
              </div>
            </div>
            <ContactButton
              facultyId={faculty.id}
              facultyName={faculty.name}
              facultyEmail={faculty.email}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
}
