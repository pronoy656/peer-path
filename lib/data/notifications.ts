import type {
  Announcement,
  AppNotification,
  Assignment,
  AttendanceRecord,
  ConnectionRequest,
  DirectMessage,
  Enrollment,
  MentorshipRequest,
  ModerationLog,
  Report,
  SupportMessage,
} from "../types";

export const SEED_ENROLLMENTS: Enrollment[] = [
  { userId: "u-student-1", courseId: "1", enrolledAt: "2026-09-10T09:00:00Z", progress: 75 },
  { userId: "u-student-1", courseId: "2", enrolledAt: "2026-09-10T09:05:00Z", progress: 40 },
  { userId: "u-student-2", courseId: "1", enrolledAt: "2026-09-11T10:00:00Z", progress: 80 },
  { userId: "u-student-2", courseId: "6", enrolledAt: "2026-09-11T10:15:00Z", progress: 60 },
  { userId: "u-student-3", courseId: "2", enrolledAt: "2026-09-09T11:00:00Z", progress: 90 },
  { userId: "u-student-3", courseId: "3", enrolledAt: "2026-09-09T11:10:00Z", progress: 85 },
  { userId: "u-student-3", courseId: "4", enrolledAt: "2026-09-09T11:20:00Z", progress: 70 },
  { userId: "u-student-4", courseId: "7", enrolledAt: "2026-09-12T09:00:00Z", progress: 65 },
  { userId: "u-student-6", courseId: "10", enrolledAt: "2026-09-12T10:00:00Z", progress: 70 },
  { userId: "u-student-8", courseId: "12", enrolledAt: "2026-09-13T10:00:00Z", progress: 80 },
  { userId: "u-student-10", courseId: "14", enrolledAt: "2026-09-14T10:00:00Z", progress: 60 },
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    userId: "u-student-1",
    title: "Batch 241 Advising Reminder",
    body: "Ms. Nadia Karim posted the Spring semester advising schedule. Keep your selection within 14 credits.",
    read: false,
    createdAt: "2026-11-23T08:30:00Z",
    link: "/discover",
  },
  {
    id: "notif-2",
    userId: "u-student-1",
    title: "New Reply on Your Community Post",
    body: "Sajid Mahmud replied to your question about CSE202 Data Structures.",
    read: false,
    createdAt: "2026-11-23T15:01:00Z",
    link: "/community",
  },
  {
    id: "notif-3",
    userId: "u-student-1",
    title: "Upcoming Event: Mock Technical Interview Night",
    body: "You RSVP'd for Dec 12 at Room D-402 with ULAB alumni engineers.",
    read: true,
    createdAt: "2026-11-20T12:00:00Z",
    link: "/events",
  },
  {
    id: "notif-4",
    userId: "u-faculty-1",
    title: "New Course Review",
    body: "Nusrat Jahan Mim reviewed CSE101 Introduction to Programming (4.5/5).",
    read: false,
    createdAt: "2026-11-22T10:00:00Z",
    link: "/dashboard/faculty",
  },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    teacherId: "u-teacher-1",
    batch: "241",
    title: "Midterm Lab Evaluation Schedule — Batch 241",
    content:
      "Lab evaluations for CSE101 and CSE202 will take place next week during your regular lab slots in Room D-402. Please bring your ULAB ID card.",
    createdAt: "2026-11-21T09:30:00Z",
  },
  {
    id: "ann-2",
    teacherId: "u-teacher-1",
    batch: "242",
    title: "Orientation Peer Mentoring Groups",
    content:
      "First-year Batch 242 students have been paired with senior peer mentors. Check the Students directory to connect with your group.",
    createdAt: "2026-11-18T11:00:00Z",
  },
  {
    id: "ann-3",
    teacherId: "u-admin-1",
    batch: "ALL",
    title: "Welcome to ULAB PeerPath — Spring Pre-Registration Open",
    content:
      "Explore all 5 departments on Discover, check senior course reviews, and connect with alumni mentors for upcoming campus workshops.",
    createdAt: "2026-11-24T08:00:00Z",
    isPlatformWide: true,
  },
];

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att-1",
    teacherId: "u-teacher-1",
    batch: "241",
    courseId: "1",
    date: "2026-11-22",
    presentIds: ["u-student-1", "u-student-2", "u-student-4"],
  },
  {
    id: "att-2",
    teacherId: "u-teacher-1",
    batch: "241",
    courseId: "1",
    date: "2026-11-19",
    presentIds: ["u-student-1", "u-student-2", "u-student-6", "u-student-10"],
  },
];

export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    teacherId: "u-teacher-1",
    courseId: "1",
    batch: "241",
    title: "Lab 03: Array & String Algorithms",
    description: "Submit 5 solved C/Python problems covering string parsing and 2D arrays.",
    dueDate: "2026-12-05",
    submissions: [
      { studentId: "u-student-1", submittedAt: "2026-11-22T18:00:00Z" },
      { studentId: "u-student-2", submittedAt: "2026-11-23T09:15:00Z" },
    ],
  },
  {
    id: "asg-2",
    teacherId: "u-teacher-1",
    courseId: "2",
    batch: "241",
    title: "Problem Set 02: Binary Trees & Heaps",
    description: "Implement min-heap priority queue and level-order traversal.",
    dueDate: "2026-12-10",
    submissions: [{ studentId: "u-student-1", submittedAt: "2026-11-23T20:10:00Z" }],
  },
];

export const SEED_REPORTS: Report[] = [
  {
    id: "rep-open-1",
    reporterId: "u-student-2",
    targetType: "post",
    targetId: "post-3",
    reason: "Double check if external team recruitment links are allowed in BBA group.",
    status: "open",
    createdAt: "2026-11-23T19:00:00Z",
  },
];

export const SEED_MODERATION_LOGS: ModerationLog[] = [
  {
    id: "modlog-1",
    moderatorId: "u-moderator-1",
    action: "Initialized Queue",
    targetType: "system",
    targetId: "queue",
    details: "Reviewed weekly community guidelines compliance across all 5 department channels.",
    createdAt: "2026-11-20T10:00:00Z",
  },
];

export const SEED_CONNECTIONS: ConnectionRequest[] = [
  {
    id: "conn-1",
    fromUserId: "u-student-1",
    toUserId: "u-student-2",
    status: "accepted",
    createdAt: "2026-11-10T10:00:00Z",
  },
  {
    id: "conn-2",
    fromUserId: "u-student-3",
    toUserId: "u-student-1",
    status: "pending",
    createdAt: "2026-11-22T14:00:00Z",
  },
];

export const SEED_MENTORSHIPS: MentorshipRequest[] = [
  {
    id: "ment-1",
    studentId: "u-student-1",
    alumniId: "u-alumni-1",
    message: "Hi Rahim bhaiya! I'm in CSE 3rd semester and would love advice on preparing for backend internships.",
    status: "pending",
    createdAt: "2026-11-22T16:00:00Z",
  },
  {
    id: "ment-2",
    studentId: "u-student-2",
    alumniId: "u-alumni-1",
    message: "Looking for guidance on full-stack vs UI/UX career paths in Dhaka tech companies.",
    status: "accepted",
    notes: "Shared Figma + React portfolio checklist; follow up before Dec 12 mock interview.",
    createdAt: "2026-11-15T11:00:00Z",
  },
];

export const SEED_MESSAGES: DirectMessage[] = [
  {
    id: "msg-1",
    senderId: "u-student-2",
    recipientId: "u-student-1",
    content: "Hey Arif, are you going to Dr. Sarah's Tuesday office hours for the CSE101 project review?",
    createdAt: "2026-11-23T11:00:00Z",
    read: true,
  },
  {
    id: "msg-2",
    senderId: "u-student-1",
    recipientId: "u-student-2",
    content: "Yes! Planning to be outside Room D-402 around 2:15 PM.",
    createdAt: "2026-11-23T11:08:00Z",
    read: true,
  },
  {
    id: "msg-3",
    senderId: "u-student-1",
    recipientId: "u-faculty-1",
    subject: "CSE401 Project Proposal Question",
    content: "Dear Dr. Johnson, could our team build an academic peer-scheduler for our final project?",
    createdAt: "2026-11-22T13:30:00Z",
    read: false,
  },
];

export const SEED_SUPPORT_MESSAGES: SupportMessage[] = [
  {
    id: "sup-1",
    name: "Tariqul Haque",
    email: "tariqul.242@ulab.edu.bd",
    message: "How do I update my batch number if I transferred from BBA to CSE?",
    handled: false,
    createdAt: "2026-11-22T15:20:00Z",
  },
];
