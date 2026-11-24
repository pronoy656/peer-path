"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  MessageCircle,
  MapPin,
  Briefcase,
  Search,
  ArrowRight,
  X,
  Calendar,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getAlumniList,
  getEvents,
  getJobs,
  requestMentorship,
} from "@/lib/services/people";
import type { AlumniProfile } from "@/lib/types";

export default function AllAlumniSection() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedExpertise, setSelectedExpertise] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorFilter, setMentorFilter] = useState<"all" | "available">("all");
  const [mentorshipTarget, setMentorshipTarget] =
    useState<AlumniProfile | null>(null);
  const [mentorshipMsg, setMentorshipMsg] = useState("");

  const mentors = getAlumniList(state);
  const jobs = getJobs(state).filter((j) => j.status === "open");
  const events = getEvents(state);

  const departments = ["All", "CSE", "BBA", "MSJ", "English", "Bangla"];

  const expertiseAreas = [
    "All",
    ...Array.from(
      new Set(
        mentors
          .filter(
            (m) =>
              selectedDepartment === "All" ||
              m.department === selectedDepartment
          )
          .flatMap((m) => m.expertise)
      )
    ),
  ];

  const filtered = mentors.filter((mentor) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      mentor.name.toLowerCase().includes(q) ||
      mentor.currentRole.toLowerCase().includes(q) ||
      mentor.company.toLowerCase().includes(q);
    const matchesDepartment =
      selectedDepartment === "All" || mentor.department === selectedDepartment;
    const matchesExpertise =
      selectedExpertise === "All" ||
      mentor.expertise.includes(selectedExpertise);
    const matchesFilter =
      mentorFilter === "all" ||
      (mentorFilter === "available" && mentor.availability === "Available");

    return (
      matchesSearch && matchesDepartment && matchesExpertise && matchesFilter
    );
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-yellow-50">
          <div className="absolute inset-0 z-0">
            <Image
              src="/alumni-together.jpg"
              alt="ULAB Alumni Network"
              fill
              className="h-full w-full object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/55" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                ULAB Alumni Network
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Connect with verified ULAB graduates across Dhaka&apos;s tech,
                business, and media sectors for mentorship, jobs, and campus
                sessions.
              </p>

              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <p className="text-2xl font-bold text-white">
                    {mentors.length}
                  </p>
                  <p className="text-xs sm:text-sm text-white/85">
                    Alumni Mentors
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <p className="text-2xl font-bold text-white">{jobs.length}</p>
                  <p className="text-xs sm:text-sm text-white/85">
                    Open Job Roles
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <p className="text-2xl font-bold text-white">
                    {events.length}
                  </p>
                  <p className="text-xs sm:text-sm text-white/85">
                    Upcoming Events
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mentors Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Find Your Mentor</h2>
            <p className="text-muted-foreground mt-1">
              Filter ULAB alumni by department, expertise, or availability
            </p>
          </div>

          <div className="space-y-4 mb-8 bg-card p-6 rounded-xl border border-yellow-200">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search mentors by name, role, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Department</p>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setSelectedExpertise("All");
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedDepartment === dept
                        ? "bg-yellow-400 text-black shadow-sm"
                        : "bg-yellow-100/70 text-foreground hover:bg-yellow-200"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Expertise Areas</p>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSelectedExpertise(area)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedExpertise === area
                        ? "bg-slate-900 text-white"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setMentorFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mentorFilter === "all"
                    ? "bg-yellow-400 text-black font-semibold"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                All Mentors ({mentors.length})
              </button>
              <button
                type="button"
                onClick={() => setMentorFilter("available")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mentorFilter === "available"
                    ? "bg-yellow-400 text-black font-semibold"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Available Now
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="font-semibold text-lg">No mentors matched</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Try clearing your search or choosing All departments.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("All");
                  setSelectedExpertise("All");
                  setMentorFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((mentor) => (
                <Card
                  key={mentor.id}
                  className="p-6 hover:shadow-lg transition-all flex flex-col border-yellow-200/80"
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <Image
                          src={mentor.avatar || "/avater-1.jpg"}
                          alt={mentor.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover w-12 h-12 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {mentor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {mentor.currentRole} • {mentor.company}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${
                          mentor.availability === "Available"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {mentor.availability}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 bg-yellow-100 text-amber-900 rounded-full font-semibold">
                        {mentor.department} • Batch {mentor.batch}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {mentor.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-sm text-foreground/75 line-clamp-2">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {mentor.expertise.slice(0, 3).map((exp) => (
                        <span
                          key={exp}
                          className="px-2.5 py-1 bg-muted text-foreground text-xs rounded-full font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border mt-4">
                    <Link href={`/alumni/${mentor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      onClick={() => setMentorshipTarget(mentor)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Mentorship
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Job Board Section */}
        <section className="py-16 bg-yellow-50/70 border-y border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold">Alumni Job Board</h2>
                <p className="text-muted-foreground mt-1">
                  Dhaka &amp; remote roles posted by ULAB graduates (salaries in
                  BDT/month)
                </p>
              </div>
              <Link href="/jobs">
                <Button className="gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                  View All Jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="p-6 hover:shadow-md transition-all border-l-4 border-l-yellow-400"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-foreground">
                        {job.title}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="font-semibold text-foreground">
                          BDT {job.salaryMin.toLocaleString()} –{" "}
                          {job.salaryMax.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Link href={`/jobs/${job.id}`}>
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Upcoming Campus Events</h2>
              <p className="text-muted-foreground mt-1">
                Workshops, mock interviews, and advising sessions at ULAB
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" className="gap-2">
                All Events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              const organizer = state.users.find(
                (u) => u.id === event.organizerId
              );
              const isGoing = currentUser
                ? event.attendees.includes(currentUser.id)
                : false;

              return (
                <Card
                  key={event.id}
                  className="p-6 flex flex-col justify-between border-t-4 border-t-yellow-400"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>{event.attendees.length} going</span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Location:
                      </span>{" "}
                      {event.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hosted by {organizer?.name ?? "ULAB Alumni"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant={isGoing ? "secondary" : "default"}
                    onClick={() => handleRsvp(event.id, event.title)}
                    className={`w-full mt-5 ${
                      isGoing
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    }`}
                  >
                    {isGoing ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> RSVP&apos;d (Cancel)
                      </span>
                    ) : (
                      "RSVP Now"
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* Request Mentorship Modal */}
      {mentorshipTarget && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setMentorshipTarget(null)}
        >
          <Card
            className="w-full max-w-md p-6 space-y-4 bg-white"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Request mentorship from ${mentorshipTarget.name}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Request Mentorship</h3>
                <p className="text-sm text-muted-foreground">
                  To: {mentorshipTarget.name} ({mentorshipTarget.company})
                </p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setMentorshipTarget(null)}
                className="p-1.5 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRequestMentorship} className="space-y-4">
              <div>
                <label
                  htmlFor="mentorship-msg"
                  className="block text-sm font-medium mb-1.5"
                >
                  Your Goals / Questions
                </label>
                <textarea
                  id="mentorship-msg"
                  required
                  rows={4}
                  value={mentorshipMsg}
                  onChange={(e) => setMentorshipMsg(e.target.value)}
                  placeholder="Share your semester, interests, and what advice you're looking for..."
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMentorshipTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold gap-2"
                >
                  Send Request <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
