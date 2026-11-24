import type { AppAction, AppState } from "../store/AppStore";
import type {
  AlumniProfile,
  Announcement,
  Assignment,
  AttendanceRecord,
  FacultyProfile,
  Job,
  PeerEvent,
  Review,
  User,
} from "../types";

export function getFacultyList(state: AppState): FacultyProfile[] {
  return state.facultyProfiles;
}

export function getFacultyById(
  state: AppState,
  id: string
): FacultyProfile | undefined {
  return state.facultyProfiles.find((f) => f.id === id);
}

export function getFacultyReviews(state: AppState, facultyId: string): Review[] {
  const courseIds = new Set(
    state.courses.filter((c) => c.instructorId === facultyId).map((c) => c.id)
  );
  return state.reviews.filter(
    (r) =>
      r.status === "visible" &&
      ((r.targetType === "faculty" && r.targetId === facultyId) ||
        (r.targetType === "course" && courseIds.has(r.targetId)))
  );
}

export function getStudentsList(state: AppState): User[] {
  return state.users.filter((u) => u.role === "student");
}

export function getStudentById(state: AppState, id: string): User | undefined {
  return state.users.find((u) => u.id === id && u.role === "student");
}

export function getAlumniList(state: AppState): AlumniProfile[] {
  return state.alumniProfiles;
}

export function getAlumniById(
  state: AppState,
  id: string
): AlumniProfile | undefined {
  return state.alumniProfiles.find((a) => a.id === id);
}

export function getJobs(state: AppState): Job[] {
  return [...state.jobs].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export function getJobById(state: AppState, id: string): Job | undefined {
  return state.jobs.find((j) => j.id === id);
}

export function getEvents(state: AppState): PeerEvent[] {
  return [...state.events].sort((a, b) => a.date.localeCompare(b.date));
}

export function sendDirectMessage(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: {
    senderId: string;
    recipientId: string;
    content: string;
    subject?: string;
  }
) {
  const sender = state.users.find((u) => u.id === payload.senderId);
  dispatch({
    type: "SEND_MESSAGE",
    message: {
      id: `msg-${Date.now()}`,
      senderId: payload.senderId,
      recipientId: payload.recipientId,
      subject: payload.subject?.trim() || undefined,
      content: payload.content.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    },
  });
  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      id: `notif-${Date.now()}`,
      userId: payload.recipientId,
      title: `New message from ${sender?.name ?? "PeerPath Member"}`,
      body: payload.subject
        ? `${payload.subject}: ${payload.content.slice(0, 50)}`
        : payload.content.slice(0, 70),
      read: false,
      createdAt: new Date().toISOString(),
    },
  });
}

export function sendConnectionRequest(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  fromUserId: string,
  toUserId: string
): { ok: boolean; message: string } {
  const existing = state.connections.find(
    (c) =>
      (c.fromUserId === fromUserId && c.toUserId === toUserId) ||
      (c.fromUserId === toUserId && c.toUserId === fromUserId)
  );
  if (existing) {
    return {
      ok: false,
      message:
        existing.status === "accepted"
          ? "You are already connected with this peer."
          : "A connection request is already pending.",
    };
  }
  const sender = state.users.find((u) => u.id === fromUserId);
  dispatch({
    type: "SEND_CONNECTION",
    connection: {
      id: `conn-${Date.now()}`,
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  });
  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      id: `notif-${Date.now()}`,
      userId: toUserId,
      title: "New Peer Connection Request",
      body: `${sender?.name ?? "A fellow ULAB student"} wants to connect with you.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: "/dashboard/student",
    },
  });
  return { ok: true, message: "Connection request sent!" };
}

export function requestMentorship(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: { studentId: string; alumniId: string; message: string }
): { ok: boolean; message: string } {
  const existing = state.mentorships.find(
    (m) =>
      m.studentId === payload.studentId &&
      m.alumniId === payload.alumniId &&
      m.status !== "declined"
  );
  if (existing) {
    return {
      ok: false,
      message:
        existing.status === "accepted"
          ? "You are already mentored by this alumni."
          : "You already have a pending mentorship request with this mentor.",
    };
  }
  const student = state.users.find((u) => u.id === payload.studentId);
  dispatch({
    type: "REQUEST_MENTORSHIP",
    mentorship: {
      id: `ment-${Date.now()}`,
      studentId: payload.studentId,
      alumniId: payload.alumniId,
      message: payload.message.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  });
  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      id: `notif-${Date.now()}`,
      userId: payload.alumniId,
      title: "New Mentorship Request",
      body: `${student?.name ?? "A ULAB student"} requested mentorship.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: "/dashboard/alumni",
    },
  });
  return { ok: true, message: "Mentorship request sent to alumni mentor!" };
}

export function createAnnouncementAndNotify(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: Omit<Announcement, "id" | "createdAt">
) {
  const announcement: Announcement = {
    ...payload,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  dispatch({ type: "ADD_ANNOUNCEMENT", announcement });

  const targets = payload.isPlatformWide || payload.batch === "ALL"
    ? state.users
    : state.users.filter(
        (u) => u.role === "student" && u.batch === payload.batch
      );

  const now = new Date().toISOString();
  dispatch({
    type: "ADD_NOTIFICATIONS",
    notifications: targets.map((u, idx) => ({
      id: `notif-${Date.now()}-${idx}`,
      userId: u.id,
      title: announcement.title,
      body: announcement.content.slice(0, 110),
      read: false,
      createdAt: now,
      link: payload.isPlatformWide ? "/" : "/dashboard/student",
    })),
  });
}

export function saveAttendanceRecord(
  dispatch: React.Dispatch<AppAction>,
  record: Omit<AttendanceRecord, "id">
) {
  dispatch({
    type: "SAVE_ATTENDANCE",
    record: {
      ...record,
      id: `att-${record.batch}-${record.courseId}-${record.date}`,
    },
  });
}

export function createAssignment(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: Omit<Assignment, "id" | "submissions">
) {
  const assignment: Assignment = {
    ...payload,
    id: `asg-${Date.now()}`,
    submissions: [],
  };
  dispatch({ type: "ADD_ASSIGNMENT", assignment });

  const batchStudents = state.users.filter(
    (u) => u.role === "student" && u.batch === payload.batch
  );
  const now = new Date().toISOString();
  dispatch({
    type: "ADD_NOTIFICATIONS",
    notifications: batchStudents.map((s, idx) => ({
      id: `notif-${Date.now()}-asg-${idx}`,
      userId: s.id,
      title: `New Assignment: ${payload.title}`,
      body: `Due ${payload.dueDate}. Check your Student Dashboard.`,
      read: false,
      createdAt: now,
      link: "/dashboard/student",
    })),
  });
}
