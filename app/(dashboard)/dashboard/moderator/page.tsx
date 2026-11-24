"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  FileWarning,
  History,
  LayoutDashboard,
  MessageSquare,
  ShieldAlert,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import DashboardShell, {
  type DashboardNavItem,
} from "@/components/dashboard/DashboardShell";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import { useAppStore } from "@/lib/store/AppStore";
import {
  deleteComment,
  deletePost,
  getPosts,
} from "@/lib/services/community";
import {
  dismissReport,
  hidePost,
  resolveReport,
  toggleSuspendUser,
  warnUser,
} from "@/lib/services/moderation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ModeratorDashboardPage() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [postQuery, setPostQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "post" | "comment";
    id: string;
  } | null>(null);

  const modId = currentUser?.id ?? "u-moderator-1";
  const openReports = state.reports.filter((r) => r.status === "open");
  const allPosts = getPosts(state, { includeHidden: true, query: postQuery });
  const hiddenPostsCount = state.posts.filter(
    (p) => p.status === "hidden"
  ).length;
  const hiddenReviewsCount = state.reviews.filter(
    (r) => r.status === "hidden"
  ).length;

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "reports", label: "Reports Queue", icon: <ShieldAlert className="w-4 h-4" />, badge: openReports.length },
    { id: "posts", label: "Community Posts", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "logs", label: "Activity Log", icon: <History className="w-4 h-4" /> },
  ];

  const getTargetPreview = (targetType: string, targetId: string) => {
    if (targetType === "post") {
      const p = state.posts.find((x) => x.id === targetId);
      return p ? p.content : "[Deleted post]";
    }
    if (targetType === "comment") {
      const c = state.comments.find((x) => x.id === targetId);
      return c ? c.content : "[Deleted comment]";
    }
    if (targetType === "review") {
      const r = state.reviews.find((x) => x.id === targetId);
      return r ? r.content : "[Review]";
    }
    const u = state.users.find((x) => x.id === targetId);
    return u ? `${u.name} (${u.email})` : targetId;
  };

  const filteredUsers = state.users.filter(
    (u) =>
      u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <DashboardShell
      allowedRole="moderator"
      roleTitle="Moderation Center"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Open Reports</p>
              <p className="text-3xl font-bold mt-1 text-red-600">
                {openReports.length}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Community Posts</p>
              <p className="text-3xl font-bold mt-1">{state.posts.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Hidden Items</p>
              <p className="text-3xl font-bold mt-1">
                {hiddenPostsCount + hiddenReviewsCount}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Moderation Actions</p>
              <p className="text-3xl font-bold mt-1">
                {state.moderationLogs.length}
              </p>
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Recent Moderation Activity</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveTab("reports")}
              >
                Open Queue ({openReports.length})
              </Button>
            </div>
            {state.moderationLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <div>
                  <span className="font-semibold">{log.action}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    • {log.details}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4">
          {state.reports.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="font-semibold text-lg">Reports queue is clear</p>
            </Card>
          ) : (
            state.reports.map((rep) => {
              const reporter = state.users.find((u) => u.id === rep.reporterId);
              return (
                <Card key={rep.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileWarning className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-secondary">
                        {rep.targetType}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          rep.status === "open"
                            ? "bg-red-100 text-red-700"
                            : rep.status === "resolved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Reported by {reporter?.name ?? "User"} •{" "}
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm font-medium">Reason: {rep.reason}</p>
                  <div className="p-3 rounded-xl bg-muted/60 text-xs text-foreground/80">
                    <span className="font-semibold">Target preview: </span>
                    {getTargetPreview(rep.targetType, rep.targetId)}
                  </div>

                  {rep.status === "open" && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white gap-1"
                        onClick={() => {
                          resolveReport(state, dispatch, {
                            reportId: rep.id,
                            moderatorId: modId,
                            action: "hide",
                            note: "Hidden by moderator due to report.",
                          });
                          showToast("Target hidden & report resolved!");
                        }}
                      >
                        <EyeOff className="w-4 h-4" /> Resolve &amp; Hide
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        onClick={() => {
                          resolveReport(state, dispatch, {
                            reportId: rep.id,
                            moderatorId: modId,
                            action: "none",
                            note: "Reviewed and resolved.",
                          });
                          showToast("Report marked resolved.");
                        }}
                      >
                        <Check className="w-4 h-4" /> Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => {
                          dismissReport(dispatch, rep.id, modId);
                          showToast("Report dismissed.", "info");
                        }}
                      >
                        <X className="w-4 h-4" /> Dismiss
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === "posts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search community posts or authors..."
              value={postQuery}
              onChange={(e) => setPostQuery(e.target.value)}
              className="px-4 py-2.5 border rounded-xl text-sm w-full max-w-md bg-card"
            />
          </div>

          {allPosts.map((post) => (
            <Card key={post.id} className="p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-primary">
                    {post.group || "General"}
                  </span>
                  <span className="text-sm font-semibold ml-2">
                    {post.author?.name ?? "User"}
                  </span>
                  {post.status === "hidden" && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      hidePost(dispatch, post.id, modId);
                      showToast(
                        post.status === "visible"
                          ? "Post hidden from public feed."
                          : "Post restored to public feed.",
                        "info"
                      );
                    }}
                  >
                    {post.status === "visible" ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" /> Unhide
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() =>
                      setConfirmDelete({ type: "post", id: post.id })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-foreground/85">{post.content}</p>

              {post.comments.length > 0 && (
                <div className="pl-4 border-l-2 space-y-2 pt-1">
                  {post.comments.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-2 text-xs bg-muted/40 p-2 rounded-lg"
                    >
                      <span>
                        <strong>{c.author?.name ?? "User"}:</strong>{" "}
                        {c.content}
                      </span>
                      <button
                        type="button"
                        aria-label="Delete comment"
                        onClick={() =>
                          setConfirmDelete({ type: "comment", id: c.id })
                        }
                        className="text-red-600 hover:underline shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-3">
          {state.reviews.map((rev) => {
            const author = state.users.find((u) => u.id === rev.authorId);
            return (
              <Card
                key={rev.id}
                className="p-5 flex flex-wrap items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold uppercase text-primary">
                      {rev.targetType}
                    </span>
                    <span className="font-semibold">
                      {author?.name ?? "Student"} • {rev.rating}/5 ★
                    </span>
                    {rev.status === "hidden" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/85">{rev.content}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch({
                      type: "TOGGLE_REVIEW_VISIBILITY",
                      reviewId: rev.id,
                    });
                    showToast(
                      rev.status === "visible"
                        ? "Review hidden."
                        : "Review made visible.",
                      "info"
                    );
                  }}
                >
                  {rev.status === "visible" ? "Hide Review" : "Unhide Review"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "users" && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              Community Members ({filteredUsers.length})
            </h2>
            <input
              type="text"
              placeholder="Search user name or email..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="px-3.5 py-2 border rounded-xl text-sm w-full sm:w-64"
            />
          </div>

          <div className="space-y-2.5">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{u.name}</span>
                    <span className="text-[11px] uppercase px-2 py-0.5 rounded-full bg-secondary font-medium">
                      {u.role}
                    </span>
                    {u.suspended && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                        Suspended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>

                {u.id !== modId && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-amber-700"
                      onClick={() => {
                        warnUser(dispatch, {
                          userId: u.id,
                          moderatorId: modId,
                          reason:
                            "Please follow ULAB PeerPath respectful community guidelines.",
                        });
                        showToast(`Warning notification sent to ${u.name}.`);
                      }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Warn
                    </Button>
                    <Button
                      size="sm"
                      variant={u.suspended ? "default" : "destructive"}
                      onClick={() => {
                        const nowSuspended = toggleSuspendUser(
                          state,
                          dispatch,
                          u.id,
                          modId
                        );
                        showToast(
                          nowSuspended
                            ? `${u.name} suspended from posting/commenting.`
                            : `${u.name} unsuspended.`,
                          "info"
                        );
                      }}
                    >
                      {u.suspended ? "Unsuspend" : "Suspend"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "logs" && (
        <Card className="p-6 space-y-3">
          <h2 className="text-lg font-bold">Moderation Activity Log</h2>
          {state.moderationLogs.map((log) => {
            const actor = state.users.find((u) => u.id === log.moderatorId);
            return (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border text-sm flex flex-wrap justify-between gap-2"
              >
                <div>
                  <span className="font-bold">{log.action}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    by {actor?.name ?? "Moderator"} — {log.details}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            );
          })}
        </Card>
      )}

      <ConfirmDialog
        open={confirmDelete !== null}
        title={`Delete ${confirmDelete?.type ?? "item"}?`}
        description="This permanently removes the content from the Community feed."
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete?.type === "post") {
            deletePost(dispatch, confirmDelete.id);
            showToast("Post deleted.", "info");
          } else if (confirmDelete?.type === "comment") {
            deleteComment(dispatch, confirmDelete.id);
            showToast("Comment deleted.", "info");
          }
          setConfirmDelete(null);
        }}
      />
    </DashboardShell>
  );
}
