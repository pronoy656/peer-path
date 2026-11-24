PeerPath — Complete Rebuild Prompt (Functionality First)
How to use this prompt: Paste this entire document into your AI coding agent (Cursor, Claude Code, etc.) with the peer-path repo open. Work phase by phase in the order given in Section 9. Do not skip the verification checklist in Section 10. This phase is functionality only — the visual redesign comes later in a separate phase.

1. Product Vision
What PeerPath is: A university peer-learning and community platform for ULAB (University of Liberal Arts Bangladesh) students. One place to discover courses, connect with peers and faculty, learn from alumni mentors, and join the campus community.
The problem it solves: Today a ULAB student finds courses through scattered PDFs, Facebook groups, and word of mouth. They cannot easily see which courses fit their semester, who teaches them, what seniors think of them, or who to ask for help. Faculty have no single place to share materials and office hours. Alumni — the most valuable mentors — are disconnected from current students. PeerPath puts courses, people, mentorship, and community in one product.
Who it is for (personas):
Student — discovers courses, enrolls for the semester, connects with peers, asks seniors, follows mentors.
Faculty — publishes courses, shares materials, holds office hours, reads student reviews.
Class Teacher — manages one batch/class: attendance, announcements, assignments, student progress.
Alumni / Mentor — mentors students, posts jobs, hosts networking events.
Moderator — keeps the community safe: reviews posts, handles reports.
Admin — runs the whole platform: users, courses, content, analytics.
One-line pitch: PeerPath helps ULAB students find the right courses, the right people, and the right mentors — in one place.

2. Current State (verified audit — read this before changing anything)
Live site: https://peer-path-sandy.vercel.app/ · Repo: pronoy656/peer-path · Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/Radix UI, lucide-react, Motion.
What already works — keep and reuse it:
Home page sections (hero, Why Choose, course cards, testimonials carousel, alumni carousel, FAQ, CTA).
Discover page filters (department + semester) and Add-to-selection with a Selected Courses panel.
Courses list with working search and difficulty filter (12 courses in courses.json).
Course detail pages for IDs 1 and 2 (syllabus, reviews, Enroll/Save toggles).
Faculty directory and a fully working faculty profile (/faculty/1) with a Contact modal.
Students directory with working search/filters and a Connect popup.
Alumni mentor cards and job board UI.
What is broken or missing — this prompt fixes all of it:
/admin renders only the literal text "page". No dashboard, no auth gate. /dashboard is a bare 404.
/community renders only the literal text "CommunityPage". No community features exist.
Sign-in does nothing (the submit handler only does console.log). There is no sign-up page. Sign Up and Forgot Password are dead # links. The header fakes a signed-in "JD" user on every page without any login.
Course detail pages work for only 2 of 12 courses; the rest show "Course Not Found".
Every Alumni link 404s (10 mentor profiles, 4 job details, jobs list).
Many dead buttons: View Details (Home, Discover), Save Preferences, Get Recommendations, Confirm Enrollment, Share, View Profile.
The footer on every page is a copy-pasted auto-parts template (JBAY — "keeping drivers on the road… replacement parts"), with typos ("Catagory", "My Bisness", "Tarms & Condition") and every link set to #.
Three different course datasets (Home, Discover, Courses) with different names, instructors, and prices. The site claims both "free ULAB peer learning" and $99–$129 paid courses.
Broken/missing images (blank pale-yellow placeholders) and wrong image reuse (a Bangla literature mural as the Data Science hero).
Dummy/stale content: repeated testimonials, generic SaaS FAQ, 2025 events in the past, US $80K–$160K jobs, "10M+ users" stats.
No backend anywhere. The (student) route group has a layout but zero pages. The navbar file contains ~150 lines of commented-out dead code.

3. Goals and Non-Goals (this phase)
Goals:
Every page renders real content. Every button and link does something visible. Zero dead buttons, zero # links, zero unintended 404s.
Every role has a working dashboard with real features (Section 7).
All data is handled locally in the frontend (Section 4) — no backend, but architected so a real API can replace the local layer later without touching UI components.
The product is demo-ready: anyone can sign in with a one-click demo account per role and understand what PeerPath is and what problem it solves within 2 minutes.
Non-goals (do NOT do these in this phase):
No backend, no database, no API routes that call external services, no real authentication provider.
No visual redesign. Keep the current look and feel. Only fix inconsistencies (e.g. the standalone yellow sign-in theme, the wrong footer) and wrong content. A dedicated design phase comes later.
No new heavy dependencies. Only add a dependency if the feature genuinely needs it, and prefer what is already installed.

4. Tech and Architecture
Keep the stack: Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4, shadcn/Radix UI, lucide-react, Motion. Reuse existing components wherever they already work.
4.1 Local data architecture (the most important part)
Build three layers. Components must NEVER import seed data directly — they only call the service layer.
lib/
├── types.ts              # All TypeScript types (Section 5)
├── data/
│   ├── courses.ts        # ONE course dataset used by Home, Discover, Courses
│   ├── faculty.ts
│   ├── students.ts
│   ├── alumni.ts
│   ├── jobs.ts
│   ├── events.ts
│   ├── posts.ts          # Community seed posts + comments
│   ├── reviews.ts
│   ├── notifications.ts
│   └── users.ts          # Demo users, one per role (Section 4.3)
├── store/
│   └── AppStore.tsx      # React context + useReducer, persisted to localStorage
└── services/
    ├── auth.ts           # signIn, signUp, signOut, getSession
    ├── courses.ts        # getCourses, getCourseById, searchCourses
    ├── enrollment.ts     # enroll, unenroll, getMyEnrollments
    ├── community.ts      # getPosts, createPost, likePost, addComment
    ├── moderation.ts     # report, reviewReports, hidePost, banUser
    └── notifications.ts  # getNotifications, markAsRead
Seed data (lib/data/*) is the single source of truth. Delete the three conflicting course datasets and replace them with one typed dataset used everywhere.
AppStore holds all user-specific state: session, enrollments, saved courses, preferences, community posts, notifications, attendance, announcements. Persist it to localStorage under one key (peerpath-state-v1) so state survives reloads. Provide a "Reset demo data" action in Admin settings that restores the seed state.
Services are the only functions components call. Each service reads seed data + store state and returns plain results. When a real backend arrives later, only lib/services/* changes.
4.2 Routing and dashboards
app/
├── (public)/                 # Public site: /, /discover, /courses, /courses/[id],
│                             # /faculty, /faculty/[id], /students, /students/[id],
│                             # /alumni, /alumni/[id], /jobs, /jobs/[id],
│                             # /events, /community, /contact
├── (auth)/                   # /signIn, /signUp, /forgot-password
├── (dashboard)/              # Shared dashboard shell (sidebar + header + role menu)
│   ├── student/              # /dashboard/student/*
│   ├── faculty/              # /dashboard/faculty/*
│   ├── teacher/              # /dashboard/teacher/*  (class teacher)
│   ├── moderator/            # /dashboard/moderator/*
│   ├── alumni/               # /dashboard/alumni/*
│   └── admin/                # /dashboard/admin/*
└── not-found.tsx             # Branded 404 page
Build ONE shared dashboard shell (components/dashboard/DashboardShell.tsx) with a sidebar, header, and role-based menu. Every role dashboard uses it.
Add a client-side role guard: visiting any /dashboard/* route without a session redirects to /signIn; visiting with the wrong role redirects to that user's own dashboard. The old /admin stub page must be removed and replaced by /dashboard/admin.
Delete the fake hard-coded "JD" user. The header shows the real session state: logged out → Sign In / Sign Up buttons; logged in → user avatar menu (My Dashboard, Profile, Logout — all working).
4.3 Demo accounts (one-click login)
The sign-in page must show one-click demo login buttons for every role so anyone can explore the product instantly. Use one simple password for all demo accounts (e.g. demo1234).
Role
Name
Email
Student
Arif Rahman
student@peerpath.demo
Faculty
Dr. Sarah Johnson
faculty@peerpath.demo
Class Teacher
Ms. Nadia Karim
teacher@peerpath.demo
Moderator
Tanvir Hasan
moderator@peerpath.demo
Alumni / Mentor
Rahim Uddin
alumni@peerpath.demo
Admin
PeerPath Admin
admin@peerpath.demo
Sign-up creates a real local user (role: Student by default) stored in the AppStore and logs them in.
Forgot password shows a realistic flow (enter email → "reset link sent" confirmation state). No real email is sent.
4.4 Product decisions (follow these — they resolve current contradictions)
Courses are ULAB courses and enrollment is free. Remove ALL dollar prices ($99, $129, etc.). "Enroll" means semester course registration, not purchase. Replace price fields with credits, department, semester, and seats.
One course dataset everywhere. Home, Discover, and Courses all read from lib/data/courses.ts.
Realistic ULAB content. Bangladeshi names, ULAB departments (CSE, BBA, MSJ, English, Bangla), Dhaka context, BDT where money appears (job salaries in BDT/month). No US salaries, no "10M+ users" claims. Stats must match the seed data (e.g. "12+ courses", "5 departments").
Images must load and match. Fix every broken image path. Reuse only the images already in public/, matched to the correct course/person. If a person has no photo, use a clean initial-letter avatar (do not leave blank boxes).

5. Data Models
Define these types in lib/types.ts. Every feature below uses them — do not invent parallel shapes.
type Role = "student" | "faculty" | "teacher" | "moderator" | "alumni" | "admin";

interface User {
  id: string; name: string; email: string; role: Role;
  avatar?: string; department?: string; batch?: string;
  bio?: string; createdAt: string;
}

interface Course {
  id: string; code: string;              // e.g. "CSE101"
  title: string; description: string;
  department: "CSE" | "BBA" | "MSJ" | "English" | "Bangla";
  semester: number;                      // 1–12
  credits: number; difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructorId: string;                  // -> Faculty User id
  image: string; rating: number; reviewCount: number;
  seatsTotal: number; seatsTaken: number;
  syllabus: { week: number; topic: string }[];
}

interface FacultyProfile extends User {
  title: string;                         // "Associate Professor"
  researchArea: string[]; officeHours: string;
  experienceYears: number; methodology: string;
}

interface Job {
  id: string; title: string; company: string; location: string;
  salaryMin: number; salaryMax: number;  // BDT/month
  type: "Full-time" | "Part-time" | "Internship";
  description: string; postedById: string; postedAt: string;
  applicants: string[];                  // user ids
}

interface PeerEvent {
  id: string; title: string; description: string;
  date: string;                          // future date only
  location: string; organizerId: string; attendees: string[];
}

interface Post {
  id: string; authorId: string; content: string;
  group?: string;                        // e.g. "CSE 3rd Semester"
  likes: string[]; createdAt: string; status: "visible" | "hidden";
}

interface Comment { id: string; postId: string; authorId: string; content: string; createdAt: string; }

interface Review {
  id: string; targetType: "course" | "faculty";
  targetId: string; authorId: string;
  rating: number; content: string; createdAt: string; status: "visible" | "hidden";
}

interface Enrollment { userId: string; courseId: string; enrolledAt: string; progress: number; }

interface Announcement { id: string; teacherId: string; batch: string; title: string; content: string; createdAt: string; }

interface AttendanceRecord { id: string; teacherId: string; batch: string; courseId: string; date: string; presentIds: string[]; }

interface Assignment { id: string; teacherId: string; courseId: string; title: string; description: string; dueDate: string; submissions: { studentId: string; submittedAt: string }[]; }

interface Report { id: string; reporterId: string; targetType: "post" | "comment" | "review" | "user"; targetId: string; reason: string; status: "open" | "resolved" | "dismissed"; createdAt: string; }

interface AppNotification { id: string; userId: string; title: string; body: string; read: boolean; createdAt: string; link?: string; }
Seed data volumes (minimum): 12 courses (all departments, semesters 1–4+), 5 faculty, 12 students, 10 alumni, 4 jobs, 3 upcoming events, 8 community posts with comments, 10 reviews, 6 demo users.

6. Public Website — Full Feature List
Every interactive element listed here MUST work. If a button exists, it must do something visible (navigate, open a modal, update state, show a toast). No dead buttons, no # links anywhere.
6.1 Global (every page)
Navbar: working links to Home, Discover, Courses, Faculty, Students, Alumni, Community. Mobile menu works. Active route is highlighted. Right side shows session state (Section 4.2).
Footer (rewrite completely): PeerPath brand + short description of what PeerPath is; link columns that all work — Explore (Discover, Courses, Faculty, Community), Community (Students, Alumni, Events, Jobs), Support (Contact, FAQ, Privacy Policy, Terms) — each linking to a real page or section. Correct spelling throughout. No JBAY text, no auto-parts content, no # links.
Toasts: every successful action (enroll, save, post, connect, apply, RSVP, login, logout) shows a toast confirmation. Use sonner if already installed, otherwise a small custom toast.
Empty states: every list (search results, saved courses, notifications, etc.) has a friendly empty state with an explanation and a next action — never a blank area.
Loading states: simulated short loading skeletons where data "loads" (e.g. course detail), so the app feels real.
404 page: a branded not-found.tsx ("Page not found" + PeerPath branding + buttons back to Home and Discover). No bare Next.js 404 anywhere.
6.2 Home (/)
Hero with realistic stats derived from seed data (course count, departments, faculty count — computed, not hard-coded fake numbers).
"Why Choose PeerPath" features (keep existing 6, rewrite copy to match the real product).
Course preview: 8 cards from the ONE dataset. View Details opens the real course detail page.
Testimonials: 4 realistic ULAB student/faculty quotes (different text each, Bangladeshi names, real roles). No repeated dummy text.
Alumni preview carousel linking to real alumni profiles.
FAQ rewritten for ULAB students (how enrollment works, how to connect with faculty, how mentorship works, is it free). No SaaS/payment copy.
Contact form: name, email, message → on submit, validate, show a success toast, and store the message locally (visible in Admin dashboard under Support).
6.3 Discover (/discover)
Department filter (CSE, BBA, MSJ, English, Bangla) + Semester filter (1–12) — both working, filtering the ONE dataset.
Course cards with Add/Remove. Selected Courses panel shows chosen courses, total credits, and a credit limit indicator (max 14).
Save Preferences persists the selected department/semester to the store and shows a toast; preferences are restored on revisit.
Get Recommendations shows real recommendations computed from the user's department + semester + saved courses (rule-based: same department, next-semester courses, highly rated). Show them in a results section — never a dead button.
Confirm Enrollment enrolls the user in all selected courses (requires login — if logged out, redirect to Sign In and return after), shows a confirmation toast + summary, and the courses appear in the Student Dashboard under My Courses.
View Details opens the course detail page.
Fix the typo ("We all recommend courses…" → correct copy) and the blank hero image.
6.4 Courses (/courses) and Course Detail (/courses/[id])
List: all courses from the ONE dataset, with working search (title/code/instructor) and filters (department, difficulty, semester). Show "Showing X of Y courses". Card images load and match the course.
Detail page works for ALL courses (fix "Course Not Found" — every course in the dataset must have a detail record with syllabus, instructor, and reviews). Sections: hero (correct image), overview, syllabus week-by-week, instructor card linking to the faculty profile, reviews list + average rating.
Enroll Now toggles to Enrolled (persisted; requires login), updates seats taken, shows a toast.
Save Course toggles to Saved (persisted, appears in Student Dashboard).
Share copies the course URL to the clipboard and shows a "Link copied" toast.
View Profile opens the instructor's faculty profile.
Write a Review (logged-in users): rating + text → review appears in the list immediately (stored locally, visible to Moderator for review).
Review counts must match the reviews actually shown.
6.5 Faculty (/faculty) and Faculty Profile (/faculty/[id])
Directory: all faculty with photos (or initial avatars), department, title, rating, office hours. Working search + department filter.
Profile: photo, bio, research areas, experience, teaching methodology, current + previous courses (linking to real course pages), reviews, Write a Review form (works, stored locally).
Contact Me opens the modal (To, Subject, Message) → Send shows a success toast and stores the message locally (visible in the faculty member's dashboard inbox).
Fix the layout bug: the "Back to Faculty" link must not hide behind the sticky header.
Faculty emails use @ulab.edu.bd.
6.6 Students (/students) and Student Profile (/students/[id]) — NEW page
Directory: all students with avatar/initials, student ID, department, batch, interests. Working search + department/batch filters.
Connect opens a popup with actions that work: Send Connect Request (stored locally, appears in both students' dashboards), plus Message (opens a simple local message thread — see 6.9).
NEW student profile page: bio, department, batch, enrolled courses (public ones), interests, Connect button.
6.7 Alumni (/alumni), Alumni Profile (/alumni/[id]), Jobs (/jobs, /jobs/[id]), Events (/events)
Alumni directory: mentor cards with expertise, batch, current role. View Profile opens a real profile page (bio, journey, expertise, "Request Mentorship" button that works — stored locally, appears in the mentor's dashboard).
Job board: jobs with BDT salaries and Dhaka/Bangladesh locations. Apply Now opens the job detail page; Apply on the detail page submits an application (stored locally, visible in the poster's Alumni dashboard) with a success toast. View All Jobs opens /jobs (working list with search + type filter).
Events: upcoming events only (all dates in the future relative to today), each with details and a working RSVP button (stored locally, appears in Student Dashboard).
Remove all 404s: every link on this page must resolve.
6.8 Community (/community) — build from zero (currently an empty stub)
Post feed: seed posts from students/faculty/alumni, newest first, with author, time, group tag, likes, and comment counts.
Create Post (logged-in users): text composer with optional group tag → post appears at the top of the feed immediately.
Like toggles (persisted). Comment expands a thread; adding a comment works and persists.
Report on any post/comment opens a reason picker → creates a Report visible in the Moderator dashboard.
Group filter (All, CSE, BBA, MSJ, English, Bangla, General) and search across posts.
Empty state when a filter has no posts, with a "Be the first to post" CTA.
6.9 Messaging (lightweight, local)
From a student/faculty profile or the Connect popup, Message opens a simple conversation thread (local messages stored per conversation). Conversations are listed in the Student/Faculty dashboard under Messages. Keep it simple: text messages only, no real-time backend.
6.10 Auth pages (/signIn, /signUp, /forgot-password)
Sign-in: email + password with validation, working login against demo accounts + locally registered users, "Remember me" (persists session), one-click demo login buttons for all 6 roles (Section 4.3), error toast on wrong credentials. After login, redirect to that role's dashboard.
Sign-up (NEW page): name, email, password, department, batch → creates a Student account locally and logs in.
Forgot password: email → confirmation state ("If an account exists, a reset link was sent").
Unify the theme with the rest of the site (remove the standalone yellow theme).
Logout works everywhere and clears the session.

7. Dashboards — Full Feature List per Role
All dashboards live under /dashboard/*, use the shared DashboardShell (sidebar + header + role menu), and are protected by the role guard (Section 4.2). Every dashboard has an Overview page plus the sections below. Every action must work against the local store and show feedback (toast / updated UI).
7.1 Student Dashboard (/dashboard/student)
Overview: enrolled course count, total credits this semester, upcoming events (RSVP'd), unread notifications, recommended courses (rule-based), recent community activity.
My Courses: enrolled courses with progress bars (progress advances when the student clicks "Mark lesson complete" — simulated per-course progress stored locally), Continue buttons linking to course pages, Unenroll action.
Discover & Recommendations: personalized recommendations (same logic as Discover page) with Enroll/Save actions.
Saved Courses: saved list with Enroll/Remove actions.
My Connections: connected peers, pending sent/received connect requests (Accept/Decline works).
Messages: conversation threads (Section 6.9).
Notifications: list with mark-as-read and mark-all-read.
Profile & Settings: edit name/bio/department/batch/interests (persisted), avatar choice (initials color), "Reset demo data" link.
7.2 Faculty Dashboard (/dashboard/faculty)
Overview: my courses count, total students across my courses, average rating, pending reviews, recent messages.
My Courses: courses I teach, each with student roster (names, IDs, batch), seats filled, and a link to the public course page.
Students: searchable list of all students in my courses.
Reviews: all reviews of me and my courses; I can read and reply (replies stored locally and shown publicly).
Messages: inbox from students (contact-form messages + direct messages), with reply.
Materials: upload-style list per course (title + link/note — stored locally, no real file upload; show as a resource list on the course page).
Office Hours & Profile: edit office hours, bio, research areas (reflected on my public profile).
7.3 Class Teacher Dashboard (/dashboard/teacher)
Overview: my batch(es), student count, today's attendance snapshot, pending assignments, recent announcements.
My Classes: batch list; each batch shows its student roster with search.
Attendance: pick batch + course + date → mark students present/absent (checkbox list) → Save stores an AttendanceRecord; view past attendance by date with present/absent counts.
Announcements: create announcement (title + body + batch) → appears in students' notifications and on a class announcements list; edit/delete own announcements.
Assignments: create assignment (title, description, course, due date) → students see it; track submissions per assignment (seeded mock submissions + status).
Student Progress: per-student table (enrolled courses, attendance %, assignment submissions) with search.
Messages: message students in my batch.
7.4 Moderator Dashboard (/dashboard/moderator)
Overview: open reports count, posts today, hidden items, recent moderation activity.
Reports Queue: all open reports with reporter, target preview, reason, and actions — Resolve (takes the chosen action), Dismiss (closes the report). Acting updates the report status and the target.
Community Posts: all posts with search/filter; Hide/Unhide any post; Delete any post or comment (with confirm dialog).
Reviews: all course/faculty reviews; Hide/Unhide any review.
Users: user list with search; Warn (sends a notification to the user) and Suspend/Unsuspend (suspended users cannot post or comment — enforced in the community service).
Activity Log: a local log of every moderation action taken (who did what, when).
7.5 Alumni / Mentor Dashboard (/dashboard/alumni)
Overview: mentorship requests (pending count), my mentees, my job postings, my events, profile views (mock number).
Mentorship Requests: incoming requests with student info; Accept/Decline works; accepted students appear under My Mentees with a Message action.
My Mentees: list with progress notes (a private note field per mentee, stored locally).
My Jobs: my posted jobs with applicant counts; Post a Job form (title, company, location, BDT salary range, type, description) → job appears on the public job board; edit/close own jobs; View Applicants per job (names + applied date).
My Events: create event (title, description, date, location) → appears on the public events list; manage RSVPs (attendee list); edit/cancel own events.
Mentor Profile: edit bio, expertise, current role (reflected on my public alumni profile).
7.6 Admin Dashboard (/dashboard/admin)
Overview: platform stats with charts (users by role, total courses, enrollments, posts, open reports) — computed from the store, using simple charts (Recharts is already a dependency pattern in this author's other projects; if not installed here, use lightweight CSS/SVG bars — do not add heavy deps without need).
Users: all users with search + role filter; Change Role, Suspend/Unsuspend, Delete (with confirm); Create User form (name, email, role, department).
Courses: all courses; Approve/Reject course submissions (seed 2 pending course proposals to demonstrate the flow), Edit any course, Add Course form.
Faculty: faculty list; Add Faculty form; edit faculty details.
Content: community posts + reviews moderation (same Hide/Delete powers as Moderator).
Jobs & Events: all jobs and events; approve/remove any.
Reports: all moderation reports with status; same Resolve/Dismiss actions as Moderator.
Support: contact-form messages from the Home page (list + mark as handled).
Announcements: platform-wide announcement composer (appears as a banner on Home + a notification to all users).
Settings: site name/tagline, "Reset demo data" (restores all seed data and clears local state), demo-account list for reference.

8. Cross-Cutting Requirements
Zero dead interactions. After this rebuild, there must be no button that does nothing, no link to #, and no route that renders a bare 404 or an empty stub. If a feature cannot work locally, do not render a fake button for it — either implement it locally or remove it.
One dataset. All pages read courses/faculty/students/alumni from lib/data/*. No page keeps its own conflicting copy.
Realistic content only. No lorem ipsum, no repeated dummy quotes, no fake stats, no past events, no foreign salaries. Every number shown must be computed from the data.
Feedback everywhere. Toasts on success/error, confirm dialogs on destructive actions (delete, unenroll, ban), inline validation messages on forms.
Responsive. The site and all dashboards must be usable on mobile: working mobile nav, dashboards that collapse the sidebar, tables that scroll or stack. Verify at 375px width.
Accessibility basics. Form labels, focus-visible styles, aria labels on icon-only buttons, modals that close on Escape and trap focus reasonably.
Code quality. Delete dead code (including the ~150 lines of commented-out navbar). No console.log in submit handlers. TypeScript strict must pass and npm run build must succeed with no errors.
Images. Fix every broken image. Every image must match its subject. Use only images already in public/ (plus initial-letter avatars where no photo exists).

9. Execution Plan (do it in this order)
Phase 0 — Foundation: Create lib/types.ts, lib/data/* (single unified dataset), lib/store/AppStore.tsx (context + localStorage), lib/services/*, and the 6 demo users. Migrate Home/Discover/Courses to the one dataset. Verify the app still builds.
Phase 1 — Fix the public site: Rewrite the footer; fix all course detail pages; fix all Alumni/Job links (build the missing detail pages); fix all dead buttons on Home/Discover/Courses; fix images; replace dummy content with realistic ULAB content; add the branded 404 page.
Phase 2 — Auth: Build sign-in (with demo one-click logins), sign-up, forgot password; implement the session in the store; fix the header to show real session state; remove the fake "JD" user; add the role guard.
Phase 3 — Student + Faculty dashboards: Build the dashboard shell, then the Student and Faculty dashboards with all sections in 7.1–7.2.
Phase 4 — Class Teacher + Moderator + Alumni dashboards: Build all sections in 7.3–7.5.
Phase 5 — Admin dashboard: Build all sections in 7.6, including charts, user/course management, and demo-data reset.
Phase 6 — Community + Messaging: Build the community feed (6.8) and lightweight messaging (6.9), wired to Moderator actions.
Phase 7 — Polish + verify: Toasts/empty/loading states everywhere; responsive check at 375px; delete dead code; run the full Definition of Done checklist (Section 10) and fix every failing item.
After each phase, run npm run build and fix errors before moving on. Commit after each phase with a clear message (e.g. phase 1: fix public site, footer, course details).

10. Definition of Done (verify every item before calling it complete)
npm run build passes with no TypeScript errors and no console errors on any page.
Every route in Section 4.2 renders real content (no stubs, no "page"/"CommunityPage" text).
Every button and link on every page does something visible. No # links remain (search the codebase for href="#" — must return zero results).
All 6 demo accounts log in with one click and land on the correct dashboard.
Wrong-role access to a dashboard redirects correctly; logged-out access redirects to Sign In.
Full student journey works end to end: sign up → discover → save preferences → get recommendations → confirm enrollment → see courses in Student Dashboard → post in Community → like/comment → receive a notification.
Full teacher journey works: sign in as Class Teacher → mark attendance → create announcement → create assignment → student sees the announcement as a notification.
Full moderation journey works: report a post as a student → see it in the Moderator queue → hide the post → post disappears from the feed.
Full alumni journey works: sign in as Alumni → accept a mentorship request → post a job → job appears on the public board → a student applies → applicant appears in the Alumni dashboard.
Full admin journey works: sign in as Admin → change a user's role → approve a pending course → post a platform announcement → announcement appears on Home.
State persists across reloads (localStorage) and "Reset demo data" restores the seed state.
The site is usable at 375px width (mobile nav, dashboards, tables).
The footer has correct PeerPath/ULAB content and zero dead links.
No page shows a dollar price, a US salary, a past event, or a fake stat.

11. Demo Script (use this to present the project)
A 2-minute walkthrough proving what PeerPath is and what problem it solves:
Home — "ULAB students can't find the right courses or the right people. PeerPath fixes that." (1 sentence, then move on.)
Discover — pick CSE + Semester 2, add 3 courses, see credits update, click Get Recommendations.
One-click demo login as Student — Confirm Enrollment, then open the Student Dashboard: enrolled courses, recommendations, notifications.
Community — create a post asking seniors about a course; like and comment.
Switch to Moderator — the post's report appears in the queue; resolve it.
Switch to Class Teacher — mark attendance for a batch in 10 seconds.
Switch to Admin — platform overview, approve a pending course, post an announcement.
Close: "Six roles, one platform — courses, people, mentorship, and community. Today it runs fully on local data; the service layer is ready for a real backend whenever we plug one in."

End of prompt. Design overhaul (visual redesign, design system, motion) is a separate phase and is intentionally out of scope here.