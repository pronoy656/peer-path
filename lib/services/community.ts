import type { AppAction, AppState } from "../store/AppStore";
import type { Comment, Post, User } from "../types";

export interface EnrichedPost extends Post {
  author: User | undefined;
  comments: Array<Comment & { author: User | undefined }>;
}

export function getPosts(
  state: AppState,
  options?: { group?: string; query?: string; includeHidden?: boolean }
): EnrichedPost[] {
  const q = (options?.query ?? "").trim().toLowerCase();
  const group = options?.group;

  return state.posts
    .filter((p) => (options?.includeHidden ? true : p.status === "visible"))
    .filter((p) => !group || group === "All" || p.group === group)
    .map((p) => {
      const author = state.users.find((u) => u.id === p.authorId);
      const comments = state.comments
        .filter((c) => c.postId === p.id)
        .map((c) => ({
          ...c,
          author: state.users.find((u) => u.id === c.authorId),
        }));
      return { ...p, author, comments };
    })
    .filter((p) => {
      if (!q) return true;
      return (
        p.content.toLowerCase().includes(q) ||
        (p.group?.toLowerCase().includes(q) ?? false) ||
        (p.author?.name.toLowerCase().includes(q) ?? false)
      );
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPost(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: { authorId: string; content: string; group?: string }
): { ok: true; post: Post } | { ok: false; error: string } {
  const author = state.users.find((u) => u.id === payload.authorId);
  if (!author) return { ok: false, error: "Please sign in to post." };
  if (author.suspended) {
    return {
      ok: false,
      error: "Your account is currently suspended from posting or commenting.",
    };
  }
  if (!payload.content.trim()) {
    return { ok: false, error: "Post content cannot be empty." };
  }

  const post: Post = {
    id: `post-${Date.now()}`,
    authorId: payload.authorId,
    content: payload.content.trim(),
    group: payload.group || "General",
    likes: [],
    createdAt: new Date().toISOString(),
    status: "visible",
  };
  dispatch({ type: "CREATE_POST", post });
  return { ok: true, post };
}

export function likePost(
  dispatch: React.Dispatch<AppAction>,
  postId: string,
  userId: string
) {
  dispatch({ type: "TOGGLE_LIKE_POST", postId, userId });
}

export function addComment(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  payload: { postId: string; authorId: string; content: string }
): { ok: true; comment: Comment } | { ok: false; error: string } {
  const author = state.users.find((u) => u.id === payload.authorId);
  if (!author) return { ok: false, error: "Please sign in to comment." };
  if (author.suspended) {
    return {
      ok: false,
      error: "Your account is currently suspended from posting or commenting.",
    };
  }
  if (!payload.content.trim()) {
    return { ok: false, error: "Comment cannot be empty." };
  }

  const comment: Comment = {
    id: `cmt-${Date.now()}`,
    postId: payload.postId,
    authorId: payload.authorId,
    content: payload.content.trim(),
    createdAt: new Date().toISOString(),
  };
  dispatch({ type: "ADD_COMMENT", comment });

  const post = state.posts.find((p) => p.id === payload.postId);
  if (post && post.authorId !== payload.authorId) {
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        id: `notif-${Date.now()}`,
        userId: post.authorId,
        title: "New Comment on Your Post",
        body: `${author.name} commented: "${comment.content.slice(0, 60)}"`,
        read: false,
        createdAt: new Date().toISOString(),
        link: "/community",
      },
    });
  }

  return { ok: true, comment };
}

export function toggleHidePost(
  dispatch: React.Dispatch<AppAction>,
  postId: string
) {
  dispatch({ type: "TOGGLE_POST_VISIBILITY", postId });
}

export function deletePost(
  dispatch: React.Dispatch<AppAction>,
  postId: string
) {
  dispatch({ type: "DELETE_POST", postId });
}

export function deleteComment(
  dispatch: React.Dispatch<AppAction>,
  commentId: string
) {
  dispatch({ type: "DELETE_COMMENT", commentId });
}
