"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookMarked,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Compass,
  LayoutDashboard,
  MessageSquare,
  RotateCcw,
  Settings,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import DashboardShell, {
  type DashboardNavItem,
} from "@/components/dashboard/DashboardShell";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import { useAppStore } from "@/lib/store/AppStore";
import {
  advanceProgress,
  enroll,
  getMyEnrollments,
  getPreferences,
  getSavedCourses,
  toggleSaveCourse,
  unenroll,
} from "@/lib/services/enrollment";
import {
  getInstructorForCourse,
  getRecommendedCourses,
} from "@/lib/services/courses";
import { getPosts } from "@/lib/services/community";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/lib/services/notifications";
import { getEvents } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Department } from "@/lib/types";

export default function StudentDashboardPage() {
  const { state, dispatch, currentUser, showToast, resetDemoData } =
    useAppStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [unenrollTarget, setUnenrollTarget] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Profile form state synced lazily when editing
  const [nameInput, setNameInput] = useState(currentUser?.name ?? "");
  const [bioInput, setBioInput] = useState(currentUser?.bio ?? "");
  const [deptInput, setDeptInput] = useState<Department>(
    currentUser?.department ?? "CSE"
  );
  const [batchInput, setBatchInput] = useState(currentUser?.batch ?? "241");
  const [interestsInput, setInterestsInput] = useState(
    (currentUser?.interests ?? []).join(", ")
  );
  const [avatarColor, setAvatarColor] = useState(
    currentUser?.avatarColor ?? "#eab308"
  );

  const userId = currentUser?.id ?? "u-student-1";
  const enrollments = getMyEnrollments(state, userId);
  const savedCourses = getSavedCourses(state, userId);
  const prefs = getPreferences(state, userId);
  const recommended = getRecommendedCourses(state, {
    department: currentUser?.department ?? prefs.department,
    semester: prefs.semester,
    courseLevel: prefs.courseLevel,
    userId,
  });
  const notifications = getNotifications(state, userId);
  const unreadCount = getUnreadCount(state, userId);
  const rsvpEvents = getEvents(state).filter((e) =>
    e.attendees.includes(userId)
  );
  const recentPosts = getPosts(state).slice(0, 3);
  const totalCredits = enrollments.reduce(
    (sum, item) => sum + item.course.credits,
    0
  );

  const myAssignments = state.assignments.filter(
    (a) =>
      enrollments.some((e) => e.courseId === a.courseId) ||
      a.batch === currentUser?.batch
  );

  const incomingRequests = state.connections.filter(
    (c) => c.toUserId === userId && c.status === "pending"
  );
  const sentRequests = state.connections.filter(
    (c) => c.fromUserId === userId && c.status === "pending"
  );
  const acceptedConnections = state.connections.filter(
    (c) =>
      c.status === "accepted" &&
      (c.fromUserId === userId || c.toUserId === userId)
  );

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "courses", label: "My Courses", icon: <BookOpen className="w-4 h-4" />, badge: enrollments.length },
    { id: "discover", label: "Recommendations", icon: <Sparkles className="w-4 h-4" /> },
    { id: "saved", label: "Saved Courses", icon: <BookMarked className="w-4 h-4" />, badge: savedCourses.length },
    { id: "connections", label: "My Connections", icon: <Users className="w-4 h-4" />, badge: incomingRequests.length },
    { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" />, badge: unreadCount },
    { id: "settings", label: "Profile & Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    dispatch({
      type: "UPDATE_USER",
      userId: currentUser.id,
      patch: {
        name: nameInput.trim() || currentUser.name,
        bio: bioInput.trim(),
        department: deptInput,
        batch: batchInput.trim() || "241",
        interests: interestsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        avatarColor,
      },
    });
    showToast("Profile updated successfully!");
  };

  return (
    <DashboardShell
      allowedRole="student"
      roleTitle="Student Portal"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={(tab) => {
        if (tab === "settings" && currentUser) {
          setNameInput(currentUser.name);
          setBioInput(currentUser.bio ?? "");
          setDeptInput(currentUser.department ?? "CSE");
          setBatchInput(currentUser.batch ?? "241");
          setInterestsInput((currentUser.interests ?? []).join(", "));
          setAvatarColor(currentUser.avatarColor ?? "#eab308");
        }
        setActiveTab(tab);
      }}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Enrolled Courses</p>
              <p className="text-3xl font-bold mt-1">{enrollments.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Semester Credits</p>
              <p className="text-3xl font-bold mt-1">{totalCredits} / 14</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Upcoming RSVPs</p>
              <p className="text-3xl font-bold mt-1">{rsvpEvents.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Unread Alerts</p>
              <p className="text-3xl font-bold mt-1 text-amber-600">
                {unreadCount}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Recommended For You</h2>
                <Link
                  href="/discover"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Open Discover →
                </Link>
              </div>
              <div className="space-y-3">
                {recommended.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primary">
                        {course.code} • {course.credits} Cr
                      </p>
                      <p className="font-semibold text-sm truncate">
                        {course.title}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold shrink-0"
                      onClick={() => {
                        const res = enroll(state, dispatch, userId, course.id);
                        showToast(res.message, res.ok ? "success" : "info");
                      }}
                    >
                      Enroll
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Upcoming RSVP&apos;d Events</h2>
                <Link
                  href="/events"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  All Events →
                </Link>
              </div>
              {rsvpEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No event RSVPs yet. Explore{" "}
                  <Link href="/events" className="underline font-semibold">
                    Campus Events
                  </Link>
                  .
                </p>
              ) : (
                <div className="space-y-3">
                  {rsvpEvents.map((ev) => (
                    <div key={ev.id} className="p-3.5 rounded-xl border">
                      <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ev.date).toLocaleDateString()}
                      </p>
                      <p className="font-semibold text-sm mt-1">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {ev.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Recent Community Activity</h2>
              <Link
                href="/community"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Visit Community →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-xl border bg-background">
                  <p className="text-xs font-bold text-primary">
                    {post.group || "General"} • {post.author?.name ?? "ULAB Peer"}
                  </p>
                  <p className="text-sm mt-1.5 line-clamp-3 text-foreground/85">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="space-y-6">
          {enrollments.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h2 className="text-lg font-bold">No enrolled courses yet</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                Use Discover to pick your ULAB semester courses.
              </p>
              <Link href="/discover">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold gap-2">
                  <Compass className="w-4 h-4" /> Go to Discover
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrollments.map(({ course, progress }) => {
                const instructor = getInstructorForCourse(state, course);
                return (
                  <Card key={course.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-primary">
                          {course.code} • {course.credits} Credits
                        </span>
                        <h3 className="text-lg font-bold mt-0.5">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {instructor?.name ?? "ULAB Faculty"}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-amber-900">
                        {progress}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        disabled={progress >= 100}
                        onClick={() => {
                          advanceProgress(dispatch, userId, course.id);
                          showToast(`Completed a lesson in ${course.code}!`);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                      >
                        {progress >= 100
                          ? "Completed!"
                          : "Mark lesson complete"}
                      </Button>
                      <Link href={`/courses/${course.id}`}>
                        <Button size="sm" variant="outline">
                          Continue
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 ml-auto"
                        onClick={() => setUnenrollTarget(course.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Unenroll
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {myAssignments.length > 0 && (
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Class Assignments</h2>
              <div className="space-y-3">
                {myAssignments.map((asg) => {
                  const submitted = asg.submissions.some(
                    (s) => s.studentId === userId
                  );
                  return (
                    <div
                      key={asg.id}
                      className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold">{asg.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {asg.dueDate} • {asg.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        disabled={submitted}
                        onClick={() => {
                          dispatch({
                            type: "SUBMIT_ASSIGNMENT",
                            assignmentId: asg.id,
                            studentId: userId,
                          });
                          showToast(`Submitted ${asg.title}!`);
                        }}
                        variant={submitted ? "secondary" : "default"}
                      >
                        {submitted ? "Submitted ✓" : "Submit Assignment"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "discover" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Personalized Course Recommendations
              </h2>
              <p className="text-sm text-muted-foreground">
                Tailored to {currentUser?.department ?? prefs.department}{" "}
                department, semester progression, and peer ratings.
              </p>
            </div>
            <Link href="/discover">
              <Button variant="outline">Open Full Discover Planner</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommended.map((course) => {
              const instructor = getInstructorForCourse(state, course);
              const isSaved = savedCourses.some((s) => s.id === course.id);
              return (
                <Card key={course.id} className="p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">
                        {course.code} • {course.department}
                      </span>
                      <span className="text-muted-foreground">
                        Sem {course.semester} • {course.credits} Cr
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {instructor?.name ?? "ULAB Faculty"}
                    </p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                      onClick={() => {
                        const res = enroll(state, dispatch, userId, course.id);
                        showToast(res.message, res.ok ? "success" : "info");
                      }}
                    >
                      Enroll Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const saved = toggleSaveCourse(
                          state,
                          dispatch,
                          userId,
                          course.id
                        );
                        showToast(
                          saved
                            ? `Saved ${course.code}`
                            : `Removed ${course.code} from saved`,
                          "info"
                        );
                      }}
                    >
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Link href={`/courses/${course.id}`}>
                      <Button size="sm" variant="ghost">
                        Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedCourses.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="font-semibold text-lg">No saved courses</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Bookmark courses from Discover or the Course Catalog to review
                later.
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCourses.map((course) => (
                <Card
                  key={course.id}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-bold text-primary">
                      {course.code} • {course.credits} Credits
                    </p>
                    <Link
                      href={`/courses/${course.id}`}
                      className="font-bold text-base hover:underline"
                    >
                      {course.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {course.department} • Sem {course.semester}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                      onClick={() => {
                        const res = enroll(state, dispatch, userId, course.id);
                        showToast(res.message, res.ok ? "success" : "info");
                      }}
                    >
                      Enroll
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toggleSaveCourse(state, dispatch, userId, course.id);
                        showToast(`Removed ${course.code} from saved`, "info");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "connections" && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">
              Incoming Connection Requests ({incomingRequests.length})
            </h2>
            {incomingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending requests right now.
              </p>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((req) => {
                  const sender = state.users.find(
                    (u) => u.id === req.fromUserId
                  );
                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold">
                          {sender?.name ?? "ULAB Student"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sender?.department} • Batch {sender?.batch}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                          onClick={() => {
                            dispatch({
                              type: "RESPOND_CONNECTION",
                              connectionId: req.id,
                              status: "accepted",
                            });
                            showToast(`Connected with ${sender?.name}!`);
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
                              type: "RESPOND_CONNECTION",
                              connectionId: req.id,
                              status: "declined",
                            });
                            showToast("Connection request declined.", "info");
                          }}
                        >
                          <X className="w-4 h-4" /> Decline
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Connected Peers ({acceptedConnections.length})
              </h2>
              <Link href="/students">
                <Button size="sm" variant="outline">
                  Find More Peers
                </Button>
              </Link>
            </div>
            {acceptedConnections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No connected peers yet. Visit Students directory to connect.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {acceptedConnections.map((conn) => {
                  const peerId =
                    conn.fromUserId === userId
                      ? conn.toUserId
                      : conn.fromUserId;
                  const peer = state.users.find((u) => u.id === peerId);
                  return (
                    <div
                      key={conn.id}
                      className="p-4 rounded-xl border flex items-center justify-between gap-2"
                    >
                      <div>
                        <Link
                          href={`/students/${peerId}`}
                          className="font-semibold hover:underline"
                        >
                          {peer?.name ?? "ULAB Peer"}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {peer?.department} • Batch {peer?.batch}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("messages")}
                      >
                        Message
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            {sentRequests.length > 0 && (
              <p className="text-xs text-muted-foreground pt-2">
                {sentRequests.length} sent request(s) awaiting peer approval.
              </p>
            )}
          </Card>
        </div>
      )}

      {activeTab === "messages" && <MessagesPanel />}

      {activeTab === "notifications" && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              Notifications ({notifications.length})
            </h2>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  markAllAsRead(dispatch, userId);
                  showToast("All notifications marked as read.", "info");
                }}
              >
                Mark all as read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              You have no notifications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                    n.read ? "bg-background" : "bg-yellow-50/70 border-yellow-300"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {n.body}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(dispatch, n.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-lg font-bold mb-4">Edit Student Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  <select
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value as Department)}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm bg-background"
                  >
                    <option value="CSE">CSE</option>
                    <option value="BBA">BBA</option>
                    <option value="MSJ">MSJ</option>
                    <option value="English">English</option>
                    <option value="Bangla">Bangla</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Batch</label>
                  <input
                    type="text"
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Initials Avatar Color
                </label>
                <div className="flex gap-2">
                  {["#eab308", "#38bdf8", "#34d399", "#f472b6", "#a78bfa"].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Select avatar color ${c}`}
                        onClick={() => setAvatarColor(c)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          avatarColor === c
                            ? "border-slate-900 scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              >
                Save Changes
              </Button>
            </form>
          </Card>

          <Card className="p-6 h-fit space-y-4">
            <h2 className="text-lg font-bold">Demo Data</h2>
            <p className="text-sm text-muted-foreground">
              Restore all courses, enrollments, community posts, and demo
              accounts back to the initial ULAB seed state.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 gap-2"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw className="w-4 h-4" />
              Reset demo data
            </Button>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={unenrollTarget !== null}
        title="Unenroll from course?"
        description="Your progress in this course will be removed and a seat will be freed."
        confirmLabel="Unenroll"
        onCancel={() => setUnenrollTarget(null)}
        onConfirm={() => {
          if (unenrollTarget) {
            unenroll(dispatch, userId, unenrollTarget);
            showToast("Unenrolled from course.", "info");
          }
          setUnenrollTarget(null);
        }}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Reset all demo data?"
        description="This clears your localStorage changes and restores the original seed data."
        confirmLabel="Reset Data"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          resetDemoData();
        }}
      />
    </DashboardShell>
  );
}
