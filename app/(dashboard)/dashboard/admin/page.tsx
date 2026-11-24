"use client";

import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Plus,
  RotateCcw,
  Settings,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";
import DashboardShell, {
  type DashboardNavItem,
} from "@/components/dashboard/DashboardShell";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import DetailDrawer from "@/components/dashboard/DetailDrawer";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import type { SupportMessage } from "@/lib/types";
import { useAppStore } from "@/lib/store/AppStore";
import { getDemoAccounts, getDemoPassword } from "@/lib/services/auth";
import {
  approveCourse,
  createCourse,
  getCourses,
  rejectCourse,
  updateCourse,
} from "@/lib/services/courses";
import { deletePost, getPosts } from "@/lib/services/community";
import {
  dismissReport,
  hidePost,
  resolveReport,
  toggleSuspendUser,
} from "@/lib/services/moderation";
import { createAnnouncementAndNotify } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Course, Department, Difficulty, Role } from "@/lib/types";

export default function AdminDashboardPage() {
  const { state, dispatch, currentUser, showToast, resetDemoData } =
    useAppStore();
  const [activeTab, setActiveTab] = useState("overview");

  const adminId = currentUser?.id ?? "u-admin-1";

  // Users state
  const [userQuery, setUserQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>("student");
  const [newUserDept, setNewUserDept] = useState<Department>("CSE");

  // Courses state
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDept, setCourseDept] = useState<Department>("CSE");
  const [courseSem, setCourseSem] = useState("1");
  const [courseCredits, setCourseCredits] = useState("3");
  const [courseDiff, setCourseDiff] = useState<Difficulty>("Beginner");
  const [courseInstructor, setCourseInstructor] = useState(
    state.facultyProfiles[0]?.id ?? "u-faculty-1"
  );
  const [courseDesc, setCourseDesc] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Faculty add state
  const [facName, setFacName] = useState("");
  const [facEmail, setFacEmail] = useState("");
  const [facTitle, setFacTitle] = useState("Assistant Professor");
  const [facDept, setFacDept] = useState<Department>("CSE");
  const [facOfficeHours, setFacOfficeHours] = useState("Sun & Tue 2:00 PM");

  // Platform announcement state
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");

  // Settings state
  const [siteName, setSiteName] = useState(state.siteSettings.siteName);
  const [tagline, setTagline] = useState(state.siteSettings.tagline);
  const [selectedSupport, setSelectedSupport] = useState<SupportMessage | null>(
    null
  );

  // Confirm dialogs
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    label: string;
    onRun: () => void;
  } | null>(null);

  const allCourses = getCourses(state, true);
  const pendingCourses = allCourses.filter((c) => c.status === "pending");
  const openReports = state.reports.filter((r) => r.status === "open");
  const unhandledSupport = state.supportMessages.filter((s) => !s.handled);
  const allPosts = getPosts(state, { includeHidden: true });

  const rolesList: Role[] = [
    "student",
    "faculty",
    "teacher",
    "moderator",
    "alumni",
    "admin",
  ];

  const usersByRole = rolesList.map((r) => ({
    role: r,
    count: state.users.filter((u) => u.role === r).length,
  }));
  const maxRoleCount = Math.max(1, ...usersByRole.map((x) => x.count));

  const deptsList: Department[] = ["CSE", "BBA", "MSJ", "English", "Bangla"];
  const coursesByDept = deptsList.map((d) => ({
    dept: d,
    count: allCourses.filter((c) => c.department === d && c.status === "approved")
      .length,
  }));
  const maxDeptCount = Math.max(1, ...coursesByDept.map((x) => x.count));

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "courses", label: "Courses", icon: <BookOpen className="w-4 h-4" />, badge: pendingCourses.length },
    { id: "faculty", label: "Faculty", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "content", label: "Content", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "jobsEvents", label: "Jobs & Events", icon: <Briefcase className="w-4 h-4" /> },
    { id: "reports", label: "Reports", icon: <ShieldAlert className="w-4 h-4" />, badge: openReports.length },
    { id: "support", label: "Support Inbox", icon: <Inbox className="w-4 h-4" />, badge: unhandledSupport.length },
    { id: "announcements", label: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const filteredUsers = state.users.filter((u) => {
    const q = userQuery.toLowerCase();
    const matchText =
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchText && matchRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const normalized = newUserEmail.trim().toLowerCase();
    if (state.users.some((u) => u.email.toLowerCase() === normalized)) {
      showToast("A user with this email already exists.", "error");
      return;
    }
    dispatch({
      type: "REGISTER_USER",
      user: {
        id: `u-${newUserRole}-${Date.now()}`,
        name: newUserName.trim(),
        email: normalized,
        role: newUserRole,
        department: newUserDept,
        batch: newUserRole === "student" ? "241" : undefined,
        createdAt: new Date().toISOString(),
      },
      password: getDemoPassword(),
    });
    setNewUserName("");
    setNewUserEmail("");
    showToast(`Created ${newUserRole} user (password: demo1234).`);
  };

  const handleAddOrEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(dispatch, editingCourse.id, {
        code: courseCode.trim(),
        title: courseTitle.trim(),
        department: courseDept,
        semester: Number(courseSem) || 1,
        credits: Number(courseCredits) || 3,
        difficulty: courseDiff,
        instructorId: courseInstructor,
        description: courseDesc.trim(),
      });
      setEditingCourse(null);
      showToast("Course updated!");
    } else {
      createCourse(dispatch, {
        code: courseCode.trim().toUpperCase(),
        title: courseTitle.trim(),
        description: courseDesc.trim(),
        department: courseDept,
        semester: Number(courseSem) || 1,
        credits: Number(courseCredits) || 3,
        difficulty: courseDiff,
        instructorId: courseInstructor,
        image: "/programming-intro.jpg",
        seatsTotal: 40,
        status: "approved",
        syllabus: [
          { week: 1, topic: "Course Introduction & Foundations" },
          { week: 2, topic: "Core Concepts & Guided Practice" },
        ],
      });
      showToast("New course added to catalog!");
    }
    setCourseCode("");
    setCourseTitle("");
    setCourseDesc("");
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facEmail.trim()) return;
    dispatch({
      type: "ADD_FACULTY_PROFILE",
      faculty: {
        id: `u-faculty-${Date.now()}`,
        name: facName.trim(),
        email: facEmail.trim().toLowerCase(),
        role: "faculty",
        title: facTitle.trim() || "Lecturer",
        department: facDept,
        officeHours: facOfficeHours.trim(),
        experienceYears: 5,
        researchArea: [facDept],
        methodology: "Interactive lectures and lab sessions.",
        rating: 4.8,
        bio: `ULAB ${facDept} faculty member.`,
        createdAt: new Date().toISOString(),
      },
      password: getDemoPassword(),
    });
    setFacName("");
    setFacEmail("");
    showToast("Faculty member added!");
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annBody.trim()) return;
    createAnnouncementAndNotify(state, dispatch, {
      teacherId: adminId,
      batch: "ALL",
      title: annTitle.trim(),
      content: annBody.trim(),
      isPlatformWide: true,
    });
    setAnnTitle("");
    setAnnBody("");
    showToast("Platform-wide announcement posted to Home & all user alerts!");
  };

  return (
    <DashboardShell
      allowedRole="admin"
      roleTitle="Admin Control Center"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total users"
              value={state.users.length}
              hint="Across 6 campus roles"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Approved courses"
              value={allCourses.filter((c) => c.status === "approved").length}
              hint={`${pendingCourses.length} pending approval`}
              hintTone={pendingCourses.length > 0 ? "danger" : "success"}
              icon={<BookOpen className="w-5 h-5" />}
            />
            <StatCard
              label="Enrollments"
              value={state.enrollments.length}
              hint={`${state.posts.length} community posts`}
              hintTone="success"
              icon={<GraduationCap className="w-5 h-5" />}
            />
            <StatCard
              label="Open reports"
              value={openReports.length}
              hint={`${unhandledSupport.length} support unread`}
              hintTone={openReports.length > 0 ? "danger" : "success"}
              icon={<ShieldAlert className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Users by role
                </h2>
                <span className="text-xs text-muted-foreground">
                  Total: {state.users.length}
                </span>
              </div>
              <div className="space-y-3">
                {usersByRole.map(({ role, count }) => (
                  <div key={role} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="capitalize">{role}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{
                          width: `${Math.round((count / maxRoleCount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Active courses by department
                </h2>
                <span className="text-xs text-muted-foreground">
                  5 departments
                </span>
              </div>
              <div className="space-y-3">
                {coursesByDept.map(({ dept, count }) => (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{dept}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.round((count / maxDeptCount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">
                Needs attention
              </h2>
              <span className="text-xs text-muted-foreground">
                Pending courses &amp; open support
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 pr-4 font-semibold">Item</th>
                    <th className="py-3 pr-4 font-semibold">Category</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCourses.map((c) => (
                    <tr
                      key={c.id}
                      className="h-14 border-b border-border hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 pr-4 font-semibold">
                        {c.code} · {c.title}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge department={c.department}>{c.department}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="pending">Pending approval</Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="accent"
                          onClick={() => {
                            approveCourse(dispatch, c.id);
                            showToast(`Approved ${c.code}!`);
                          }}
                        >
                          Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {unhandledSupport.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedSupport(s)}
                      className="h-14 border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pr-4 font-semibold">
                        {s.name} — {s.message.slice(0, 48)}…
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="neutral">Support</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="pending">Open</Badge>
                      </td>
                      <td className="py-3 text-right text-xs font-semibold text-primary">
                        Inspect →
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Create User
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as Role)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                  >
                    {rolesList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Dept
                  </label>
                  <select
                    value={newUserDept}
                    onChange={(e) =>
                      setNewUserDept(e.target.value as Department)
                    }
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                  >
                    {deptsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold"
              >
                Add User
              </Button>
            </form>
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Search users..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-1 min-w-[180px] px-3.5 py-2 border rounded-xl text-sm"
              />
              <select
                aria-label="Filter users by role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
                className="px-3 py-2 border rounded-xl text-sm bg-background"
              >
                <option value="all">All Roles</option>
                {rolesList.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {u.name}{" "}
                      {u.suspended && (
                        <span className="text-xs text-red-600 font-bold">
                          (Suspended)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {u.email} • {u.department ?? "ULAB"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={`Change role for ${u.name}`}
                      value={u.role}
                      disabled={u.id === adminId}
                      onChange={(e) => {
                        dispatch({
                          type: "CHANGE_USER_ROLE",
                          userId: u.id,
                          role: e.target.value as Role,
                        });
                        showToast(`Updated ${u.name}'s role to ${e.target.value}.`);
                      }}
                      className="text-xs px-2.5 py-1.5 border rounded-lg bg-background"
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {u.id !== adminId && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const suspended = toggleSuspendUser(
                              state,
                              dispatch,
                              u.id,
                              adminId
                            );
                            showToast(
                              suspended
                                ? `Suspended ${u.name}.`
                                : `Unsuspended ${u.name}.`,
                              "info"
                            );
                          }}
                        >
                          {u.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() =>
                            setConfirmAction({
                              title: `Delete ${u.name}?`,
                              description:
                                "This removes the user account from the local store.",
                              label: "Delete User",
                              onRun: () => {
                                dispatch({ type: "DELETE_USER", userId: u.id });
                                showToast(`Deleted ${u.name}.`, "info");
                              },
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="space-y-6">
          {pendingCourses.length > 0 && (
            <Card className="p-6 border-2 border-accent/50 bg-accent/5 space-y-4">
              <h2 className="text-lg font-bold">
                Pending Course Proposals ({pendingCourses.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pendingCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-card border space-y-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-amber-700">
                        {c.code} • {c.department} • Sem {c.semester}
                      </span>
                      <h3 className="font-bold">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        onClick={() => {
                          approveCourse(dispatch, c.id);
                          showToast(`Approved ${c.code}: ${c.title}!`);
                        }}
                      >
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 gap-1"
                        onClick={() => {
                          rejectCourse(dispatch, c.id);
                          showToast(`Rejected ${c.code}.`, "info");
                        }}
                      >
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 h-fit">
              <h2 className="text-lg font-bold mb-4">
                {editingCourse ? `Edit ${editingCourse.code}` : "Add Course"}
              </h2>
              <form onSubmit={handleAddOrEditCourse} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Code (CSE310)"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="px-3 py-2 border rounded-xl text-sm"
                  />
                  <select
                    value={courseDept}
                    onChange={(e) =>
                      setCourseDept(e.target.value as Department)
                    }
                    className="px-3 py-2 border rounded-xl text-sm bg-background"
                  >
                    {deptsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Course title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={courseSem}
                    onChange={(e) => setCourseSem(e.target.value)}
                    placeholder="Sem"
                    className="px-3 py-2 border rounded-xl text-sm"
                  />
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(e.target.value)}
                    placeholder="Credits"
                    className="px-3 py-2 border rounded-xl text-sm"
                  />
                  <select
                    value={courseDiff}
                    onChange={(e) =>
                      setCourseDiff(e.target.value as Difficulty)
                    }
                    className="px-2 py-2 border rounded-xl text-xs bg-background"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <select
                  value={courseInstructor}
                  onChange={(e) => setCourseInstructor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-background"
                >
                  {state.facultyProfiles.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.department})
                    </option>
                  ))}
                </select>
                <textarea
                  required
                  rows={3}
                  placeholder="Course description..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-accent hover:bg-accent-hover text-accent-foreground font-semibold"
                  >
                    {editingCourse ? "Update Course" : "Add Course"}
                  </Button>
                  {editingCourse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingCourse(null);
                        setCourseCode("");
                        setCourseTitle("");
                        setCourseDesc("");
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            <Card className="lg:col-span-2 p-6 space-y-3">
              <h2 className="text-lg font-bold">
                All Courses ({allCourses.length})
              </h2>
              <div className="space-y-2.5">
                {allCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-primary">
                        {c.code} • {c.department} • Sem {c.semester} •{" "}
                        {c.status}
                      </span>
                      <p className="font-semibold text-sm">{c.title}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCourse(c);
                        setCourseCode(c.code);
                        setCourseTitle(c.title);
                        setCourseDept(c.department);
                        setCourseSem(String(c.semester));
                        setCourseCredits(String(c.credits));
                        setCourseDiff(c.difficulty);
                        setCourseInstructor(c.instructorId);
                        setCourseDesc(c.description);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "faculty" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Add Faculty Member</h2>
            <form onSubmit={handleAddFaculty} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full name"
                value={facName}
                onChange={(e) => setFacName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
              <input
                type="email"
                required
                placeholder="name@ulab.edu.bd"
                value={facEmail}
                onChange={(e) => setFacEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={facTitle}
                  onChange={(e) => setFacTitle(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-sm"
                />
                <select
                  value={facDept}
                  onChange={(e) => setFacDept(e.target.value as Department)}
                  className="px-3 py-2 border rounded-xl text-sm bg-background"
                >
                  {deptsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Office hours"
                value={facOfficeHours}
                onChange={(e) => setFacOfficeHours(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold"
              >
                Add Faculty
              </Button>
            </form>
          </Card>

          <Card className="lg:col-span-2 p-6 space-y-3">
            <h2 className="text-lg font-bold">
              Faculty Directory ({state.facultyProfiles.length})
            </h2>
            {state.facultyProfiles.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="font-bold text-sm">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.title} • {f.department} • {f.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Office Hours: {f.officeHours}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch({
                      type: "UPDATE_FACULTY_PROFILE",
                      facultyId: f.id,
                      patch: {
                        officeHours:
                          f.officeHours === "Sun & Tue, 2:00 PM – 4:00 PM (Room D-402)"
                            ? "Mon & Wed, 3:00 PM – 4:30 PM (Room D-402)"
                            : f.officeHours,
                      },
                    });
                    showToast(`Verified faculty record for ${f.name}.`, "info");
                  }}
                >
                  Verify Record
                </Button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-6">
          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">
              Community Posts ({allPosts.length})
            </h2>
            {allPosts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border flex flex-wrap items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-primary">
                    {p.group} • {p.author?.name} ({p.status})
                  </p>
                  <p className="text-sm mt-1">{p.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      hidePost(dispatch, p.id, adminId);
                      showToast("Post visibility updated.", "info");
                    }}
                  >
                    {p.status === "visible" ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() =>
                      setConfirmAction({
                        title: "Delete community post?",
                        description: "This removes the post permanently.",
                        label: "Delete",
                        onRun: () => {
                          deletePost(dispatch, p.id);
                          showToast("Post deleted.", "info");
                        },
                      })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">
              Reviews ({state.reviews.length})
            </h2>
            {state.reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-primary uppercase">
                    {r.targetType} • {r.rating}/5 ★ ({r.status})
                  </p>
                  <p className="text-sm mt-1">{r.content}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch({
                      type: "TOGGLE_REVIEW_VISIBILITY",
                      reviewId: r.id,
                    });
                    showToast("Review visibility updated.", "info");
                  }}
                >
                  {r.status === "visible" ? "Hide" : "Unhide"}
                </Button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "jobsEvents" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">
              All Job Postings ({state.jobs.length})
            </h2>
            {state.jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl border flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-sm">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.company} • BDT {job.salaryMin.toLocaleString()}–
                    {job.salaryMax.toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() =>
                    setConfirmAction({
                      title: `Remove ${job.title}?`,
                      description: "Removes this job from the job board.",
                      label: "Remove Job",
                      onRun: () => {
                        dispatch({ type: "DELETE_JOB", jobId: job.id });
                        showToast("Job removed.", "info");
                      },
                    })
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">
              All Campus Events ({state.events.length})
            </h2>
            {state.events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl border flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-sm">{ev.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ev.date).toLocaleDateString()} • {ev.location}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() =>
                    setConfirmAction({
                      title: `Remove ${ev.title}?`,
                      description: "Removes this event from Campus Events.",
                      label: "Remove Event",
                      onRun: () => {
                        dispatch({ type: "DELETE_EVENT", eventId: ev.id });
                        showToast("Event removed.", "info");
                      },
                    })
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4">
          {state.reports.map((rep) => (
            <Card key={rep.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-secondary">
                  {rep.targetType} • {rep.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(rep.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium">{rep.reason}</p>
              {rep.status === "open" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      resolveReport(state, dispatch, {
                        reportId: rep.id,
                        moderatorId: adminId,
                        action: "hide",
                      });
                      showToast("Report resolved & target hidden.");
                    }}
                  >
                    Resolve &amp; Hide
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      dismissReport(dispatch, rep.id, adminId);
                      showToast("Report dismissed.", "info");
                    }}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === "support" && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">
            Contact-Form Support Inbox ({state.supportMessages.length})
          </h2>
          {state.supportMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No support messages yet.
            </p>
          ) : (
            <div className="space-y-3">
              {state.supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl border flex flex-wrap items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({msg.email})
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          msg.handled
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {msg.handled ? "Handled" : "Open"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/85 mt-1.5">
                      {msg.message}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      dispatch({
                        type: "TOGGLE_SUPPORT_HANDLED",
                        messageId: msg.id,
                      });
                      showToast("Updated support status.", "info");
                    }}
                  >
                    {msg.handled ? "Reopen" : "Mark Handled"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">
              Post Platform-Wide Announcement
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Displays as a banner on the Home page and sends a notification to
              all PeerPath users.
            </p>
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Announcement headline..."
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
              />
              <textarea
                required
                rows={4}
                placeholder="Write platform announcement..."
                value={annBody}
                onChange={(e) => setAnnBody(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-xl text-sm resize-none"
              />
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-bold"
              >
                Publish Platform Announcement
              </Button>
            </form>
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">Active Announcements</h2>
            {state.announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">
                    {a.isPlatformWide ? "Platform Banner" : `Batch ${a.batch}`}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "DELETE_ANNOUNCEMENT",
                        announcementId: a.id,
                      })
                    }
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <p className="font-semibold text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.content}</p>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold">Site Settings</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch({
                  type: "UPDATE_SITE_SETTINGS",
                  settings: { siteName, tagline },
                });
                showToast("Site settings saved!");
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                />
              </div>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-accent-foreground font-semibold"
              >
                Save Settings
              </Button>
            </form>

            <div className="pt-4 border-t">
              <h3 className="font-bold text-sm mb-2">Restore Seed State</h3>
              <Button
                type="button"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                onClick={() =>
                  setConfirmAction({
                    title: "Reset demo data?",
                    description:
                      "Restores all ULAB seed data and clears localStorage customizations.",
                    label: "Reset Demo Data",
                    onRun: () => resetDemoData(),
                  })
                }
              >
                <RotateCcw className="w-4 h-4" /> Reset demo data
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="text-lg font-bold">Demo Accounts Reference</h2>
            <p className="text-xs text-muted-foreground">
              Password for all demo accounts: <code>{getDemoPassword()}</code>
            </p>
            <div className="space-y-2">
              {getDemoAccounts().map((acc) => (
                <div
                  key={acc.role}
                  className="p-3 rounded-xl border text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {acc.label} — {acc.name}
                    </p>
                    <p className="text-muted-foreground">{acc.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">
                    {acc.dashboardPath}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <DetailDrawer
        open={selectedSupport !== null}
        title={selectedSupport?.name ?? "Support message"}
        subtitle={selectedSupport?.email}
        onClose={() => setSelectedSupport(null)}
      >
        {selectedSupport && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground">
              {selectedSupport.message}
            </p>
            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button
                variant="default"
                onClick={() => {
                  dispatch({
                    type: "TOGGLE_SUPPORT_HANDLED",
                    messageId: selectedSupport.id,
                  });
                  setSelectedSupport(null);
                  showToast("Support message updated!");
                }}
              >
                {selectedSupport.handled ? "Reopen" : "Mark as handled"}
              </Button>
            </div>
          </div>
        )}
      </DetailDrawer>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction?.title ?? ""}
        description={confirmAction?.description ?? ""}
        confirmLabel={confirmAction?.label ?? "Confirm"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          confirmAction?.onRun();
          setConfirmAction(null);
        }}
      />
    </DashboardShell>
  );
}
