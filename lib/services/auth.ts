import type { AppAction, AppState } from "../store/AppStore";
import type { Department, Role, User } from "../types";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../data/users";

export function getDashboardPathForRole(role: Role): string {
  switch (role) {
    case "student":
      return "/dashboard/student";
    case "faculty":
      return "/dashboard/faculty";
    case "teacher":
      return "/dashboard/teacher";
    case "moderator":
      return "/dashboard/moderator";
    case "alumni":
      return "/dashboard/alumni";
    case "admin":
      return "/dashboard/admin";
  }
}

export function getDemoAccounts() {
  return DEMO_ACCOUNTS;
}

export function getDemoPassword() {
  return DEMO_PASSWORD;
}

export function getSession(state: AppState): User | null {
  if (!state.currentUserId) return null;
  return state.users.find((u) => u.id === state.currentUserId) ?? null;
}

export function signIn(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  email: string,
  password: string
): { ok: true; user: User; dashboardPath: string } | { ok: false; error: string } {
  const normalized = email.trim().toLowerCase();
  const user = state.users.find((u) => u.email.toLowerCase() === normalized);
  if (!user) {
    return { ok: false, error: "No PeerPath account found with that email." };
  }
  const expected = state.userPasswords[normalized] ?? DEMO_PASSWORD;
  if (password !== expected) {
    return { ok: false, error: "Incorrect password. Demo accounts use demo1234." };
  }
  dispatch({ type: "SET_CURRENT_USER", userId: user.id });
  return { ok: true, user, dashboardPath: getDashboardPathForRole(user.role) };
}

export function signInDemoRole(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  role: Role
): { ok: true; user: User; dashboardPath: string } | { ok: false; error: string } {
  const demo = DEMO_ACCOUNTS.find((a) => a.role === role);
  if (!demo) return { ok: false, error: "Demo account not configured." };
  const user =
    state.users.find((u) => u.id === demo.userId) ??
    state.users.find((u) => u.email.toLowerCase() === demo.email.toLowerCase());
  if (!user) return { ok: false, error: "Demo user missing from store." };
  dispatch({ type: "SET_CURRENT_USER", userId: user.id });
  return { ok: true, user, dashboardPath: demo.dashboardPath };
}

export function signUp(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: {
    name: string;
    email: string;
    password: string;
    department: Department;
    batch: string;
  }
): { ok: true; user: User; dashboardPath: string } | { ok: false; error: string } {
  const normalized = payload.email.trim().toLowerCase();
  if (!payload.name.trim()) return { ok: false, error: "Full name is required." };
  if (!normalized.includes("@")) return { ok: false, error: "Enter a valid email address." };
  if (payload.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  if (state.users.some((u) => u.email.toLowerCase() === normalized)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const newUser: User = {
    id: `u-student-${Date.now()}`,
    name: payload.name.trim(),
    email: normalized,
    role: "student",
    department: payload.department,
    batch: payload.batch.trim() || "241",
    studentId: `${payload.batch.trim() || "241"}014${Math.floor(100 + Math.random() * 899)}`,
    interests: [payload.department],
    bio: `ULAB ${payload.department} student (Batch ${payload.batch.trim() || "241"}).`,
    avatarColor: "#eab308",
    createdAt: new Date().toISOString(),
  };

  dispatch({ type: "REGISTER_USER", user: newUser, password: payload.password });
  dispatch({ type: "SET_CURRENT_USER", userId: newUser.id });
  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: "Welcome to ULAB PeerPath!",
      body: `Start discovering ${payload.department} courses and connecting with peers.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: "/discover",
    },
  });

  return { ok: true, user: newUser, dashboardPath: "/dashboard/student" };
}

export function signOut(dispatch: React.Dispatch<AppAction>) {
  dispatch({ type: "SET_CURRENT_USER", userId: null });
}

export function forgotPassword(email: string): { ok: boolean; message: string } {
  if (!email.trim() || !email.includes("@")) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  return {
    ok: true,
    message: `If an account exists for ${email.trim()}, a reset link was sent.`,
  };
}
