import type { Post, Comment } from "../types";

export const SEED_POSTS: Post[] = [
  {
    id: "post-1",
    authorId: "u-student-1",
    content:
      "Taking CSE202 (Data Structures) with Prof. Mahbubul Alam next semester — any tips from seniors on how to balance the lab assignments with math coursework?",
    group: "CSE",
    likes: ["u-student-2", "u-student-3", "u-alumni-1"],
    createdAt: "2026-11-23T14:20:00Z",
    status: "visible",
  },
  {
    id: "post-2",
    authorId: "u-faculty-1",
    content:
      "Reminder for CSE101 & CSE401 students: extra office hours are open this Tuesday 2–4 PM in Room D-402 if you want help reviewing your project architecture.",
    group: "CSE",
    likes: ["u-student-1", "u-student-11"],
    createdAt: "2026-11-23T09:10:00Z",
    status: "visible",
  },
  {
    id: "post-3",
    authorId: "u-student-4",
    content:
      "We are forming a 4-member ULAB BBA team for the Inter-University Brand Case Challenge. Looking for one teammate strong in financial slides and analytics!",
    group: "BBA",
    likes: ["u-student-5", "u-alumni-3"],
    createdAt: "2026-11-22T18:05:00Z",
    status: "visible",
  },
  {
    id: "post-4",
    authorId: "u-alumni-1",
    content:
      "Just posted a Junior Full Stack Developer opening at bKash on the PeerPath Alumni Job Board. Happy to review CVs from ULAB students before you apply.",
    group: "General",
    likes: ["u-student-1", "u-student-2", "u-student-3"],
    createdAt: "2026-11-21T16:40:00Z",
    status: "visible",
  },
  {
    id: "post-5",
    authorId: "u-student-6",
    content:
      "Anyone from MSJ204 interested in co-producing a short 5-minute documentary on Dhaka's weekend book markets this Friday morning?",
    group: "MSJ",
    likes: ["u-student-7", "u-faculty-4"],
    createdAt: "2026-11-20T13:15:00Z",
    status: "visible",
  },
  {
    id: "post-6",
    authorId: "u-student-8",
    content:
      "ENG203 Creative Writing Workshop is honestly one of the best electives at ULAB if you want constructive peer feedback on your short stories.",
    group: "English",
    likes: ["u-student-9", "u-faculty-5"],
    createdAt: "2026-11-19T11:30:00Z",
    status: "visible",
  },
  {
    id: "post-7",
    authorId: "u-student-10",
    content:
      "Our Bangla Literary Circle is hosting a Tagore & Jibanananda reading session next Wednesday afternoon at the Permanent Campus courtyard. All departments welcome!",
    group: "Bangla",
    likes: ["u-student-12", "u-faculty-6"],
    createdAt: "2026-11-18T15:00:00Z",
    status: "visible",
  },
  {
    id: "post-8",
    authorId: "u-teacher-1",
    content:
      "Batch 241 advising schedule is now live. Make sure you stay within the 14-credit semester cap when finalizing your Discover course selection.",
    group: "General",
    likes: ["u-student-1", "u-student-2"],
    createdAt: "2026-11-17T10:00:00Z",
    status: "visible",
  },
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: "cmt-1",
    postId: "post-1",
    authorId: "u-student-3",
    content:
      "Start the weekly tree & graph problems early — Prof. Alam's lab sheets mirror the midterm questions closely!",
    createdAt: "2026-11-23T15:00:00Z",
  },
  {
    id: "cmt-2",
    postId: "post-1",
    authorId: "u-alumni-1",
    content:
      "Dry-run every pointer and queue trace on paper first. Happy to walk through BFS/DFS during the Mock Interview Night too.",
    createdAt: "2026-11-23T16:15:00Z",
  },
  {
    id: "cmt-3",
    postId: "post-3",
    authorId: "u-student-5",
    content: "Count me in! I finished BBA302 last term and can handle the forecasting deck.",
    createdAt: "2026-11-22T19:00:00Z",
  },
  {
    id: "cmt-4",
    postId: "post-5",
    authorId: "u-student-7",
    content: "I can bring a shotgun mic and handle audio recording if you still need crew.",
    createdAt: "2026-11-20T14:10:00Z",
  },
];
