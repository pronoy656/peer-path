"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  Check,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Trash2,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import DashboardShell, {
  type DashboardNavItem,
} from "@/components/dashboard/DashboardShell";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/AppStore";
import { getAlumniById } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/types";

export default function AlumniDashboardPage() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState("overview");

  const alumniId = currentUser?.id ?? "u-alumni-1";
  const profile = getAlumniById(state, alumniId);

  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "job" | "event";
    id: string;
  } | null>(null);

  // Job form
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState(profile?.company ?? "");
  const [jobLocation, setJobLocation] = useState("Dhaka");
  const [jobSalaryMin, setJobSalaryMin] = useState("30000");
  const [jobSalaryMax, setJobSalaryMax] = useState("50000");
  const [jobType, setJobType] = useState<Job["type"]>("Full-time");
  const [jobDesc, setJobDesc] = useState("");

  // Event form
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDesc, setEvtDesc] = useState("");
  const [evtDate, setEvtDate] = useState("2026-12-28T15:00");
  const [evtLocation, setEvtLocation] = useState("ULAB Permanent Campus");

  // Profile form
  const [currentRole, setCurrentRole] = useState(profile?.currentRole ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [expertiseInput, setExpertiseInput] = useState(
    (profile?.expertise ?? []).join(", ")
  );
  const [availability, setAvailability] = useState<"Available" | "Limited">(
    profile?.availability ?? "Available"
  );

  const incomingRequests = state.mentorships.filter(
    (m) => m.alumniId === alumniId && m.status === "pending"
  );
  const myMentees = state.mentorships.filter(
    (m) => m.alumniId === alumniId && m.status === "accepted"
  );
  const myJobs = state.jobs.filter((j) => j.postedById === alumniId);
  const myEvents = state.events.filter((e) => e.organizerId === alumniId);

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "requests", label: "Mentorship Requests", icon: <UserCheck className="w-4 h-4" />, badge: incomingRequests.length },
    { id: "mentees", label: "My Mentees", icon: <Users className="w-4 h-4" />, badge: myMentees.length },
    { id: "jobs", label: "My Jobs", icon: <Briefcase className="w-4 h-4" />, badge: myJobs.length },
    { id: "events", label: "My Events", icon: <Calendar className="w-4 h-4" />, badge: myEvents.length },
    { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "profile", label: "Mentor Profile", icon: <User className="w-4 h-4" /> },
  ];

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobCompany.trim()) return;
    dispatch({
      type: "ADD_JOB",
      job: {
        id: `job-${Date.now()}`,
        title: jobTitle.trim(),
        company: jobCompany.trim(),
        location: jobLocation.trim() || "Dhaka",
        salaryMin: Number(jobSalaryMin) || 25000,
        salaryMax: Number(jobSalaryMax) || 45000,
        type: jobType,
        description: jobDesc.trim(),
        postedById: alumniId,
        postedAt: new Date().toISOString(),
        status: "open",
        applicants: [],
      },
    });
    setJobTitle("");
    setJobDesc("");
    showToast("Job posted to public Alumni Job Board!");
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;
    dispatch({
      type: "ADD_EVENT",
      event: {
        id: `evt-${Date.now()}`,
        title: evtTitle.trim(),
        description: evtDesc.trim(),
        date: new Date(evtDate).toISOString(),
        location: evtLocation.trim() || "ULAB Campus",
        organizerId: alumniId,
        attendees: [],
      },
    });
    setEvtTitle("");
    setEvtDesc("");
    showToast("Event published to Campus Events!");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_ALUMNI_PROFILE",
      alumniId,
      patch: {
        currentRole: currentRole.trim(),
        company: company.trim(),
        bio: bio.trim(),
        expertise: expertiseInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        availability,
      },
    });
    showToast("Mentor profile updated!");
  };

  return (
    <DashboardShell
      allowedRole="alumni"
      roleTitle="Alumni Mentor Portal"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={(tab) => {
        if (tab === "profile" && profile) {
          setCurrentRole(profile.currentRole);
          setCompany(profile.company);
          setBio(profile.bio ?? "");
          setExpertiseInput(profile.expertise.join(", "));
          setAvailability(profile.availability);
        }
        setActiveTab(tab);
      }}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Mentorship requests"
              value={incomingRequests.length}
              hint={incomingRequests.length > 0 ? "Pending reply" : "All handled"}
              hintTone={incomingRequests.length > 0 ? "danger" : "success"}
              icon={<UserCheck className="w-5 h-5" />}
            />
            <StatCard
              label="Active mentees"
              value={myMentees.length}
              hint="1-on-1 guidance"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Posted jobs"
              value={myJobs.length}
              hint="BDT roles live"
              icon={<Briefcase className="w-5 h-5" />}
            />
            <StatCard
              label="My events"
              value={myEvents.length}
              hint="142 profile views"
              hintTone="success"
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">
                  Needs attention · Requests
                </h2>
                <Button
                  size="sm"
                  variant="accent"
                  onClick={() => setActiveTab("requests")}
                >
                  Review all
                </Button>
              </div>
              {incomingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending requests right now.
                </p>
              ) : (
                incomingRequests.map((req) => {
                  const stu = state.users.find((u) => u.id === req.studentId);
                  return (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border border-border"
                    >
                      <p className="font-semibold text-sm">
                        {stu?.name ?? "ULAB Student"} ({stu?.department} · Batch{" "}
                        {stu?.batch})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {req.message}
                      </p>
                    </div>
                  );
                })
              )}
            </Card>

            <Card className="p-6 gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">
                  Job applicants summary
                </h2>
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Public job board →
                </Link>
              </div>
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-border flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.company} · BDT {job.salaryMin.toLocaleString()}–
                      {job.salaryMax.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="saved">
                    {job.applicants.length} applicant(s)
                  </Badge>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="font-semibold text-lg">No pending mentorship requests</p>
            </Card>
          ) : (
            incomingRequests.map((req) => {
              const stu = state.users.find((u) => u.id === req.studentId);
              return (
                <Card key={req.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg">
                        {stu?.name ?? "ULAB Student"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {stu?.department} • Batch {stu?.batch} • {stu?.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        onClick={() => {
                          dispatch({
                            type: "RESPOND_MENTORSHIP",
                            mentorshipId: req.id,
                            status: "accepted",
                          });
                          dispatch({
                            type: "ADD_NOTIFICATION",
                            notification: {
                              id: `notif-${Date.now()}`,
                              userId: req.studentId,
                              title: "Mentorship Request Accepted!",
                              body: `${currentUser?.name} accepted your mentorship request.`,
                              read: false,
                              createdAt: new Date().toISOString(),
                              link: "/dashboard/student",
                            },
                          });
                          showToast(`Accepted ${stu?.name} as your mentee!`);
                        }}
                      >
                        <Check className="w-4 h-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 gap-1"
                        onClick={() => {
                          dispatch({
                            type: "RESPOND_MENTORSHIP",
                            mentorshipId: req.id,
                            status: "declined",
                          });
                          showToast("Request declined.", "info");
                        }}
                      >
                        <X className="w-4 h-4" /> Decline
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/85">{req.message}</p>
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === "mentees" && (
        <div className="space-y-4">
          {myMentees.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="font-semibold text-lg">No active mentees yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Accept incoming mentorship requests to start coaching students.
              </p>
            </Card>
          ) : (
            myMentees.map((m) => {
              const stu = state.users.find((u) => u.id === m.studentId);
              const noteValue =
                notesDraft[m.id] !== undefined
                  ? notesDraft[m.id]
                  : m.notes ?? "";
              return (
                <Card key={m.id} className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg">
                        {stu?.name ?? "ULAB Student"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {stu?.department} • Batch {stu?.batch} • {stu?.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab("messages")}
                    >
                      Message Mentee
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Private Mentor Progress Notes
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noteValue}
                        onChange={(e) =>
                          setNotesDraft((prev) => ({
                            ...prev,
                            [m.id]: e.target.value,
                          }))
                        }
                        placeholder="Add session notes or action items..."
                        className="flex-1 px-3 py-2 border rounded-xl text-sm"
                      />
                      <Button
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                        onClick={() => {
                          dispatch({
                            type: "UPDATE_MENTORSHIP_NOTES",
                            mentorshipId: m.id,
                            notes: noteValue,
                          });
                          showToast("Mentee progress notes saved!");
                        }}
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Post a Job (BDT)
            </h2>
            <form onSubmit={handlePostJob} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Frontend Engineer"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as Job["type"])}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Min Salary (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={jobSalaryMin}
                    onChange={(e) => setJobSalaryMin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Max Salary (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={jobSalaryMax}
                    onChange={(e) => setJobSalaryMax(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Role requirements and how ULAB grads fit..."
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              >
                Publish Job
              </Button>
            </form>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {myJobs.map((job) => (
              <Card key={job.id} className="p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-100 text-amber-900">
                        {job.type}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          job.status === "open"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mt-1">{job.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {job.company} • {job.location} • BDT{" "}
                      {job.salaryMin.toLocaleString()}–
                      {job.salaryMax.toLocaleString()}/mo
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        dispatch({
                          type: "UPDATE_JOB",
                          jobId: job.id,
                          patch: {
                            status: job.status === "open" ? "closed" : "open",
                          },
                        });
                        showToast(
                          job.status === "open"
                            ? "Job marked closed."
                            : "Job reopened.",
                          "info"
                        );
                      }}
                    >
                      {job.status === "open" ? "Close Job" : "Reopen"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() =>
                        setDeleteTarget({ type: "job", id: job.id })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold mb-2">
                    Applicants ({job.applicants.length})
                  </p>
                  {job.applicants.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No applications yet.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {job.applicants.map((app) => {
                        const applicant = state.users.find(
                          (u) => u.id === app.userId
                        );
                        return (
                          <div
                            key={app.userId}
                            className="text-xs p-2 rounded-lg bg-muted/50 flex justify-between"
                          >
                            <span className="font-semibold">
                              {applicant?.name ?? "Applicant"} (
                              {applicant?.department ?? "ULAB"})
                            </span>
                            <span className="text-muted-foreground">
                              Applied{" "}
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Create Campus Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  placeholder="e.g. Dhaka Fintech Career AMA"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={evtDate}
                  onChange={(e) => setEvtDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={evtLocation}
                  onChange={(e) => setEvtLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={evtDesc}
                  onChange={(e) => setEvtDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              >
                Publish Event
              </Button>
            </form>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {myEvents.map((ev) => (
              <Card key={ev.id} className="p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-primary">
                      {new Date(ev.date).toLocaleString()} • {ev.location}
                    </p>
                    <h3 className="font-bold text-lg">{ev.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {ev.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() =>
                      setDeleteTarget({ type: "event", id: ev.id })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold mb-1.5">
                    RSVPs ({ev.attendees.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ev.attendees.map((uid) => {
                      const u = state.users.find((x) => x.id === uid);
                      return (
                        <span
                          key={uid}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-muted font-medium"
                        >
                          {u?.name ?? "Student"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "messages" && <MessagesPanel />}

      {activeTab === "profile" && (
        <Card className="p-6 max-w-2xl">
          <h2 className="text-lg font-bold mb-4">Edit Mentor Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Role
                </label>
                <input
                  type="text"
                  required
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value as "Available" | "Limited")
                }
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm bg-background"
              >
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Expertise (comma-separated)
              </label>
              <input
                type="text"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              >
                Save Mentor Profile
              </Button>
              <Link href={`/alumni/${alumniId}`}>
                <Button type="button" variant="outline">
                  View Public Profile
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Remove ${deleteTarget?.type ?? "item"}?`}
        description="This removes it from the public Alumni listings."
        confirmLabel="Remove"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget?.type === "job") {
            dispatch({ type: "DELETE_JOB", jobId: deleteTarget.id });
            showToast("Job listing removed.", "info");
          } else if (deleteTarget?.type === "event") {
            dispatch({ type: "DELETE_EVENT", eventId: deleteTarget.id });
            showToast("Event cancelled.", "info");
          }
          setDeleteTarget(null);
        }}
      />
    </DashboardShell>
  );
}
