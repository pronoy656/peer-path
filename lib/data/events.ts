import type { PeerEvent } from "../types";

export const SEED_EVENTS: PeerEvent[] = [
  {
    id: "evt-1",
    title: "ULAB CSE & Alumni Mock Technical Interview Night",
    description:
      "Practice live coding and system design rounds with ULAB alumni engineers from bKash, Cefalo, and Brain Station 23. Bring your CV for 1-on-1 feedback.",
    date: "2026-12-12T15:00:00Z",
    location: "ULAB Permanent Campus, Room D-402",
    organizerId: "u-alumni-1",
    attendees: ["u-student-1", "u-student-2", "u-student-3"],
  },
  {
    id: "evt-2",
    title: "Product Design & Portfolio Critique Workshop",
    description:
      "Learn how to structure UX case studies for Dhaka tech internships and get live portfolio feedback from Pathao design alumni.",
    date: "2026-12-20T14:30:00Z",
    location: "ULAB Auditorium, Mohammadpur",
    organizerId: "u-alumni-2",
    attendees: ["u-student-2", "u-student-4"],
  },
  {
    id: "evt-3",
    title: "Spring Semester Course Advising & Senior Q&A",
    description:
      "Unsure which electives fit your workload? Meet senior peers and faculty advisors across CSE, BBA, MSJ, English, and Bangla before registration.",
    date: "2027-01-08T11:00:00Z",
    location: "ULAB Permanent Campus, Central Atrium",
    organizerId: "u-alumni-3",
    attendees: ["u-student-1", "u-student-6"],
  },
];
