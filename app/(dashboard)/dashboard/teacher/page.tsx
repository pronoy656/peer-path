"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Edit3,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import DashboardShell, {
  type DashboardNavItem,
} from "@/components/dashboard/DashboardShell";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import MessagesPanel from "@/components/dashboard/MessagesPanel";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses } from "@/lib/services/courses";
import {
  createAnnouncementAndNotify,
  createAssignment,
  getStudentsList,
  saveAttendanceRecord,
} from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeacherDashboardPage() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState("overview");

  const teacherId = currentUser?.id ?? "u-teacher-1";
  const allStudents = getStudentsList(state);
  const allCourses = getCourses(state);

  const batches = useMemo(
    () =>
      Array.from(
        new Set(allStudents.map((s) => s.batch).filter(Boolean) as string[])
      ).sort(),
    [allStudents]
  );

  const [selectedBatch, setSelectedBatch] = useState(batches[0] ?? "241");
  const [classSearch, setClassSearch] = useState("");
  const [progressSearch, setProgressSearch] = useState("");

  // Attendance state
  const [attBatch, setAttBatch] = useState("241");
  const [attCourseId, setAttCourseId] = useState(allCourses[0]?.id ?? "1");
  const [attDate, setAttDate] = useState("2026-11-24");
  const [presentIds, setPresentIds] = useState<string[]>(() =>
    allStudents.filter((s) => s.batch === "241").map((s) => s.id)
  );

  // Announcements state
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annBatch, setAnnBatch] = useState("241");
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [deleteAnnId, setDeleteAnnId] = useState<string | null>(null);

  // Assignments state
  const [asgTitle, setAsgTitle] = useState("");
  const [asgDesc, setAsgDesc] = useState("");
  const [asgCourseId, setAsgCourseId] = useState(allCourses[0]?.id ?? "1");
  const [asgBatch, setAsgBatch] = useState("241");
  const [asgDue, setAsgDue] = useState("2026-12-15");

  const myAnnouncements = state.announcements.filter(
    (a) => a.teacherId === teacherId && !a.isPlatformWide
  );
  const myAssignments = state.assignments.filter(
    (a) => a.teacherId === teacherId
  );
  const myAttendance = state.attendance.filter(
    (a) => a.teacherId === teacherId
  );

  const attStudents = allStudents.filter((s) => s.batch === attBatch);

  const handleBatchSwitchForAtt = (batch: string) => {
    setAttBatch(batch);
    const existing = state.attendance.find(
      (a) => a.batch === batch && a.courseId === attCourseId && a.date === attDate
    );
    if (existing) {
      setPresentIds(existing.presentIds);
    } else {
      setPresentIds(
        allStudents.filter((s) => s.batch === batch).map((s) => s.id)
      );
    }
  };

  const handleSaveAttendance = () => {
    saveAttendanceRecord(dispatch, {
      teacherId,
      batch: attBatch,
      courseId: attCourseId,
      date: attDate,
      presentIds,
    });
    showToast(
      `Attendance saved for Batch ${attBatch} (${presentIds.length}/${attStudents.length} present).`
    );
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    if (editingAnnId) {
      dispatch({
        type: "UPDATE_ANNOUNCEMENT",
        announcementId: editingAnnId,
        patch: {
          title: annTitle.trim(),
          content: annContent.trim(),
          batch: annBatch,
        },
      });
      setEditingAnnId(null);
      showToast("Announcement updated!");
    } else {
      createAnnouncementAndNotify(state, dispatch, {
        teacherId,
        batch: annBatch,
        title: annTitle.trim(),
        content: annContent.trim(),
      });
      showToast(
        `Announcement posted and sent as notifications to Batch ${annBatch}!`
      );
    }
    setAnnTitle("");
    setAnnContent("");
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;
    createAssignment(state, dispatch, {
      teacherId,
      courseId: asgCourseId,
      batch: asgBatch,
      title: asgTitle.trim(),
      description: asgDesc.trim(),
      dueDate: asgDue,
    });
    setAsgTitle("");
    setAsgDesc("");
    showToast(`Assignment created and Batch ${asgBatch} students notified!`);
  };

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "classes", label: "My Classes", icon: <Users className="w-4 h-4" /> },
    { id: "attendance", label: "Attendance", icon: <CalendarCheck className="w-4 h-4" /> },
    { id: "announcements", label: "Announcements", icon: <Megaphone className="w-4 h-4" />, badge: myAnnouncements.length },
    { id: "assignments", label: "Assignments", icon: <ClipboardList className="w-4 h-4" />, badge: myAssignments.length },
    { id: "progress", label: "Student Progress", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const batchRoster = allStudents.filter(
    (s) =>
      s.batch === selectedBatch &&
      (s.name.toLowerCase().includes(classSearch.toLowerCase()) ||
        (s.studentId?.includes(classSearch) ?? false))
  );

  const progressStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(progressSearch.toLowerCase()) ||
      (s.studentId?.includes(progressSearch) ?? false) ||
      (s.batch?.includes(progressSearch) ?? false)
  );

  return (
    <DashboardShell
      allowedRole="teacher"
      roleTitle="Class Teacher Portal"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Active Batches</p>
              <p className="text-3xl font-bold mt-1">{batches.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold mt-1">{allStudents.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Attendance Logs</p>
              <p className="text-3xl font-bold mt-1">{myAttendance.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Active Assignments</p>
              <p className="text-3xl font-bold mt-1">{myAssignments.length}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Recent Attendance Snapshots</h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("attendance")}
                >
                  Take Attendance
                </Button>
              </div>
              {myAttendance.slice(0, 4).map((rec) => {
                const course = allCourses.find((c) => c.id === rec.courseId);
                const batchSize = allStudents.filter(
                  (s) => s.batch === rec.batch
                ).length;
                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-semibold">
                        Batch {rec.batch} • {course?.code ?? "Course"}
                      </p>
                      <p className="text-xs text-muted-foreground">{rec.date}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {rec.presentIds.length}/{batchSize || rec.presentIds.length} present
                    </span>
                  </div>
                );
              })}
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Recent Announcements</h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("announcements")}
                >
                  New Announcement
                </Button>
              </div>
              {myAnnouncements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3.5 rounded-xl border">
                  <div className="flex items-center justify-between text-xs text-primary font-bold">
                    <span>Batch {ann.batch}</span>
                    <span className="text-muted-foreground font-normal">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{ann.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {ann.content}
                  </p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {activeTab === "classes" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {batches.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBatch(b)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedBatch === b
                    ? "bg-yellow-400 text-slate-900 shadow-sm"
                    : "bg-card border hover:bg-muted"
                }`}
              >
                Batch {b} (
                {allStudents.filter((s) => s.batch === b).length})
              </button>
            ))}
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                Batch {selectedBatch} Roster ({batchRoster.length})
              </h2>
              <input
                type="text"
                placeholder="Search student name or ID..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                className="px-3.5 py-2 border rounded-xl text-sm w-full sm:w-64"
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {batchRoster.map((stu) => (
                <div key={stu.id} className="p-4 rounded-xl border bg-background">
                  <p className="font-semibold">{stu.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {stu.studentId} • {stu.department}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {stu.email}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-5">
            <h2 className="text-lg font-bold">Mark Batch Attendance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Batch</label>
                <select
                  value={attBatch}
                  onChange={(e) => handleBatchSwitchForAtt(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                >
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Course</label>
                <select
                  value={attCourseId}
                  onChange={(e) => setAttCourseId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                >
                  {allCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              {attStudents.map((stu) => {
                const checked = presentIds.includes(stu.id);
                return (
                  <label
                    key={stu.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      checked ? "bg-emerald-50/70 border-emerald-300" : "bg-background"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-sm">{stu.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({stu.studentId})
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setPresentIds((prev) =>
                          prev.includes(stu.id)
                            ? prev.filter((id) => id !== stu.id)
                            : [...prev, stu.id]
                        )
                      }
                      className="w-4 h-4 accent-emerald-600"
                    />
                  </label>
                );
              })}
            </div>

            <Button
              type="button"
              onClick={handleSaveAttendance}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold"
            >
              Save Attendance ({presentIds.length}/{attStudents.length} Present)
            </Button>
          </Card>

          <Card className="p-6 space-y-4 h-fit">
            <h2 className="text-lg font-bold">Past Attendance Logs</h2>
            {myAttendance.length === 0 ? (
              <p className="text-sm text-muted-foreground">No records yet.</p>
            ) : (
              <div className="space-y-2.5">
                {myAttendance.map((rec) => {
                  const course = allCourses.find((c) => c.id === rec.courseId);
                  const total = allStudents.filter(
                    (s) => s.batch === rec.batch
                  ).length;
                  return (
                    <div key={rec.id} className="p-3 rounded-xl border text-xs">
                      <div className="flex justify-between font-bold">
                        <span>
                          Batch {rec.batch} • {course?.code}
                        </span>
                        <span>{rec.date}</span>
                      </div>
                      <p className="text-muted-foreground mt-1">
                        Present: {rec.presentIds.length} • Absent:{" "}
                        {Math.max(0, total - rec.presentIds.length)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              {editingAnnId ? "Edit Announcement" : "Create Announcement"}
            </h2>
            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Batch</label>
                <select
                  value={annBatch}
                  onChange={(e) => setAnnBatch(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                >
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Midterm Room Assignment"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Write announcement details for students..."
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                >
                  {editingAnnId ? "Update" : "Publish & Notify"}
                </Button>
                {editingAnnId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingAnnId(null);
                      setAnnTitle("");
                      setAnnContent("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-4">
            <h2 className="text-lg font-bold">
              Published Announcements ({myAnnouncements.length})
            </h2>
            {myAnnouncements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl border space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-primary">
                      Batch {ann.batch}
                    </span>
                    <h3 className="font-bold text-base">{ann.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingAnnId(ann.id);
                        setAnnTitle(ann.title);
                        setAnnContent(ann.content);
                        setAnnBatch(ann.batch);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => setDeleteAnnId(ann.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/80">{ann.content}</p>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Create Assignment</h2>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  value={asgCourseId}
                  onChange={(e) => setAsgCourseId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                >
                  {allCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Batch</label>
                  <select
                    value={asgBatch}
                    onChange={(e) => setAsgBatch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                  >
                    {batches.map((b) => (
                      <option key={b} value={b}>
                        Batch {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={asgDue}
                    onChange={(e) => setAsgDue(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Lab 04: Graph Traversal"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="Instructions & deliverables..."
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              >
                Create Assignment
              </Button>
            </form>
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-4">
            <h2 className="text-lg font-bold">
              Assignments &amp; Submissions ({myAssignments.length})
            </h2>
            {myAssignments.map((asg) => {
              const course = allCourses.find((c) => c.id === asg.courseId);
              const batchTotal = allStudents.filter(
                (s) => s.batch === asg.batch
              ).length;
              return (
                <div key={asg.id} className="p-4 rounded-xl border space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-primary">
                        {course?.code} • Batch {asg.batch}
                      </span>
                      <h3 className="font-bold">{asg.title}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-amber-900 font-semibold">
                      {asg.submissions.length}/{batchTotal || 1} submitted
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Due: {asg.dueDate} • {asg.description}
                  </p>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {activeTab === "progress" && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Student Academic Progress
            </h2>
            <input
              type="text"
              placeholder="Search name, ID, or batch..."
              value={progressSearch}
              onChange={(e) => setProgressSearch(e.target.value)}
              className="px-3.5 py-2 border rounded-xl text-sm w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Batch</th>
                  <th className="py-2 pr-4">Enrolled Courses</th>
                  <th className="py-2 pr-4">Attendance %</th>
                  <th className="py-2">Assignments Submitted</th>
                </tr>
              </thead>
              <tbody>
                {progressStudents.map((stu) => {
                  const enrolledCount = state.enrollments.filter(
                    (e) => e.userId === stu.id
                  ).length;
                  const batchAtt = state.attendance.filter(
                    (a) => a.batch === stu.batch
                  );
                  const presentCount = batchAtt.filter((a) =>
                    a.presentIds.includes(stu.id)
                  ).length;
                  const attPct =
                    batchAtt.length > 0
                      ? `${Math.round((presentCount / batchAtt.length) * 100)}%`
                      : "100%";
                  const submittedCount = state.assignments.filter((asg) =>
                    asg.submissions.some((s) => s.studentId === stu.id)
                  ).length;
                  return (
                    <tr key={stu.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <p className="font-semibold">{stu.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {stu.studentId}
                        </p>
                      </td>
                      <td className="py-3 pr-4">Batch {stu.batch}</td>
                      <td className="py-3 pr-4">{enrolledCount}</td>
                      <td className="py-3 pr-4 font-medium">{attPct}</td>
                      <td className="py-3">{submittedCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "messages" && <MessagesPanel />}

      <ConfirmDialog
        open={deleteAnnId !== null}
        title="Delete announcement?"
        description="This removes the announcement from the class feed."
        confirmLabel="Delete"
        onCancel={() => setDeleteAnnId(null)}
        onConfirm={() => {
          if (deleteAnnId) {
            dispatch({
              type: "DELETE_ANNOUNCEMENT",
              announcementId: deleteAnnId,
            });
            showToast("Announcement deleted.", "info");
          }
          setDeleteAnnId(null);
        }}
      />
    </DashboardShell>
  );
}
