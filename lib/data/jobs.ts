import type { Job } from "../types";

export const SEED_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Junior Full Stack Developer",
    company: "bKash Limited",
    location: "Dhaka (Hybrid)",
    salaryMin: 45000,
    salaryMax: 65000,
    type: "Full-time",
    description:
      "Join our merchant portal engineering team working with React, TypeScript, and Node.js microservices. Ideal for final-year ULAB CSE students or recent graduates with strong project portfolios.",
    postedById: "u-alumni-1",
    postedAt: "2026-11-20T09:00:00Z",
    status: "open",
    applicants: [{ userId: "u-student-3", appliedAt: "2026-11-21T14:00:00Z" }],
  },
  {
    id: "job-2",
    title: "UI/UX Design Intern",
    company: "Pathao",
    location: "Banani, Dhaka",
    salaryMin: 15000,
    salaryMax: 22000,
    type: "Internship",
    description:
      "6-month paid product design internship collaborating with senior designers on user research, Figma components, and mobile usability testing.",
    postedById: "u-alumni-2",
    postedAt: "2026-11-18T10:30:00Z",
    status: "open",
    applicants: [{ userId: "u-student-2", appliedAt: "2026-11-19T11:20:00Z" }],
  },
  {
    id: "job-3",
    title: "Growth & Brand Associate",
    company: "Chaldal",
    location: "Dhaka",
    salaryMin: 35000,
    salaryMax: 50000,
    type: "Full-time",
    description:
      "Own campus and digital acquisition experiments, campaign tracking, and partner activations. Open to ULAB BBA and MSJ graduates.",
    postedById: "u-alumni-3",
    postedAt: "2026-11-15T12:00:00Z",
    status: "open",
    applicants: [],
  },
  {
    id: "job-4",
    title: "Content & Scriptwriting Fellow",
    company: "10 Minute School",
    location: "Mohakhali DOHS, Dhaka (Part-time)",
    salaryMin: 18000,
    salaryMax: 25000,
    type: "Part-time",
    description:
      "Flexible part-time role for current MSJ, English, or Bangla students to research and script engaging video lessons.",
    postedById: "u-alumni-10",
    postedAt: "2026-11-12T08:45:00Z",
    status: "open",
    applicants: [],
  },
];
