import type { AppAction, AppState } from "../store/AppStore";
import type { Report } from "../types";

export function createReport(
  dispatch: React.Dispatch<AppAction>,
  payload: {
    reporterId: string;
    targetType: Report["targetType"];
    targetId: string;
    reason: string;
  }
) {
  const report: Report = {
    id: `rep-${Date.now()}`,
    reporterId: payload.reporterId,
    targetType: payload.targetType,
    targetId: payload.targetId,
    reason: payload.reason.trim(),
    status: "open",
    createdAt: new Date().toISOString(),
  };
  dispatch({ type: "ADD_REPORT", report });
  return report;
}

export function reviewReports(state: AppState, status?: Report["status"]) {
  if (!status) return state.reports;
  return state.reports.filter((r) => r.status === status);
}

export function resolveReport(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: {
    reportId: string;
    moderatorId: string;
    action: "hide" | "delete" | "warn" | "none";
    note?: string;
  }
) {
  const report = state.reports.find((r) => r.id === payload.reportId);
  if (!report) return;

  if (payload.action === "hide") {
    if (report.targetType === "post") {
      const post = state.posts.find((p) => p.id === report.targetId);
      if (post && post.status === "visible") {
        dispatch({ type: "TOGGLE_POST_VISIBILITY", postId: post.id });
      }
    } else if (report.targetType === "review") {
      const rev = state.reviews.find((r) => r.id === report.targetId);
      if (rev && rev.status === "visible") {
        dispatch({ type: "TOGGLE_REVIEW_VISIBILITY", reviewId: rev.id });
      }
    }
  } else if (payload.action === "delete") {
    if (report.targetType === "post") {
      dispatch({ type: "DELETE_POST", postId: report.targetId });
    } else if (report.targetType === "comment") {
      dispatch({ type: "DELETE_COMMENT", commentId: report.targetId });
    }
  }

  dispatch({
    type: "UPDATE_REPORT",
    reportId: payload.reportId,
    status: "resolved",
    resolutionNote: payload.note || `Resolved with action: ${payload.action}`,
  });

  dispatch({
    type: "ADD_MODERATION_LOG",
    log: {
      id: `modlog-${Date.now()}`,
      moderatorId: payload.moderatorId,
      action: `Resolved report (${payload.action})`,
      targetType: report.targetType,
      targetId: report.targetId,
      details: payload.note || report.reason,
      createdAt: new Date().toISOString(),
    },
  });
}

export function dismissReport(
  dispatch: React.Dispatch<AppAction>,
  reportId: string,
  moderatorId: string
) {
  dispatch({
    type: "UPDATE_REPORT",
    reportId,
    status: "dismissed",
    resolutionNote: "Dismissed after review",
  });
  dispatch({
    type: "ADD_MODERATION_LOG",
    log: {
      id: `modlog-${Date.now()}`,
      moderatorId,
      action: "Dismissed report",
      targetType: "report",
      targetId: reportId,
      details: "No community policy violation found.",
      createdAt: new Date().toISOString(),
    },
  });
}

export function hidePost(
  dispatch: React.Dispatch<AppAction>,
  postId: string,
  moderatorId: string
) {
  dispatch({ type: "TOGGLE_POST_VISIBILITY", postId });
  dispatch({
    type: "ADD_MODERATION_LOG",
    log: {
      id: `modlog-${Date.now()}`,
      moderatorId,
      action: "Toggled post visibility",
      targetType: "post",
      targetId: postId,
      details: "Updated post visibility from moderation panel.",
      createdAt: new Date().toISOString(),
    },
  });
}

export function warnUser(
  dispatch: React.Dispatch<AppAction>,
  payload: { userId: string; moderatorId: string; reason: string }
) {
  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      id: `notif-${Date.now()}`,
      userId: payload.userId,
      title: "Community Guidelines Warning",
      body: payload.reason,
      read: false,
      createdAt: new Date().toISOString(),
      link: "/community",
    },
  });
  dispatch({
    type: "ADD_MODERATION_LOG",
    log: {
      id: `modlog-${Date.now()}`,
      moderatorId: payload.moderatorId,
      action: "Warned user",
      targetType: "user",
      targetId: payload.userId,
      details: payload.reason,
      createdAt: new Date().toISOString(),
    },
  });
}

export function toggleSuspendUser(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  userId: string,
  moderatorId: string
): boolean {
  const user = state.users.find((u) => u.id === userId);
  const nextSuspended = !(user?.suspended ?? false);
  dispatch({
    type: "UPDATE_USER",
    userId,
    patch: { suspended: nextSuspended },
  });
  dispatch({
    type: "ADD_MODERATION_LOG",
    log: {
      id: `modlog-${Date.now()}`,
      moderatorId,
      action: nextSuspended ? "Suspended user" : "Unsuspended user",
      targetType: "user",
      targetId: userId,
      details: `${user?.name ?? userId} ${
        nextSuspended ? "can no longer post or comment" : "posting privileges restored"
      }.`,
      createdAt: new Date().toISOString(),
    },
  });
  return nextSuspended;
}
