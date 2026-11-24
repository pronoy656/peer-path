import type { User } from "../types";

export const DEMO_PASSWORD = "demo1234";

export interface DemoAccountInfo {
  role: User["role"];
  label: string;
  name: string;
  email: string;
  userId: string;
  dashboardPath: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccountInfo[] = [
  {
    role: "student",
    label: "Student",
    name: "Arif Rahman",
    email: "student@peerpath.demo",
    userId: "u-student-1",
    dashboardPath: "/dashboard/student",
    description: "Discover courses, enroll, join community, connect with peers.",
  },
  {
    role: "faculty",
    label: "Faculty",
    name: "Dr. Sarah Johnson",
    email: "faculty@peerpath.demo",
    userId: "u-faculty-1",
    dashboardPath: "/dashboard/faculty",
    description: "Manage courses, materials, office hours, and student reviews.",
  },
  {
    role: "teacher",
    label: "Class Teacher",
    name: "Ms. Nadia Karim",
    email: "teacher@peerpath.demo",
    userId: "u-teacher-1",
    dashboardPath: "/dashboard/teacher",
    description: "Take batch attendance, post announcements, track assignments.",
  },
  {
    role: "moderator",
    label: "Moderator",
    name: "Tanvir Hasan",
    email: "moderator@peerpath.demo",
    userId: "u-moderator-1",
    dashboardPath: "/dashboard/moderator",
    description: "Review reports, moderate community posts, warn or suspend users.",
  },
  {
    role: "alumni",
    label: "Alumni / Mentor",
    name: "Rahim Uddin",
    email: "alumni@peerpath.demo",
    userId: "u-alumni-1",
    dashboardPath: "/dashboard/alumni",
    description: "Accept mentees, post BDT jobs, and host campus events.",
  },
  {
    role: "admin",
    label: "Admin",
    name: "PeerPath Admin",
    email: "admin@peerpath.demo",
    userId: "u-admin-1",
    dashboardPath: "/dashboard/admin",
    description: "Oversee users, approve courses, post site-wide announcements.",
  },
];

export const SEED_CORE_USERS: User[] = [
  {
    id: "u-student-1",
    name: "Arif Rahman",
    email: "student@peerpath.demo",
    role: "student",
    department: "CSE",
    batch: "241",
    studentId: "241014012",
    interests: ["Web Development", "AI/ML", "Competitive Programming"],
    bio: "3rd-semester CSE undergraduate at ULAB exploring full-stack engineering and peer study groups.",
    avatar: "/students.jpg",
    avatarColor: "#eab308",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "u-teacher-1",
    name: "Ms. Nadia Karim",
    email: "teacher@peerpath.demo",
    role: "teacher",
    department: "CSE",
    batch: "241",
    bio: "Batch Advisor & Class Teacher for CSE Batch 241 & 242 at ULAB.",
    avatarColor: "#0ea5e9",
    createdAt: "2025-09-01T08:00:00Z",
  },
  {
    id: "u-moderator-1",
    name: "Tanvir Hasan",
    email: "moderator@peerpath.demo",
    role: "moderator",
    department: "MSJ",
    batch: "223",
    bio: "Senior student moderator ensuring respectful academic discussions across PeerPath.",
    avatarColor: "#8b5cf6",
    createdAt: "2025-08-10T10:00:00Z",
  },
  {
    id: "u-admin-1",
    name: "PeerPath Admin",
    email: "admin@peerpath.demo",
    role: "admin",
    department: "CSE",
    bio: "ULAB PeerPath Platform Administrator.",
    avatarColor: "#111827",
    createdAt: "2025-01-01T00:00:00Z",
  },
];
