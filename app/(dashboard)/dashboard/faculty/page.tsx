"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import DashboardShell, {
  type DashboardNavItem,
} from "@/components/dashboard/DashboardShell";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import { useAppStore } from "@/lib/store/AppStore";
import {
  addCourseMaterial,
  getCourses,
  replyToReview,
} from "@/lib/services/courses";
import { getFacultyById, getFacultyReviews } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CourseMaterial } from "@/lib/types";

export default function FacultyDashboardPage() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [studentQuery, setStudentQuery] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  // Materials form
  const [matCourseId, setMatCourseId] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState<CourseMaterial["type"]>("Slides");
  const [matNote, setMatNote] = useState("");

  const facultyId = currentUser?.id ?? "u-faculty-1";
  const facultyProfile = getFacultyById(state, facultyId);

  const [officeHours, setOfficeHours] = useState(
    facultyProfile?.officeHours ?? ""
  );
  const [bio, setBio] = useState(facultyProfile?.bio ?? "");
  const [researchInput, setResearchInput] = useState(
    (facultyProfile?.researchArea ?? []).join(", ")
  );
  const [methodology, setMethodology] = useState(
    facultyProfile?.methodology ?? ""
  );

  const myCourses = getCourses(state).filter(
    (c) => c.instructorId === facultyId
  );
  const myCourseIds = new Set(myCourses.map((c) => c.id));
  const myEnrollments = state.enrollments.filter((e) =>
    myCourseIds.has(e.courseId)
  );
  const uniqueStudentIds = Array.from(
    new Set(myEnrollments.map((e) => e.userId))
  );
  const myStudents = state.users.filter((u) => uniqueStudentIds.includes(u.id));
  const myReviews = getFacultyReviews(state, facultyId);
  const pendingReplies = myReviews.filter((r) => !r.reply).length;
  const myMessages = state.messages.filter(
    (m) => m.recipientId === facultyId || m.senderId === facultyId
  );
  const myMaterials = state.materials.filter((m) =>
    myCourseIds.has(m.courseId)
  );

  const avgRating =
    myCourses.length > 0
      ? (
          myCourses.reduce((s, c) => s + c.rating, 0) / myCourses.length
        ).toFixed(1)
      : (facultyProfile?.rating ?? 4.8).toFixed(1);

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "courses", label: "My Courses", icon: <BookOpen className="w-4 h-4" />, badge: myCourses.length },
    { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" />, badge: pendingReplies },
    { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "materials", label: "Materials", icon: <FileText className="w-4 h-4" /> },
    { id: "profile", label: "Office Hours & Profile", icon: <Clock className="w-4 h-4" /> },
  ];

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourseId = matCourseId || myCourses[0]?.id;
    if (!targetCourseId || !matTitle.trim()) return;
    addCourseMaterial(dispatch, {
      courseId: targetCourseId,
      title: matTitle.trim(),
      type: matType,
      urlOrNote: matNote.trim() || "Available in ULAB course folder.",
      addedById: facultyId,
    });
    setMatTitle("");
    setMatNote("");
    showToast("Course material published to public course page!");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_FACULTY_PROFILE",
      facultyId,
      patch: {
        officeHours: officeHours.trim(),
        bio: bio.trim(),
        researchArea: researchInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        methodology: methodology.trim(),
      },
    });
    showToast("Faculty profile & office hours updated!");
  };

  const filteredStudents = myStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
      (s.studentId?.toLowerCase().includes(studentQuery.toLowerCase()) ?? false)
  );

  return (
    <DashboardShell
      allowedRole="faculty"
      roleTitle="Faculty Portal"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={(tab) => {
        if (tab === "profile" && facultyProfile) {
          setOfficeHours(facultyProfile.officeHours);
          setBio(facultyProfile.bio ?? "");
          setResearchInput(facultyProfile.researchArea.join(", "));
          setMethodology(facultyProfile.methodology);
        }
        setActiveTab(tab);
      }}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">My Courses</p>
              <p className="text-3xl font-bold mt-1">{myCourses.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold mt-1">{myStudents.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Average Rating</p>
              <p className="text-3xl font-bold mt-1">{avgRating} ★</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Pending Replies</p>
              <p className="text-3xl font-bold mt-1 text-amber-600">
                {pendingReplies}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Courses You Teach</h2>
                <Link
                  href={`/faculty/${facultyId}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Public Profile →
                </Link>
              </div>
              <div className="space-y-3">
                {myCourses.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.id}`}
                    className="block p-3.5 rounded-xl border hover:border-primary transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-primary">
                          {c.code}
                        </p>
                        <p className="font-semibold text-sm">{c.title}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {c.seatsTaken}/{c.seatsTotal} seats
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="font-bold text-lg">Recent Student Messages</h2>
              {myMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No messages yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {myMessages.slice(-4).map((m) => {
                    const sender = state.users.find((u) => u.id === m.senderId);
                    return (
                      <div key={m.id} className="p-3.5 rounded-xl border">
                        <p className="text-xs font-bold text-primary">
                          {sender?.name ?? "Student"}
                          {m.subject ? ` — ${m.subject}` : ""}
                        </p>
                        <p className="text-sm text-foreground/80 mt-1 line-clamp-2">
                          {m.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="space-y-6">
          {myCourses.map((course) => {
            const rosterIds = state.enrollments
              .filter((e) => e.courseId === course.id)
              .map((e) => e.userId);
            const roster = state.users.filter((u) => rosterIds.includes(u.id));
            return (
              <Card key={course.id} className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-primary">
                      {course.code} • {course.department} • Sem {course.semester}
                    </span>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Seats filled: {course.seatsTaken} / {course.seatsTotal} •{" "}
                      {course.schedule}
                    </p>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button variant="outline" size="sm">
                      View Public Course Page
                    </Button>
                  </Link>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Enrolled Roster ({roster.length})
                  </h4>
                  {roster.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No students enrolled locally yet.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {roster.map((stu) => (
                        <div
                          key={stu.id}
                          className="p-2.5 rounded-lg bg-muted/50 text-xs flex items-center justify-between"
                        >
                          <span className="font-semibold">{stu.name}</span>
                          <span className="text-muted-foreground">
                            {stu.studentId || `Batch ${stu.batch}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "students" && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              Students in Your Courses ({filteredStudents.length})
            </h2>
            <input
              type="text"
              placeholder="Search student name or ID..."
              value={studentQuery}
              onChange={(e) => setStudentQuery(e.target.value)}
              className="px-3.5 py-2 border rounded-xl text-sm w-full sm:w-64"
            />
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No matching students found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Student ID</th>
                    <th className="py-2 pr-4">Department</th>
                    <th className="py-2 pr-4">Batch</th>
                    <th className="py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu) => (
                    <tr key={stu.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-semibold">{stu.name}</td>
                      <td className="py-3 pr-4">{stu.studentId ?? "—"}</td>
                      <td className="py-3 pr-4">{stu.department}</td>
                      <td className="py-3 pr-4">{stu.batch}</td>
                      <td className="py-3 text-muted-foreground">{stu.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {myReviews.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <p className="text-muted-foreground">No reviews yet.</p>
            </Card>
          ) : (
            myReviews.map((rev) => {
              const author = state.users.find((u) => u.id === rev.authorId);
              const course =
                rev.targetType === "course"
                  ? state.courses.find((c) => c.id === rev.targetId)
                  : undefined;
              return (
                <Card key={rev.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-primary">
                        {course ? `${course.code}: ${course.title}` : "Faculty Profile Review"}
                      </span>
                      <p className="font-semibold text-sm mt-0.5">
                        {author?.name ?? "ULAB Student"} — {rev.rating}/5 ★
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/85">{rev.content}</p>

                  {rev.reply ? (
                    <div className="rounded-xl bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
                      <span className="font-semibold">Your reply: </span>
                      {rev.reply.content}
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a public reply to this student..."
                        value={replyDrafts[rev.id] ?? ""}
                        onChange={(e) =>
                          setReplyDrafts((prev) => ({
                            ...prev,
                            [rev.id]: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 border rounded-xl text-sm"
                      />
                      <Button
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                        onClick={() => {
                          const text = replyDrafts[rev.id]?.trim();
                          if (!text) return;
                          replyToReview(dispatch, rev.id, facultyId, text);
                          setReplyDrafts((prev) => ({ ...prev, [rev.id]: "" }));
                          showToast("Reply published publicly!");
                        }}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === "messages" && <MessagesPanel />}

      {activeTab === "materials" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add Course Material
            </h2>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  value={matCourseId || myCourses[0]?.id || ""}
                  onChange={(e) => setMatCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm bg-background"
                >
                  {myCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  placeholder="e.g. Week 4 Lecture Slides"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={matType}
                  onChange={(e) =>
                    setMatType(e.target.value as CourseMaterial["type"])
                  }
                  className="w-full px-3 py-2.5 border rounded-xl text-sm bg-background"
                >
                  <option value="Slides">Slides</option>
                  <option value="Lab">Lab</option>
                  <option value="Reading">Reading</option>
                  <option value="Video Link">Video Link</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Link or Note
                </label>
                <textarea
                  rows={3}
                  value={matNote}
                  onChange={(e) => setMatNote(e.target.value)}
                  placeholder="Topic notes or reference link..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              >
                Publish Material
              </Button>
            </form>
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-4">
            <h2 className="text-lg font-bold">
              Published Materials ({myMaterials.length})
            </h2>
            {myMaterials.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No materials added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myMaterials.map((m) => {
                  const course = state.courses.find((c) => c.id === m.courseId);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-bold text-primary">
                          {course?.code} • {m.type}
                        </span>
                        <p className="font-semibold text-sm mt-0.5">{m.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {m.urlOrNote}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => {
                          dispatch({ type: "DELETE_MATERIAL", materialId: m.id });
                          showToast("Material removed.", "info");
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "profile" && (
        <Card className="p-6 max-w-2xl">
          <h2 className="text-lg font-bold mb-4">
            Edit Office Hours &amp; Public Faculty Profile
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Office Hours &amp; Room
              </label>
              <input
                type="text"
                required
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Research Areas (comma-separated)
              </label>
              <input
                type="text"
                value={researchInput}
                onChange={(e) => setResearchInput(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium mb-1">
                Teaching Methodology
              </label>
              <textarea
                rows={3}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              >
                Save Faculty Profile
              </Button>
              <Link href={`/faculty/${facultyId}`}>
                <Button type="button" variant="outline">
                  View Public Profile
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      )}
    </DashboardShell>
  );
}
