import type { AppAction, AppState } from "../store/AppStore";
import type { Course, Enrollment, StudentPreferences } from "../types";

export function getMyEnrollments(
  state: AppState,
  userId: string
): Array<Enrollment & { course: Course }> {
  return state.enrollments
    .filter((e) => e.userId === userId)
    .map((e) => {
      const course = state.courses.find((c) => c.id === e.courseId);
      return course ? { ...e, course } : null;
    })
    .filter((item): item is Enrollment & { course: Course } => item !== null);
}

export function isEnrolledInCourse(
  state: AppState,
  userId: string | null | undefined,
  courseId: string
): boolean {
  if (!userId) return false;
  return state.enrollments.some(
    (e) => e.userId === userId && e.courseId === courseId
  );
}

export function isCourseSaved(
  state: AppState,
  userId: string | null | undefined,
  courseId: string
): boolean {
  const key = userId || "guest";
  return (state.savedCourseIds[key] ?? []).includes(courseId);
}

export function getSavedCourses(state: AppState, userId: string): Course[] {
  const ids = state.savedCourseIds[userId] ?? [];
  return state.courses.filter((c) => ids.includes(c.id));
}

export function enroll(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  userId: string,
  courseId: string
): { ok: boolean; message: string } {
  if (isEnrolledInCourse(state, userId, courseId)) {
    return { ok: false, message: "You are already enrolled in this course." };
  }
  const course = state.courses.find((c) => c.id === courseId);
  if (!course) return { ok: false, message: "Course not found." };
  if (course.seatsTaken >= course.seatsTotal) {
    return { ok: false, message: "No seats remaining in this section." };
  }
  dispatch({ type: "ENROLL_COURSES", userId, courseIds: [courseId] });
  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      id: `notif-${Date.now()}`,
      userId,
      title: `Enrolled in ${course.code}`,
      body: `You are now registered for ${course.title}.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: `/courses/${course.id}`,
    },
  });
  return { ok: true, message: `Enrolled in ${course.code}: ${course.title}` };
}

export function enrollBatch(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  userId: string,
  courseIds: string[]
): { ok: boolean; count: number; message: string } {
  const validIds = courseIds.filter(
    (id) => !isEnrolledInCourse(state, userId, id)
  );
  if (validIds.length === 0) {
    return {
      ok: false,
      count: 0,
      message: "You are already enrolled in all selected courses.",
    };
  }
  dispatch({ type: "ENROLL_COURSES", userId, courseIds: validIds });
  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      id: `notif-${Date.now()}`,
      userId,
      title: "Semester Registration Confirmed",
      body: `Successfully enrolled in ${validIds.length} course(s). View them in your Student Dashboard.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: "/dashboard/student",
    },
  });
  return {
    ok: true,
    count: validIds.length,
    message: `Confirmed enrollment in ${validIds.length} course(s)!`,
  };
}

export function unenroll(
  dispatch: React.Dispatch<AppAction>,
  userId: string,
  courseId: string
) {
  dispatch({ type: "UNENROLL_COURSE", userId, courseId });
}

export function toggleSaveCourse(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  userId: string | null | undefined,
  courseId: string
): boolean {
  const key = userId || "guest";
  const wasSaved = (state.savedCourseIds[key] ?? []).includes(courseId);
  dispatch({ type: "TOGGLE_SAVE_COURSE", userId: key, courseId });
  return !wasSaved;
}

export function advanceProgress(
  dispatch: React.Dispatch<AppAction>,
  userId: string,
  courseId: string
) {
  dispatch({ type: "ADVANCE_PROGRESS", userId, courseId, delta: 20 });
}

export function getPreferences(
  state: AppState,
  userId?: string | null
): StudentPreferences {
  const key = userId || "guest";
  return (
    state.preferences[key] ??
    state.preferences.guest ?? {
      department: "CSE",
      semester: 1,
      creditRange: "3",
      schedule: "morning",
      courseLevel: "beginner",
    }
  );
}

export function savePreferences(
  dispatch: React.Dispatch<AppAction>,
  userId: string | null | undefined,
  prefs: StudentPreferences
) {
  dispatch({
    type: "SAVE_PREFERENCES",
    key: userId || "guest",
    prefs,
  });
}
