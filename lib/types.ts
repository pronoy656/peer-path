export type Role = "student" | "faculty" | "teacher" | "moderator" | "alumni" | "admin";

export type Department = "CSE" | "BBA" | "MSJ" | "English" | "Bangla";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  avatarColor?: string;
  department?: Department;
  batch?: string;
  studentId?: string;
  interests?: string[];
  bio?: string;
  suspended?: boolean;
  createdAt: string;
}

export interface SyllabusWeek {
  week: number;
  topic: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  type: "Slides" | "Reading" | "Lab" | "Video Link";
  urlOrNote: string;
  addedById: string;
  addedAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  department: Department;
  semester: number; // 1–12
  credits: number;
  difficulty: Difficulty;
  instructorId: string; // -> Faculty User id
  schedule?: string;
  image: string;
  rating: number;
  reviewCount: number;
  seatsTotal: number;
  seatsTaken: number;
  status: "approved" | "pending" | "rejected";
  syllabus: SyllabusWeek[];
}

export interface FacultyProfile extends User {
  role: "faculty";
  title: string;
  researchArea: string[];
  officeHours: string;
  experienceYears: number;
  methodology: string;
  rating: number;
}

export interface AlumniProfile extends User {
  role: "alumni";
  currentRole: string;
  company: string;
  expertise: string[];
  availability: "Available" | "Limited";
  journey: string;
  rating: number;
  menteesCount: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number; // BDT/month
  salaryMax: number; // BDT/month
  type: "Full-time" | "Part-time" | "Internship";
  description: string;
  postedById: string;
  postedAt: string;
  status: "open" | "closed";
  applicants: { userId: string; appliedAt: string }[];
}

export interface PeerEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO future date
  location: string;
  organizerId: string;
  attendees: string[];
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  group?: string;
  likes: string[];
  createdAt: string;
  status: "visible" | "hidden";
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ReviewReply {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  targetType: "course" | "faculty";
  targetId: string;
  authorId: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  status: "visible" | "hidden";
  reply?: ReviewReply;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number; // 0–100
}

export interface Announcement {
  id: string;
  teacherId: string;
  batch: string; // e.g. "241" or "ALL"
  title: string;
  content: string;
  createdAt: string;
  isPlatformWide?: boolean;
}

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  batch: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  presentIds: string[];
}

export interface Assignment {
  id: string;
  teacherId: string;
  courseId: string;
  batch: string;
  title: string;
  description: string;
  dueDate: string;
  submissions: { studentId: string; submittedAt: string }[];
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: "post" | "comment" | "review" | "user";
  targetId: string;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  resolutionNote?: string;
  createdAt: string;
}

export interface ModerationLog {
  id: string;
  moderatorId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface StudentPreferences {
  department: Department;
  semester: number;
  creditRange: "3" | "4" | "5";
  schedule: "morning" | "afternoon" | "evening" | "flexible";
  courseLevel: "beginner" | "intermediate" | "advanced";
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  alumniId: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  notes?: string;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  subject?: string;
  read?: boolean;
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
}
