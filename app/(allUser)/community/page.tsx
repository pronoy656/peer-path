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
  Share2,
  ShieldCheck,
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
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";

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
  const [composerOpen, setComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postGroup, setPostGroup] = useState("General");

  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [showAllCommentsIds, setShowAllCommentsIds] = useState<string[]>([]);
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
    setComposerOpen(false);
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

  const handleSharePost = async (postId: string) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/community#${postId}`
        : "";
    try {
      await navigator.clipboard.writeText(url);
      showToast("Post link copied!");
    } catch {
      showToast("Ready to share community post.", "info");
    }
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

  const groupCounts = GROUPS.reduce<Record<string, number>>((acc, g) => {
    acc[g] =
      g === "All"
        ? state.posts.filter((p) => p.status === "visible").length
        : state.posts.filter((p) => p.status === "visible" && p.group === g)
            .length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Campus community
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            Ask seniors &amp; share with ULAB
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Course advice, lab partner requests, case-competition teams, and
            department updates.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Feed Column (max 640px centered within column) */}
        <div className="lg:col-span-8 space-y-5 max-w-[640px] w-full">
          {/* Expandable Composer */}
          <Card className="p-5 gap-4">
            {currentUser ? (
              currentUser.suspended ? (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-danger font-medium">
                  Your account is currently suspended from posting or
                  commenting. Contact a moderator or admin for review.
                </div>
              ) : !composerOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    setComposerOpen(true);
                    setTimeout(() => composerRef.current?.focus(), 50);
                  }}
                  className="flex items-center gap-3 w-full text-left"
                >
                  <Avatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    size="md"
                    department={currentUser.department}
                    avatarColor={currentUser.avatarColor}
                  />
                  <span className="flex-1 h-10 px-4 rounded-lg border border-border bg-background flex items-center text-sm text-muted-foreground hover:border-foreground/30 transition-colors">
                    Share something with your campus…
                  </span>
                </button>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        src={currentUser.avatar}
                        name={currentUser.name}
                        size="sm"
                        department={currentUser.department}
                        avatarColor={currentUser.avatarColor}
                      />
                      <span className="text-sm font-semibold">
                        {currentUser.name}
                      </span>
                    </div>
                    <select
                      aria-label="Select post group"
                      value={postGroup}
                      onChange={(e) => setPostGroup(e.target.value)}
                      className="h-9 px-3 border border-border rounded-lg text-xs font-semibold bg-card"
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
                    className="w-full p-3.5 border border-border rounded-lg text-sm resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setComposerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="accent" size="sm">
                      <Send className="w-3.5 h-3.5" />
                      Post
                    </Button>
                  </div>
                </form>
              )
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-semibold text-base">
                    Join the campus conversation
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sign in to post, like, comment, or report.
                  </p>
                </div>
                <Link href="/signIn">
                  <Button variant="accent" size="sm">
                    Sign in to post
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Search Bar + Mobile Group Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search posts by topic, course code, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-border rounded-lg bg-card text-sm"
              />
            </div>

            <div className="flex lg:hidden flex-wrap gap-2">
              {GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGroup(g)}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-colors ${
                    selectedGroup === g
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border"
                  }`}
                >
                  {g} ({groupCounts[g] ?? 0})
                </button>
              ))}
            </div>
          </div>

          {/* Feed */}
          {posts.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="w-6 h-6" />}
              title="No posts in this feed yet"
              description={`Start a conversation in ${
                selectedGroup === "All" ? "the community" : selectedGroup
              } or show all posts.`}
              actionLabel="Be the first to post"
              onAction={() => {
                if (selectedGroup !== "All") setPostGroup(selectedGroup);
                setComposerOpen(true);
                setTimeout(() => composerRef.current?.focus(), 60);
              }}
            />
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const liked = currentUser
                  ? post.likes.includes(currentUser.id)
                  : false;
                const isExpanded = expandedPostIds.includes(post.id);
                const showAllComments = showAllCommentsIds.includes(post.id);
                const visibleComments = showAllComments
                  ? post.comments
                  : post.comments.slice(0, 3);

                return (
                  <Card key={post.id} id={post.id} className="p-5 sm:p-6 gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={post.author?.avatar}
                          name={post.author?.name ?? "ULAB Member"}
                          size="md"
                          department={post.author?.department}
                          avatarColor={post.author?.avatarColor}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {post.author?.name ?? "ULAB Member"}
                            </span>
                            <Badge
                              department={
                                post.group &&
                                ["CSE", "BBA", "MSJ", "English", "Bangla"].includes(
                                  post.group
                                )
                                  ? post.group
                                  : undefined
                              }
                              variant="neutral"
                            >
                              {post.group || "General"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()} ·{" "}
                            <span className="capitalize">
                              {post.author?.role ?? "member"}
                            </span>
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
                        className="text-xs text-muted-foreground hover:text-danger flex items-center gap-1 p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Report</span>
                      </button>
                    </div>

                    <p className="text-sm sm:text-[15px] text-foreground leading-relaxed whitespace-pre-line max-w-[70ch]">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-5 pt-3 border-t border-border text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          liked
                            ? "text-danger"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            liked ? "fill-danger text-danger" : ""
                          }`}
                        />
                        <span>{post.likes.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSharePost(post.id)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-border space-y-3">
                        <div className="border-l-2 border-border pl-4 space-y-2.5">
                          {post.comments.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              No comments yet. Add the first reply below.
                            </p>
                          ) : (
                            visibleComments.map((cmt) => (
                              <div
                                key={cmt.id}
                                className="p-3 rounded-xl bg-background border border-border flex items-start justify-between gap-2"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-semibold text-foreground">
                                      {cmt.author?.name ?? "ULAB Member"}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {new Date(
                                        cmt.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground/85">
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
                                  className="text-muted-foreground hover:text-danger p-1"
                                >
                                  <Flag className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}

                          {post.comments.length > 3 && !showAllComments && (
                            <button
                              type="button"
                              onClick={() =>
                                setShowAllCommentsIds((prev) => [
                                  ...prev,
                                  post.id,
                                ])
                              }
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                              View all {post.comments.length} comments
                            </button>
                          )}
                        </div>

                        <form
                          onSubmit={(e) => handleAddComment(e, post.id)}
                          className="flex gap-2"
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
                            className="flex-1 h-9 px-3 border border-border rounded-lg text-sm bg-card"
                          />
                          <Button type="submit" size="sm" variant="default">
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

        {/* Right Rail (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 space-y-5 sticky top-24">
          <Card className="p-5 gap-3">
            <h2 className="font-display font-bold text-base">
              Department groups
            </h2>
            <div className="space-y-1">
              {GROUPS.map((g) => {
                const active = selectedGroup === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGroup(g)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{g === "All" ? "All Campus" : g}</span>
                    <span
                      className={`text-xs ${
                        active
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {groupCounts[g] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 gap-3">
            <h2 className="font-display font-bold text-base">
              Trending topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "CSE202 advising",
                "14-credit cap",
                "bKash internship",
                "ENG203 workshop",
                "Batch 241",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag.split(" ")[0])}
                  className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground hover:bg-border transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-base">
                Community guidelines
              </h2>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li>Keep course reviews and peer advice honest and respectful.</li>
              <li>Do not share exam answers or violate ULAB academic policy.</li>
              <li>Use Report on any spam or misleading post for quick review.</li>
            </ul>
          </Card>
        </aside>
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setReportTarget(null)}
        >
          <Card
            className="w-full max-w-md p-6 gap-4 shadow-[var(--shadow-modal)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Report content"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display flex items-center gap-2">
                <Flag className="w-4 h-4 text-danger" />
                Report {reportTarget.targetType}
              </h3>
              <button
                type="button"
                aria-label="Close report dialog"
                onClick={() => setReportTarget(null)}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-muted text-xs text-muted-foreground line-clamp-2">
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
                  className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-card"
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
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none"
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
                <Button type="submit" variant="destructive">
                  Submit report
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
