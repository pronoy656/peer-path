"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Search,
  Send,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getAlumniList,
  getEvents,
  getJobs,
  requestMentorship,
} from "@/lib/services/people";
import type { AlumniProfile } from "@/lib/types";

const DEPARTMENTS = ["All", "CSE", "BBA", "MSJ", "English", "Bangla"];

export default function AllAlumniSection() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [mentorshipTarget, setMentorshipTarget] =
    useState<AlumniProfile | null>(null);
  const [mentorshipMsg, setMentorshipMsg] = useState("");

  const mentors = getAlumniList(state);
  const jobs = getJobs(state).filter((j) => j.status === "open");
  const events = getEvents(state);

  const filtered = mentors.filter((mentor) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      mentor.name.toLowerCase().includes(q) ||
      mentor.currentRole.toLowerCase().includes(q) ||
      mentor.company.toLowerCase().includes(q) ||
      mentor.expertise.some((e) => e.toLowerCase().includes(q));
    const matchesDepartment =
      selectedDepartment === "All" || mentor.department === selectedDepartment;
    const matchesAvail =
      !onlyAvailable || mentor.availability === "Available";
    return matchesSearch && matchesDepartment && matchesAvail;
  });

  const handleRequestMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorshipTarget) return;
    if (!currentUser) {
      showToast("Please sign in to request alumni mentorship.", "info");
      setMentorshipTarget(null);
      router.push("/signIn");
      return;
    }
    const res = requestMentorship(state, dispatch, {
      studentId: currentUser.id,
      alumniId: mentorshipTarget.id,
      message:
        mentorshipMsg.trim() ||
        "Hi! I would appreciate your mentorship and career guidance.",
    });
    showToast(res.message, res.ok ? "success" : "info");
    setMentorshipMsg("");
    setMentorshipTarget(null);
  };

  const handleRsvp = (eventId: string, title: string) => {
    if (!currentUser) {
      showToast("Please sign in to RSVP for campus events.", "info");
      router.push("/signIn");
      return;
    }
    const event = events.find((e) => e.id === eventId);
    const alreadyGoing = event?.attendees.includes(currentUser.id) ?? false;
    dispatch({ type: "TOGGLE_EVENT_RSVP", eventId, userId: currentUser.id });
    showToast(
      alreadyGoing
        ? `Cancelled RSVP for ${title}`
        : `RSVP confirmed for ${title}!`,
      alreadyGoing ? "info" : "success"
    );
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Alumni directory
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            ULAB alumni mentors &amp; opportunities
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {mentors.length} ULAB graduates sharing mentorship, {jobs.length}{" "}
            open Dhaka roles, and {events.length} upcoming campus events.
          </p>
        </div>
      </section>

      <section className="bg-card border-b border-border py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search mentors by name, company, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-border rounded-lg bg-card text-sm text-foreground"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`h-9 px-4 rounded-full text-xs font-semibold border transition-colors ${
                onlyAvailable
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              Available mentors only
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((dept) => {
              const selected = selectedDepartment === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDepartment(dept)}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {dept === "All" ? "All Depts" : dept}
                </button>
              );
            })}
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Showing {filtered.length} of {mentors.length} mentors
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No mentors matched"
            description="Try clearing your search or selecting All Departments."
            actionLabel="Reset filters"
            onAction={() => {
              setSearchTerm("");
              setSelectedDepartment("All");
              setOnlyAvailable(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4 h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <Avatar
                      src={mentor.avatar}
                      name={mentor.name}
                      size="md"
                      department={mentor.department}
                      avatarColor={mentor.avatarColor}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-semibold text-base text-foreground truncate">
                        {mentor.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {mentor.currentRole} · {mentor.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge department={mentor.department}>
                          {mentor.department}
                        </Badge>
                        <Badge
                          variant={
                            mentor.availability === "Available"
                              ? "enrolled"
                              : "pending"
                          }
                        >
                          {mentor.availability}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                          {mentor.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {mentor.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMentorshipTarget(mentor)}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Mentorship
                  </Button>
                  <Link href={`/alumni/${mentor.id}`}>
                    <Button variant="default" size="sm" className="w-full">
                      View profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Job Board Preview */}
      <section className="py-12 bg-card border-y border-border px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Opportunities
              </p>
              <h2 className="text-2xl font-bold font-display text-foreground">
                Alumni job board
              </h2>
            </div>
            <Link href="/jobs">
              <Button variant="outline" size="sm">
                View all jobs ({jobs.length})
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <Card key={job.id} className="p-5 gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="saved">{job.type}</Badge>
                    <h3 className="font-display font-semibold text-base mt-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="accent" size="sm">
                      Apply
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Campus calendar
            </p>
            <h2 className="text-2xl font-bold font-display text-foreground">
              Upcoming events
            </h2>
          </div>
          <Link href="/events">
            <Button variant="outline" size="sm">
              All events ({events.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.map((event) => {
            const isGoing = currentUser
              ? event.attendees.includes(currentUser.id)
              : false;
            return (
              <Card key={event.id} className="p-5 justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span>{event.attendees.length} going</span>
                  </div>
                  <h3 className="font-display font-semibold text-base text-foreground">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant={isGoing ? "secondary" : "default"}
                  onClick={() => handleRsvp(event.id, event.title)}
                  className="w-full"
                >
                  {isGoing ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-success" />{" "}
                      Attending (Cancel)
                    </>
                  ) : (
                    "RSVP for event"
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Request Mentorship Modal */}
      {mentorshipTarget && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setMentorshipTarget(null)}
        >
          <Card
            className="w-full max-w-md p-6 gap-4 shadow-[var(--shadow-modal)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Request mentorship from ${mentorshipTarget.name}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display">
                  Request mentorship
                </h3>
                <p className="text-xs text-muted-foreground">
                  To: {mentorshipTarget.name} ({mentorshipTarget.company})
                </p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setMentorshipTarget(null)}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRequestMentorship} className="space-y-4">
              <div>
                <label
                  htmlFor="mentorship-msg"
                  className="block text-sm font-medium mb-1.5"
                >
                  Your goals or questions
                </label>
                <textarea
                  id="mentorship-msg"
                  required
                  rows={4}
                  value={mentorshipMsg}
                  onChange={(e) => setMentorshipMsg(e.target.value)}
                  placeholder="Share your semester, interests, and what advice you're looking for..."
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none"
                />
              </div>

              <div className="flex gap-2.5 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMentorshipTarget(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent">
                  <Send className="w-4 h-4" />
                  Send request
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
