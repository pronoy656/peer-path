import type { AppAction, AppState } from "../store/AppStore";
import type { AppNotification } from "../types";

export function getNotifications(
  state: AppState,
  userId: string
): AppNotification[] {
  return state.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadCount(state: AppState, userId: string): number {
  return state.notifications.filter((n) => n.userId === userId && !n.read)
    .length;
}

export function markAsRead(
  dispatch: React.Dispatch<AppAction>,
  notificationId: string
) {
  dispatch({ type: "MARK_NOTIFICATION_READ", notificationId });
}

export function markAllAsRead(
  dispatch: React.Dispatch<AppAction>,
  userId: string
) {
  dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ", userId });
}
