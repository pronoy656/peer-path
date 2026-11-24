"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import type {
  AlumniProfile,
  Announcement,
  AppNotification,
  Assignment,
  AttendanceRecord,
  Comment,
  ConnectionRequest,
  Course,
  CourseMaterial,
  DirectMessage,
  Enrollment,
  FacultyProfile,
  Job,
  MentorshipRequest,
  ModerationLog,
  PeerEvent,
  Post,
  Report,
  Review,
  Role,
  SiteSettings,
  StudentPreferences,
  SupportMessage,
  User,
} from "../types";
import { SEED_CORE_USERS, DEMO_PASSWORD } from "../data/users";
import { SEED_FACULTY } from "../data/faculty";
import { SEED_STUDENTS } from "../data/students";
import { SEED_ALUMNI } from "../data/alumni";
import { SEED_COURSES, SEED_MATERIALS } from "../data/courses";
import { SEED_JOBS } from "../data/jobs";
import { SEED_EVENTS } from "../data/events";
import { SEED_COMMENTS, SEED_POSTS } from "../data/posts";
import { SEED_REVIEWS } from "../data/reviews";
import {
  SEED_ANNOUNCEMENTS,
  SEED_ASSIGNMENTS,
  SEED_ATTENDANCE,
  SEED_CONNECTIONS,
  SEED_ENROLLMENTS,
  SEED_MENTORSHIPS,
  SEED_MESSAGES,
  SEED_MODERATION_LOGS,
  SEED_NOTIFICATIONS,
  SEED_REPORTS,
  SEED_SUPPORT_MESSAGES,
} from "../data/notifications";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const STORAGE_KEY = "peerpath-state-v1";

export interface AppState {
  currentUserId: string | null;
  users: User[];
  facultyProfiles: FacultyProfile[];
  alumniProfiles: AlumniProfile[];
  userPasswords: Record<string, string>;
  courses: Course[];
  materials: CourseMaterial[];
  jobs: Job[];
  events: PeerEvent[];
  posts: Post[];
  comments: Comment[];
  reviews: Review[];
  enrollments: Enrollment[];
  savedCourseIds: Record<string, string[]>; // userId -> courseId[]
  preferences: Record<string, StudentPreferences>; // userId (or "guest") -> prefs
  notifications: AppNotification[];
  announcements: Announcement[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  reports: Report[];
  moderationLogs: ModerationLog[];
  connections: ConnectionRequest[];
  mentorships: MentorshipRequest[];
  messages: DirectMessage[];
  supportMessages: SupportMessage[];
  siteSettings: SiteSettings;
}

export function createSeedState(): AppState {
  const allUsers: User[] = [
    ...SEED_CORE_USERS,
    ...SEED_FACULTY,
    ...SEED_STUDENTS,
    ...SEED_ALUMNI,
  ];
  const userPasswords: Record<string, string> = {};
  for (const u of allUsers) {
    userPasswords[u.email.toLowerCase()] = DEMO_PASSWORD;
  }

  return {
    currentUserId: null,
    users: allUsers,
    facultyProfiles: SEED_FACULTY,
    alumniProfiles: SEED_ALUMNI,
    userPasswords,
    courses: SEED_COURSES,
    materials: SEED_MATERIALS,
    jobs: SEED_JOBS,
    events: SEED_EVENTS,
    posts: SEED_POSTS,
    comments: SEED_COMMENTS,
    reviews: SEED_REVIEWS,
    enrollments: SEED_ENROLLMENTS,
    savedCourseIds: {
      "u-student-1": ["3", "4"],
    },
    preferences: {
      guest: {
        department: "CSE",
        semester: 1,
        creditRange: "3",
        schedule: "morning",
        courseLevel: "beginner",
      },
      "u-student-1": {
        department: "CSE",
        semester: 2,
        creditRange: "3",
        schedule: "morning",
        courseLevel: "intermediate",
      },
    },
    notifications: SEED_NOTIFICATIONS,
    announcements: SEED_ANNOUNCEMENTS,
    attendance: SEED_ATTENDANCE,
    assignments: SEED_ASSIGNMENTS,
    reports: SEED_REPORTS,
    moderationLogs: SEED_MODERATION_LOGS,
    connections: SEED_CONNECTIONS,
    mentorships: SEED_MENTORSHIPS,
    messages: SEED_MESSAGES,
    supportMessages: SEED_SUPPORT_MESSAGES,
    siteSettings: {
      siteName: "PeerPath",
      tagline: "ULAB Peer-Learning, Mentorship & Campus Community",
    },
  };
}

export type AppAction =
  | { type: "HYDRATE"; payload: AppState }
  | { type: "RESET_DEMO_DATA" }
  | { type: "SET_CURRENT_USER"; userId: string | null }
  | { type: "REGISTER_USER"; user: User; password: string }
  | { type: "UPDATE_USER"; userId: string; patch: Partial<User> }
  | { type: "CHANGE_USER_ROLE"; userId: string; role: Role }
  | { type: "DELETE_USER"; userId: string }
  | { type: "UPDATE_FACULTY_PROFILE"; facultyId: string; patch: Partial<FacultyProfile> }
  | { type: "ADD_FACULTY_PROFILE"; faculty: FacultyProfile; password: string }
  | { type: "UPDATE_ALUMNI_PROFILE"; alumniId: string; patch: Partial<AlumniProfile> }
  | { type: "ENROLL_COURSES"; userId: string; courseIds: string[] }
  | { type: "UNENROLL_COURSE"; userId: string; courseId: string }
  | { type: "ADVANCE_PROGRESS"; userId: string; courseId: string; delta?: number }
  | { type: "TOGGLE_SAVE_COURSE"; userId: string; courseId: string }
  | { type: "SAVE_PREFERENCES"; key: string; prefs: StudentPreferences }
  | { type: "ADD_COURSE"; course: Course }
  | { type: "UPDATE_COURSE"; courseId: string; patch: Partial<Course> }
  | { type: "ADD_MATERIAL"; material: CourseMaterial }
  | { type: "DELETE_MATERIAL"; materialId: string }
  | { type: "ADD_REVIEW"; review: Review }
  | { type: "TOGGLE_REVIEW_VISIBILITY"; reviewId: string }
  | { type: "REPLY_TO_REVIEW"; reviewId: string; authorId: string; content: string }
  | { type: "CREATE_POST"; post: Post }
  | { type: "TOGGLE_LIKE_POST"; postId: string; userId: string }
  | { type: "TOGGLE_POST_VISIBILITY"; postId: string }
  | { type: "DELETE_POST"; postId: string }
  | { type: "ADD_COMMENT"; comment: Comment }
  | { type: "DELETE_COMMENT"; commentId: string }
  | { type: "ADD_REPORT"; report: Report }
  | { type: "UPDATE_REPORT"; reportId: string; status: Report["status"]; resolutionNote?: string }
  | { type: "ADD_MODERATION_LOG"; log: ModerationLog }
  | { type: "ADD_NOTIFICATION"; notification: AppNotification }
  | { type: "ADD_NOTIFICATIONS"; notifications: AppNotification[] }
  | { type: "MARK_NOTIFICATION_READ"; notificationId: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ"; userId: string }
  | { type: "ADD_ANNOUNCEMENT"; announcement: Announcement }
  | { type: "UPDATE_ANNOUNCEMENT"; announcementId: string; patch: Partial<Announcement> }
  | { type: "DELETE_ANNOUNCEMENT"; announcementId: string }
  | { type: "SAVE_ATTENDANCE"; record: AttendanceRecord }
  | { type: "ADD_ASSIGNMENT"; assignment: Assignment }
  | { type: "SUBMIT_ASSIGNMENT"; assignmentId: string; studentId: string }
  | { type: "SEND_CONNECTION"; connection: ConnectionRequest }
  | { type: "RESPOND_CONNECTION"; connectionId: string; status: "accepted" | "declined" }
  | { type: "REQUEST_MENTORSHIP"; mentorship: MentorshipRequest }
  | { type: "RESPOND_MENTORSHIP"; mentorshipId: string; status: "accepted" | "declined" }
  | { type: "UPDATE_MENTORSHIP_NOTES"; mentorshipId: string; notes: string }
  | { type: "SEND_MESSAGE"; message: DirectMessage }
  | { type: "MARK_MESSAGE_READ"; messageId: string }
  | { type: "ADD_JOB"; job: Job }
  | { type: "UPDATE_JOB"; jobId: string; patch: Partial<Job> }
  | { type: "DELETE_JOB"; jobId: string }
  | { type: "APPLY_JOB"; jobId: string; userId: string }
  | { type: "ADD_EVENT"; event: PeerEvent }
  | { type: "UPDATE_EVENT"; eventId: string; patch: Partial<PeerEvent> }
  | { type: "DELETE_EVENT"; eventId: string }
  | { type: "TOGGLE_EVENT_RSVP"; eventId: string; userId: string }
  | { type: "ADD_SUPPORT_MESSAGE"; message: SupportMessage }
  | { type: "TOGGLE_SUPPORT_HANDLED"; messageId: string }
  | { type: "UPDATE_SITE_SETTINGS"; settings: SiteSettings };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "RESET_DEMO_DATA":
      return createSeedState();

    case "SET_CURRENT_USER":
      return { ...state, currentUserId: action.userId };

    case "REGISTER_USER":
      return {
        ...state,
        users: [...state.users, action.user],
        userPasswords: {
          ...state.userPasswords,
          [action.user.email.toLowerCase()]: action.password,
        },
      };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.userId ? { ...u, ...action.patch } : u
        ),
        facultyProfiles: state.facultyProfiles.map((f) =>
          f.id === action.userId ? { ...f, ...action.patch, role: "faculty" } : f
        ),
        alumniProfiles: state.alumniProfiles.map((a) =>
          a.id === action.userId ? { ...a, ...action.patch, role: "alumni" } : a
        ),
      };

    case "CHANGE_USER_ROLE":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.userId ? { ...u, role: action.role } : u
        ),
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.userId),
        facultyProfiles: state.facultyProfiles.filter((f) => f.id !== action.userId),
        alumniProfiles: state.alumniProfiles.filter((a) => a.id !== action.userId),
        currentUserId:
          state.currentUserId === action.userId ? null : state.currentUserId,
      };

    case "UPDATE_FACULTY_PROFILE":
      return {
        ...state,
        facultyProfiles: state.facultyProfiles.map((f) =>
          f.id === action.facultyId ? { ...f, ...action.patch } : f
        ),
        users: state.users.map((u) =>
          u.id === action.facultyId
            ? {
                ...u,
                name: action.patch.name ?? u.name,
                bio: action.patch.bio ?? u.bio,
                department: action.patch.department ?? u.department,
              }
            : u
        ),
      };

    case "ADD_FACULTY_PROFILE":
      return {
        ...state,
        facultyProfiles: [...state.facultyProfiles, action.faculty],
        users: [...state.users, action.faculty],
        userPasswords: {
          ...state.userPasswords,
          [action.faculty.email.toLowerCase()]: action.password,
        },
      };

    case "UPDATE_ALUMNI_PROFILE":
      return {
        ...state,
        alumniProfiles: state.alumniProfiles.map((a) =>
          a.id === action.alumniId ? { ...a, ...action.patch } : a
        ),
        users: state.users.map((u) =>
          u.id === action.alumniId
            ? {
                ...u,
                name: action.patch.name ?? u.name,
                bio: action.patch.bio ?? u.bio,
              }
            : u
        ),
      };

    case "ENROLL_COURSES": {
      const existingIds = new Set(
        state.enrollments
          .filter((e) => e.userId === action.userId)
          .map((e) => e.courseId)
      );
      const toAdd = action.courseIds.filter((id) => !existingIds.has(id));
      if (toAdd.length === 0) return state;

      const now = new Date().toISOString();
      const newEnrollments: Enrollment[] = toAdd.map((courseId) => ({
        userId: action.userId,
        courseId,
        enrolledAt: now,
        progress: 10,
      }));

      return {
        ...state,
        enrollments: [...state.enrollments, ...newEnrollments],
        courses: state.courses.map((c) =>
          toAdd.includes(c.id)
            ? { ...c, seatsTaken: Math.min(c.seatsTotal, c.seatsTaken + 1) }
            : c
        ),
      };
    }

    case "UNENROLL_COURSE": {
      const existed = state.enrollments.some(
        (e) => e.userId === action.userId && e.courseId === action.courseId
      );
      if (!existed) return state;
      return {
        ...state,
        enrollments: state.enrollments.filter(
          (e) => !(e.userId === action.userId && e.courseId === action.courseId)
        ),
        courses: state.courses.map((c) =>
          c.id === action.courseId
            ? { ...c, seatsTaken: Math.max(0, c.seatsTaken - 1) }
            : c
        ),
      };
    }

    case "ADVANCE_PROGRESS":
      return {
        ...state,
        enrollments: state.enrollments.map((e) =>
          e.userId === action.userId && e.courseId === action.courseId
            ? { ...e, progress: Math.min(100, e.progress + (action.delta ?? 20)) }
            : e
        ),
      };

    case "TOGGLE_SAVE_COURSE": {
      const current = state.savedCourseIds[action.userId] ?? [];
      const exists = current.includes(action.courseId);
      const updated = exists
        ? current.filter((id) => id !== action.courseId)
        : [...current, action.courseId];
      return {
        ...state,
        savedCourseIds: {
          ...state.savedCourseIds,
          [action.userId]: updated,
        },
      };
    }

    case "SAVE_PREFERENCES":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.key]: action.prefs,
        },
      };

    case "ADD_COURSE":
      return {
        ...state,
        courses: [...state.courses, action.course],
      };

    case "UPDATE_COURSE":
      return {
        ...state,
        courses: state.courses.map((c) =>
          c.id === action.courseId ? { ...c, ...action.patch } : c
        ),
      };

    case "ADD_MATERIAL":
      return {
        ...state,
        materials: [action.material, ...state.materials],
      };

    case "DELETE_MATERIAL":
      return {
        ...state,
        materials: state.materials.filter((m) => m.id !== action.materialId),
      };

    case "ADD_REVIEW": {
      const nextReviews = [action.review, ...state.reviews];
      let nextCourses = state.courses;
      if (action.review.targetType === "course") {
        const courseReviews = nextReviews.filter(
          (r) =>
            r.targetType === "course" &&
            r.targetId === action.review.targetId &&
            r.status === "visible"
        );
        const avg =
          courseReviews.length > 0
            ? Number(
                (
                  courseReviews.reduce((s, r) => s + r.rating, 0) /
                  courseReviews.length
                ).toFixed(1)
              )
            : 0;
        nextCourses = state.courses.map((c) =>
          c.id === action.review.targetId
            ? { ...c, rating: avg, reviewCount: courseReviews.length }
            : c
        );
      }
      return {
        ...state,
        reviews: nextReviews,
        courses: nextCourses,
      };
    }

    case "TOGGLE_REVIEW_VISIBILITY": {
      const nextReviews = state.reviews.map((r) =>
        r.id === action.reviewId
          ? {
              ...r,
              status: (r.status === "visible" ? "hidden" : "visible") as
                | "visible"
                | "hidden",
            }
          : r
      );
      return { ...state, reviews: nextReviews };
    }

    case "REPLY_TO_REVIEW":
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === action.reviewId
            ? {
                ...r,
                reply: {
                  id: `rep-${Date.now()}`,
                  authorId: action.authorId,
                  content: action.content,
                  createdAt: new Date().toISOString(),
                },
              }
            : r
        ),
      };

    case "CREATE_POST":
      return { ...state, posts: [action.post, ...state.posts] };

    case "TOGGLE_LIKE_POST":
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== action.postId) return p;
          const liked = p.likes.includes(action.userId);
          return {
            ...p,
            likes: liked
              ? p.likes.filter((id) => id !== action.userId)
              : [...p.likes, action.userId],
          };
        }),
      };

    case "TOGGLE_POST_VISIBILITY":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.postId
            ? {
                ...p,
                status: (p.status === "visible" ? "hidden" : "visible") as
                  | "visible"
                  | "hidden",
              }
            : p
        ),
      };

    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.postId),
        comments: state.comments.filter((c) => c.postId !== action.postId),
      };

    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.comment] };

    case "DELETE_COMMENT":
      return {
        ...state,
        comments: state.comments.filter((c) => c.id !== action.commentId),
      };

    case "ADD_REPORT":
      return { ...state, reports: [action.report, ...state.reports] };

    case "UPDATE_REPORT":
      return {
        ...state,
        reports: state.reports.map((r) =>
          r.id === action.reportId
            ? { ...r, status: action.status, resolutionNote: action.resolutionNote }
            : r
        ),
      };

    case "ADD_MODERATION_LOG":
      return {
        ...state,
        moderationLogs: [action.log, ...state.moderationLogs],
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };

    case "ADD_NOTIFICATIONS":
      return {
        ...state,
        notifications: [...action.notifications, ...state.notifications],
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n
        ),
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.userId === action.userId ? { ...n, read: true } : n
        ),
      };

    case "ADD_ANNOUNCEMENT":
      return {
        ...state,
        announcements: [action.announcement, ...state.announcements],
      };

    case "UPDATE_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.map((a) =>
          a.id === action.announcementId ? { ...a, ...action.patch } : a
        ),
      };

    case "DELETE_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.filter(
          (a) => a.id !== action.announcementId
        ),
      };

    case "SAVE_ATTENDANCE": {
      const existingIdx = state.attendance.findIndex(
        (a) =>
          a.batch === action.record.batch &&
          a.courseId === action.record.courseId &&
          a.date === action.record.date
      );
      if (existingIdx >= 0) {
        const next = [...state.attendance];
        next[existingIdx] = action.record;
        return { ...state, attendance: next };
      }
      return { ...state, attendance: [action.record, ...state.attendance] };
    }

    case "ADD_ASSIGNMENT":
      return { ...state, assignments: [action.assignment, ...state.assignments] };

    case "SUBMIT_ASSIGNMENT":
      return {
        ...state,
        assignments: state.assignments.map((a) => {
          if (a.id !== action.assignmentId) return a;
          if (a.submissions.some((s) => s.studentId === action.studentId)) return a;
          return {
            ...a,
            submissions: [
              ...a.submissions,
              { studentId: action.studentId, submittedAt: new Date().toISOString() },
            ],
          };
        }),
      };

    case "SEND_CONNECTION":
      return {
        ...state,
        connections: [action.connection, ...state.connections],
      };

    case "RESPOND_CONNECTION":
      return {
        ...state,
        connections: state.connections.map((c) =>
          c.id === action.connectionId ? { ...c, status: action.status } : c
        ),
      };

    case "REQUEST_MENTORSHIP":
      return {
        ...state,
        mentorships: [action.mentorship, ...state.mentorships],
      };

    case "RESPOND_MENTORSHIP":
      return {
        ...state,
        mentorships: state.mentorships.map((m) =>
          m.id === action.mentorshipId ? { ...m, status: action.status } : m
        ),
      };

    case "UPDATE_MENTORSHIP_NOTES":
      return {
        ...state,
        mentorships: state.mentorships.map((m) =>
          m.id === action.mentorshipId ? { ...m, notes: action.notes } : m
        ),
      };

    case "SEND_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };

    case "MARK_MESSAGE_READ":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.messageId ? { ...m, read: true } : m
        ),
      };

    case "ADD_JOB":
      return { ...state, jobs: [action.job, ...state.jobs] };

    case "UPDATE_JOB":
      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === action.jobId ? { ...j, ...action.patch } : j
        ),
      };

    case "DELETE_JOB":
      return { ...state, jobs: state.jobs.filter((j) => j.id !== action.jobId) };

    case "APPLY_JOB":
      return {
        ...state,
        jobs: state.jobs.map((j) => {
          if (j.id !== action.jobId) return j;
          if (j.applicants.some((a) => a.userId === action.userId)) return j;
          return {
            ...j,
            applicants: [
              ...j.applicants,
              { userId: action.userId, appliedAt: new Date().toISOString() },
            ],
          };
        }),
      };

    case "ADD_EVENT":
      return { ...state, events: [action.event, ...state.events] };

    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((ev) =>
          ev.id === action.eventId ? { ...ev, ...action.patch } : ev
        ),
      };

    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((ev) => ev.id !== action.eventId),
      };

    case "TOGGLE_EVENT_RSVP":
      return {
        ...state,
        events: state.events.map((ev) => {
          if (ev.id !== action.eventId) return ev;
          const joined = ev.attendees.includes(action.userId);
          return {
            ...ev,
            attendees: joined
              ? ev.attendees.filter((id) => id !== action.userId)
              : [...ev.attendees, action.userId],
          };
        }),
      };

    case "ADD_SUPPORT_MESSAGE":
      return {
        ...state,
        supportMessages: [action.message, ...state.supportMessages],
      };

    case "TOGGLE_SUPPORT_HANDLED":
      return {
        ...state,
        supportMessages: state.supportMessages.map((s) =>
          s.id === action.messageId ? { ...s, handled: !s.handled } : s
        ),
      };

    case "UPDATE_SITE_SETTINGS":
      return { ...state, siteSettings: action.settings };

    default:
      return state;
  }
}

export type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface AppStoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  hydrated: boolean;
  currentUser: User | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  resetDemoData: () => void;
}

const AppStoreContext = createContext<AppStoreContextValue | undefined>(undefined);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createSeedState);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed && Array.isArray(parsed.courses) && Array.isArray(parsed.users)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      // Ignore corrupted storage and fall back to seed state
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state, hydrated]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetDemoData = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    dispatch({ type: "RESET_DEMO_DATA" });
    showToast("Demo data restored to initial ULAB seed state.", "info");
  }, [showToast]);

  const currentUser =
    state.users.find((u) => u.id === state.currentUserId) ?? null;

  return (
    <AppStoreContext.Provider
      value={{
        state,
        dispatch,
        hydrated,
        currentUser,
        showToast,
        resetDemoData,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-foreground text-white px-4 py-3 shadow-[var(--shadow-modal)] transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            {toast.variant === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : toast.variant === "info" ? (
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="opacity-70 hover:opacity-100 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreContextValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used inside <AppStoreProvider>");
  }
  return ctx;
}
