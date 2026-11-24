import type { AppAction, AppState } from "../store/AppStore";
import type {
  Course,
  CourseMaterial,
  Department,
  Difficulty,
  FacultyProfile,
  Review,
  StudentPreferences,
} from "../types";

export interface CourseSearchParams {
  query?: string;
  department?: Department | "All";
  difficulty?: Difficulty | "All";
  semester?: number | "All";
  includeUnapproved?: boolean;
}

export function getCourses(
  state: AppState,
  includeUnapproved = false
): Course[] {
  return includeUnapproved
    ? state.courses
    : state.courses.filter((c) => c.status === "approved");
}

export function getCourseById(state: AppState, id: string): Course | undefined {
  return state.courses.find((c) => c.id === id);
}

export function searchCourses(
  state: AppState,
  params: CourseSearchParams
): Course[] {
  const q = (params.query ?? "").trim().toLowerCase();
  const base = getCourses(state, params.includeUnapproved);

  return base.filter((course) => {
    const instructor = getInstructorForCourse(state, course);
    const matchesQuery =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      (instructor?.name.toLowerCase().includes(q) ?? false);

    const matchesDept =
      !params.department ||
      params.department === "All" ||
      course.department === params.department;

    const matchesDiff =
      !params.difficulty ||
      params.difficulty === "All" ||
      course.difficulty === params.difficulty;

    const matchesSem =
      !params.semester ||
      params.semester === "All" ||
      course.semester === params.semester;

    return matchesQuery && matchesDept && matchesDiff && matchesSem;
  });
}

export function getInstructorForCourse(
  state: AppState,
  course: Course
): FacultyProfile | undefined {
  return state.facultyProfiles.find((f) => f.id === course.instructorId);
}

export function getCourseReviews(state: AppState, courseId: string): Review[] {
  return state.reviews.filter(
    (r) =>
      r.targetType === "course" &&
      r.targetId === courseId &&
      r.status === "visible"
  );
}

export function getCourseMaterials(
  state: AppState,
  courseId: string
): CourseMaterial[] {
  return state.materials.filter((m) => m.courseId === courseId);
}

export function getRecommendedCourses(
  state: AppState,
  opts: {
    department?: Department;
    semester?: number;
    courseLevel?: StudentPreferences["courseLevel"];
    userId?: string | null;
    excludeIds?: string[];
  }
): Course[] {
  const enrolledIds = new Set(
    opts.userId
      ? state.enrollments
          .filter((e) => e.userId === opts.userId)
          .map((e) => e.courseId)
      : []
  );
  const excluded = new Set(opts.excludeIds ?? []);

  const approved = getCourses(state, false).filter(
    (c) => !enrolledIds.has(c.id) && !excluded.has(c.id)
  );

  const scored = approved.map((course) => {
    let score = course.rating * 2;
    if (opts.department && course.department === opts.department) score += 10;
    if (opts.semester) {
      if (course.semester === opts.semester) score += 6;
      else if (course.semester === opts.semester + 1) score += 8; // next-semester progression
    }
    if (
      opts.courseLevel &&
      course.difficulty.toLowerCase() === opts.courseLevel.toLowerCase()
    ) {
      score += 4;
    }
    return { course, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((s) => s.course);
}

export function addCourseReview(
  dispatch: React.Dispatch<AppAction>,
  payload: {
    courseId: string;
    authorId: string;
    rating: number;
    title?: string;
    content: string;
  }
) {
  dispatch({
    type: "ADD_REVIEW",
    review: {
      id: `rev-${Date.now()}`,
      targetType: "course",
      targetId: payload.courseId,
      authorId: payload.authorId,
      rating: payload.rating,
      title: payload.title?.trim() || undefined,
      content: payload.content.trim(),
      createdAt: new Date().toISOString(),
      status: "visible",
    },
  });
}

export function addFacultyReview(
  dispatch: React.Dispatch<AppAction>,
  payload: {
    facultyId: string;
    authorId: string;
    rating: number;
    content: string;
  }
) {
  dispatch({
    type: "ADD_REVIEW",
    review: {
      id: `rev-${Date.now()}`,
      targetType: "faculty",
      targetId: payload.facultyId,
      authorId: payload.authorId,
      rating: payload.rating,
      content: payload.content.trim(),
      createdAt: new Date().toISOString(),
      status: "visible",
    },
  });
}

export function replyToReview(
  dispatch: React.Dispatch<AppAction>,
  reviewId: string,
  authorId: string,
  content: string
) {
  dispatch({ type: "REPLY_TO_REVIEW", reviewId, authorId, content: content.trim() });
}

export function addCourseMaterial(
  dispatch: React.Dispatch<AppAction>,
  material: Omit<CourseMaterial, "id" | "addedAt">
) {
  dispatch({
    type: "ADD_MATERIAL",
    material: {
      ...material,
      id: `mat-${Date.now()}`,
      addedAt: new Date().toISOString(),
    },
  });
}

export function approveCourse(
  dispatch: React.Dispatch<AppAction>,
  courseId: string
) {
  dispatch({ type: "UPDATE_COURSE", courseId, patch: { status: "approved" } });
}

export function rejectCourse(
  dispatch: React.Dispatch<AppAction>,
  courseId: string
) {
  dispatch({ type: "UPDATE_COURSE", courseId, patch: { status: "rejected" } });
}

export function createCourse(
  dispatch: React.Dispatch<AppAction>,
  course: Omit<Course, "id" | "rating" | "reviewCount" | "seatsTaken">
) {
  dispatch({
    type: "ADD_COURSE",
    course: {
      ...course,
      id: `${Date.now()}`,
      rating: 4.5,
      reviewCount: 0,
      seatsTaken: 0,
    },
  });
}

export function updateCourse(
  dispatch: React.Dispatch<AppAction>,
  courseId: string,
  patch: Partial<Course>
) {
  dispatch({ type: "UPDATE_COURSE", courseId, patch });
}
