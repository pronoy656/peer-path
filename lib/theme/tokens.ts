import type { Department } from "@/lib/types";

export const DEPARTMENT_BADGE_CLASSES: Record<Department, string> = {
  CSE: "bg-blue-50 text-blue-700 border-blue-100",
  BBA: "bg-green-50 text-green-700 border-green-100",
  MSJ: "bg-purple-50 text-purple-700 border-purple-100",
  English: "bg-rose-50 text-rose-700 border-rose-100",
  Bangla: "bg-orange-50 text-orange-700 border-orange-100",
};

export const AVATAR_TINT_CLASSES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-900 border-amber-200",
  navy: "bg-primary/10 text-primary border-primary/20",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  emerald: "bg-green-50 text-green-700 border-green-100",
  violet: "bg-purple-50 text-purple-700 border-purple-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
};

export function getDepartmentBadgeClass(department?: Department | string): string {
  if (department && department in DEPARTMENT_BADGE_CLASSES) {
    return DEPARTMENT_BADGE_CLASSES[department as Department];
  }
  return "bg-muted text-foreground border-border";
}

export function getAvatarTintClass(
  avatarColor?: string,
  department?: Department | string
): string {
  if (avatarColor && avatarColor in AVATAR_TINT_CLASSES) {
    return AVATAR_TINT_CLASSES[avatarColor];
  }
  if (department === "CSE") return AVATAR_TINT_CLASSES.blue;
  if (department === "BBA") return AVATAR_TINT_CLASSES.emerald;
  if (department === "MSJ") return AVATAR_TINT_CLASSES.violet;
  if (department === "English") return AVATAR_TINT_CLASSES.rose;
  if (department === "Bangla") return AVATAR_TINT_CLASSES.orange;
  return AVATAR_TINT_CLASSES.amber;
}
