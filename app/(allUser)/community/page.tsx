"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flag,
  Heart,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import {
  addComment,
  createPost,
  getPosts,
  likePost,
} from "@/lib/services/community";
import { createReport } from "@/lib/services/moderation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GROUPS = ["All", "General", "CSE", "BBA", "MSJ", "English", "Bangla"];
const REPORT_REASONS = [
  "Off-topic or spam",
  "Harassment or disrespectful language",
  "Misleading course or advising information",
  "Academic integrity concern",
  "Other",
];

export default function CommunityPage() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const [selectedGroup, setSelectedGroup] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postGroup, setPostGroup] = useState("General");

  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {}
  );

  const [reportTarget, setReportTarget] = useState<{
    targetType: "post" | "comment";
    targetId: string;
    preview: string;
  } | null>(null);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportExtra, setReportExtra] = useState("");

  const posts = getPosts(state, {
    group: selectedGroup,
    query: searchQuery,
    includeHidden: false,
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in to post in the ULAB Community.", "info");
      router.push("/signIn");
      return;
    }
    const res = createPost(state, dispatch, {
      authorId: currentUser.id,
      content: postContent,
      group: postGroup,
    });
    if (!res.ok) {
      showToast(res.error, "error");
      return;
    }
    setPostContent("");
    if (selectedGroup !== "All" && selectedGroup !== postGroup) {
      setSelectedGroup("All");
    }
    showToast("Post published to the ULAB Community feed!");
  };

  const handleLike = (postId: string) => {
    if (!currentUser) {
      showToast("Please sign in to like posts.", "info");
      router.push("/signIn");
      return;
    }
    likePost(dispatch, postId, currentUser.id);
  };

  const toggleComments = (postId: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in to comment.", "info");
      router.push("/signIn");
      return;
    }
    const text = commentDrafts[postId] ?? "";
    const res = addComment(state, dispatch, {
      postId,
      authorId: currentUser.id,
      content: text,
    });
    if (!res.ok) {
      showToast(res.error, "error");
      return;
    }
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    if (!expandedPostIds.includes(postId)) {
      setExpandedPostIds((prev) => [...prev, postId]);
    }
    showToast("Comment added!");
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget) return;
    if (!currentUser) {
      showToast("Please sign in to submit a moderation report.", "info");
      setReportTarget(null);
      router.push("/signIn");
      return;
    }
    const fullReason = reportExtra.trim()
      ? `${reportReason}: ${reportExtra.trim()}`
      : reportReason;
    createReport(dispatch, {
      reporterId: currentUser.id,
      targetType: reportTarget.targetType,
      targetId: reportTarget.targetId,
      reason: fullReason,
    });
    setReportTarget(null);
    setReportExtra("");
    showToast("Report sent to ULAB moderators for review.", "info");
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-yellow-400 p-8 sm:p-10 shadow-sm">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-2">
            ULAB Campus Community
          </h1>
          <p className="text-slate-900/85 text-base sm:text-lg max-w-2xl">
            Ask seniors about courses, form study or case-competition teams, and
            discuss campus life across CSE, BBA, MSJ, English &amp; Bangla.
          </p>
        </div>

        {/* Create Post Composer */}
        <Card className="p-6">
          {currentUser ? (
            currentUser.suspended ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
                Your account is currently suspended from posting or commenting.
                Contact a moderator or admin for review.
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm">
                    Ask a question or share an update as {currentUser.name}
                  </span>
                  <select
                    aria-label="Select post group"
                    value={postGroup}
                    onChange={(e) => setPostGroup(e.target.value)}
                    className="px-3 py-1.5 border rounded-xl text-xs font-semibold bg-background"
                  >
                    {GROUPS.filter((g) => g !== "All").map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  ref={composerRef}
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Ask seniors about a course, lab partner, or semester workload..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold gap-2"
                  >
                    <Send className="w-4 h-4" /> Post to Feed
                  </Button>
                </div>
              </form>
            )
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-base">Join the conversation</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in with a student, faculty, or alumni account to post,
                  like, comment, or report.
                </p>
              </div>
              <Link href="/signIn">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold">
                  Sign In to Post
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Search & Group Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search discussions by topic, course code, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-xl bg-card focus:ring-2 focus:ring-yellow-400 outline-none text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGroup(g)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  selectedGroup === g
                    ? "bg-slate-900 text-white"
                    : "bg-card border text-foreground hover:bg-muted"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        {posts.length === 0 ? (
          <Card className="p-12 text-center border-dashed space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-bold">No posts in this view yet</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start a conversation for{" "}
              {selectedGroup === "All" ? "the community" : selectedGroup} or
              reset your search.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                onClick={() => {
                  if (selectedGroup !== "All") setPostGroup(selectedGroup);
                  composerRef.current?.focus();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Be the first to post
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGroup("All");
                  setSearchQuery("");
                }}
              >
                Show All Posts
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const liked = currentUser
                ? post.likes.includes(currentUser.id)
                : false;
              const isExpanded = expandedPostIds.includes(post.id);

              return (
                <Card key={post.id} className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 border border-yellow-300 flex items-center justify-center font-bold text-amber-900 shrink-0">
                        {(post.author?.name ?? "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm">
                            {post.author?.name ?? "ULAB Member"}
                          </span>
                          <span className="text-[11px] uppercase px-2 py-0.5 rounded-full bg-secondary font-semibold">
                            {post.author?.role ?? "member"}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-100 text-amber-900 font-semibold">
                            {post.group || "General"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Report post"
                      onClick={() =>
                        setReportTarget({
                          targetType: "post",
                          targetId: post.id,
                          preview: post.content,
                        })
                      }
                      className="text-xs text-muted-foreground hover:text-red-600 flex items-center gap-1 p-1.5 rounded-lg hover:bg-red-50 transition"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report</span>
                    </button>
                  </div>

                  <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 pt-2 border-t text-sm">
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-medium transition ${
                        liked
                          ? "text-red-600 font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          liked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span>{post.likes.length}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>
                        {post.comments.length} comment
                        {post.comments.length === 1 ? "" : "s"}
                      </span>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t space-y-3 bg-muted/25 -mx-6 px-6 pb-2">
                      {post.comments.length === 0 ? (
                        <p className="text-xs text-muted-foreground pt-2">
                          No comments yet. Add the first reply below.
                        </p>
                      ) : (
                        <div className="space-y-2 pt-2">
                          {post.comments.map((cmt) => (
                            <div
                              key={cmt.id}
                              className="p-3 rounded-xl bg-card border flex items-start justify-between gap-2 text-sm"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs">
                                    {cmt.author?.name ?? "ULAB Member"}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(
                                      cmt.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/85 mt-1">
                                  {cmt.content}
                                </p>
                              </div>
                              <button
                                type="button"
                                aria-label="Report comment"
                                onClick={() =>
                                  setReportTarget({
                                    targetType: "comment",
                                    targetId: cmt.id,
                                    preview: cmt.content,
                                  })
                                }
                                className="text-muted-foreground hover:text-red-600 p-1"
                              >
                                <Flag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <form
                        onSubmit={(e) => handleAddComment(e, post.id)}
                        className="flex gap-2 pt-1"
                      >
                        <input
                          type="text"
                          required
                          value={commentDrafts[post.id] ?? ""}
                          onChange={(e) =>
                            setCommentDrafts((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Write a helpful reply..."
                          className="flex-1 px-3.5 py-2 border rounded-xl text-sm bg-card focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                        >
                          Reply
                        </Button>
                      </form>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReportTarget(null)}
        >
          <Card
            className="w-full max-w-md p-6 space-y-4 bg-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Report content"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-600" />
                Report {reportTarget.targetType}
              </h3>
              <button
                type="button"
                aria-label="Close report dialog"
                onClick={() => setReportTarget(null)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-muted/60 text-xs text-muted-foreground line-clamp-2">
              &ldquo;{reportTarget.preview}&rdquo;
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Reason
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm bg-background"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Additional details (optional)
                </label>
                <textarea
                  rows={2}
                  value={reportExtra}
                  onChange={(e) => setReportExtra(e.target.value)}
                  placeholder="Context for moderators..."
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReportTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
