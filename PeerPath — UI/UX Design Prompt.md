PeerPath — UI/UX Design Prompt (Professional Design System)
How to use this prompt: Paste this entire document into your AI coding agent (Cursor, Claude Code, etc.) with the peer-path repo open. Apply it after the functionality rebuild (PEERPATH-REBUILD-PROMPT.md) is complete — or in parallel, starting with Section 3 (design tokens) first. This prompt changes how PeerPath looks and feels. It must not break any functionality: every button, flow, and dashboard from the rebuild prompt must keep working exactly as specified there.

1. Design Vision
The feeling: PeerPath should feel like a modern campus, not a corporate SaaS dashboard and not a childish school app. Warm, confident, academic, and alive. A student should open it and think "this is my university, and it was designed for me."
The reference feeling (not to copy, to aim for): the cleanliness of Linear and Notion, the warmth of Duolingo, the trust of a university portal. Generous whitespace, one clear action per screen, honest data, zero visual noise.
Five design principles — every decision must pass these:
One clear action per screen. Every page has a single primary action (Enroll, Discover, Post, Mark Attendance). Everything else is visually quieter.
Warm minimalism. Mostly warm whites and ink text. Color is used sparingly and always means something (amber = action/highlight, department colors = identity, red/green = status).
Content is the design. Real course names, real people, real numbers. No lorem ipsum, no fake stats, no decorative filler. If a section has nothing real to say, remove it.
Consistency beats creativity. Same buttons, same cards, same spacing everywhere. A component designed once is reused everywhere — never a one-off style.
Mobile is not an afterthought. Every screen is designed mobile-first and must feel native on a phone, where most ULAB students will use it.

2. Brand
Name: PeerPath. Wordmark: "PeerPath" in the display font, with a small amber graduation-cap or pathway mark. No generic globe/graduation clipart as the logo.
Tagline: "Find your path at ULAB." (Use on the home hero and footer — nowhere else.)
Voice in UI copy: friendly, short, student-first. Buttons say what happens: "Enroll in this course", not "Submit". Empty states encourage: "No saved courses yet — discover your next course."
ULAB identity: ULAB's colors are blue and gold. This system honors that: deep navy as the primary, warm amber/gold as the accent. The ULAB campus logo mark stays on auth pages only, refined and small — never stretched, never recolored.

3. Design Tokens (implement first — everything else follows)
Implement these as CSS variables in globals.css and wire them into the Tailwind theme. All components must use these tokens — no hard-coded hex colors in components.
3.1 Color
Token
Value
Usage
--background
#FAFAF7
Page background (warm paper white, not cold gray)
--foreground
#101828
Primary text (ink, near-black)
--muted-foreground
#667085
Secondary text, captions
--card
#FFFFFF
Card surfaces
--border
#E7E5DE
Borders, dividers (warm gray)
--muted
#F2F1EC
Subtle fills (hover states, wells)
--primary
#1B2A4A
Deep navy — primary buttons, headings accent, active nav
--primary-hover
#141F38
Primary button hover
--primary-foreground
#FFFFFF
Text on primary
--accent
#F59E0B
Amber/gold — key CTAs (Enroll, Get Recommendations), highlights, active indicators
--accent-hover
#D97706
Accent hover
--accent-foreground
#1A1305
Text on accent (near-black — never white on amber)
--sidebar
#0F172A
Dashboard sidebar background (dark navy)
--sidebar-foreground
#E2E8F0
Sidebar text
--success
#16A34A
Success states, "Enrolled", present
--warning
#D97706
Warnings, pending
--danger
#DC2626
Destructive actions, errors, absent
--info
#2563EB
Informational (use rarely)
Color rules:
Amber is the only bright color for actions. Use it for at most one primary CTA per screen. If everything is amber, nothing is.
Navy is for structure: primary buttons, headings, sidebar, footer. Never use navy as a page background (too heavy).
Department identity colors (tinted badges only, never full saturated fills):
CSE #2563EB, BBA #16A34A, MSJ #7C3AED, English #E11D48, Bangla #EA580C — each used as a light tint background (<color>/10) with dark text (<color> at 700 weight). Example: CSE badge = bg-blue-50 text-blue-700 border-blue-100.
Status colors are only for status (success/warning/danger). Never use red or green decoratively.
3.2 Typography
Use next/font/google. Two families only.
Role
Font
Usage
Display / headings
Plus Jakarta Sans (600, 700, 800)
Page titles, section headings, hero, card titles
Body / UI
Inter (400, 500, 600)
Body text, buttons, inputs, table content, captions
Type scale (desktop):
Element
Size / Weight / Line-height
Hero display
48–56px / 800 / 1.05, tight tracking (-0.02em)
Page title (h1)
32–36px / 700 / 1.15
Section title (h2)
24–28px / 700 / 1.25
Card title (h3)
18–20px / 600 / 1.3
Body
15–16px / 400 / 1.6
Small / caption
13–14px / 400–500 / 1.5
Button
14–15px / 600
Type rules: Never use more than 3 sizes on one screen. Never set body text below 14px. Line length max ~70 characters for reading content. Headings use sentence case ("Discover your next course"), never ALL CAPS except tiny eyebrow labels (12px, tracking-wide, muted).
3.3 Spacing, Radius, Shadows
Spacing: 8px base grid. Section padding: 64–96px desktop, 40–48px mobile. Card padding: 20–24px. Gap between cards: 16–24px.
Radius: buttons/inputs 10px (rounded-lg); cards 16px (rounded-2xl); modals 16px; badges/pills 999px; avatars 999px.
Shadows (soft, layered — never harsh):
Card resting: 0 1px 2px rgba(16,24,40,0.05), 0 1px 3px rgba(16,24,40,0.06)
Card hover / raised: 0 4px 12px rgba(16,24,40,0.08), 0 2px 4px rgba(16,24,40,0.04)
Modal / dropdown: 0 12px 32px rgba(16,24,40,0.14)
Borders: 1px --border on cards and inputs. Cards use border + soft shadow together (never shadow alone, never heavy borders).

4. Components (restyle the existing shadcn-style primitives in components/ui)
Build on what exists. Restyle via tokens — do not rebuild components from scratch unless a component does not exist.
4.1 Buttons
Variants: Primary (navy bg, white text), Accent (amber bg, near-black text — only for the single key CTA per screen, e.g. Enroll), Outline (white bg, border, ink text), Ghost (transparent, hover muted), Destructive (red).
Sizes: sm (32px), md (40px), lg (48px). Full-width on mobile forms only.
States (all required): hover (slightly darker bg + 150ms transition), active (scale 0.98), disabled (40% opacity, no pointer), loading (spinner + disabled, label stays visible).
Rules: one primary button per visual group. Never place two accent buttons side by side. Icons (lucide, 16px) sit left of the label with an 8px gap.
4.2 Cards
White bg, 1px border, rounded-2xl, soft shadow, 20–24px padding.
Clickable cards (course, faculty, alumni): hover lifts the card (translateY(-2px) + raised shadow + border darkens), 200ms transition. The whole card is clickable, not just a small button.
Course card anatomy (strict order): image (16:10, top, rounded top corners only) → department badge + semester → title (2 lines max, ellipsis) → instructor + rating → footer row (credits · seats left) + Enroll/Save actions. No price anywhere.
Stat cards (dashboards): label (small, muted, uppercase eyebrow), big number (28px, 700), delta/trend line (small, green/red), icon in a tinted square (top-right, never large).
4.3 Inputs & Forms
Height 40px (md), rounded-lg, 1px border, white bg, 14px text. Focus: 2px amber ring + border darkens. Error: red border + red helper text below + icon.
Labels above inputs (14px, 500 weight), always visible — never placeholder-only labels.
Selects, checkboxes, and radios match the same language. Multi-select filters use pill toggles (see 4.4).
4.4 Badges & Pills
Department badges: tinted (Section 3.1). Status badges: Enrolled (green tint), Pending (amber tint), Saved (navy tint), Full (red tint).
Filter pills: unselected = white + border; selected = navy bg + white text; 150ms transition. Selected state must be obvious at a glance.
4.5 Avatars
Photo if available, otherwise initials on a department-tinted background (e.g. CSE = blue tint). Never a blank box, never a broken image icon.
Sizes: xs 24px, sm 32px, md 40px, lg 64px (profiles), xl 96px (profile headers).
4.6 Tables (dashboards)
Header row: 12px uppercase eyebrow, muted, bottom border. Rows: 56px height, 14px text, hover muted bg, bottom hairline. No zebra striping. Right-align numbers. Row actions in a compact ... menu (never a row of tiny buttons).
Mobile: tables scroll horizontally inside a card with a visible scroll hint, or collapse to stacked cards below 640px.
4.7 Navigation
Public navbar: white/translucent with backdrop blur, 1px bottom border on scroll. Logo left, links center (or left after logo), session actions right. Active link: navy text + amber underline bar (3px, rounded). Mobile: hamburger → full slide-down panel (not a cramped dropdown).
Dashboard sidebar (dark navy #0F172A): grouped nav with 12px group labels ("Overview", "Manage", "Account"), 14px items, icons 18px, active item = white/10 bg pill + amber left bar (3px). User card pinned at the bottom (avatar, name, role, logout). Collapses to icons below 1024px, hidden behind hamburger below 768px.
Breadcrumbs on dashboard sub-pages (Dashboard / Courses / CSE101). Never let a back-link hide under a sticky header — content must start below the header with proper top padding.
4.8 Modals, Toasts, Empty States, Skeletons
Modals: centered, max-width 480–560px, rounded-2xl, backdrop blur + dim, close on Escape and backdrop click, focus the first field. One primary action, one cancel.
Toasts: bottom-right, dark navy bg (#101828), white text, colored left icon (green check / red alert / amber info), auto-dismiss 4s, slide-up entrance.
Empty states: centered icon in a tinted circle (48px), one-line heading, one-line explanation, one CTA button. Never a blank area, never "No data".
Skeletons: shimmer pulse in --muted, matching the shape of the real content (card skeleton for cards, row skeleton for tables).
4.9 Footer (redesign — the current one is a copy-pasted auto-parts template)
Navy background (#0F172A), white/muted text. Four columns: Brand (logo + one-line description + socials), Explore (Discover, Courses, Faculty, Community), Community (Students, Alumni, Events, Jobs), Support (Contact, FAQ, Privacy, Terms). Bottom bar: © year PeerPath · "Made for ULAB students" · Back to top. Every link works.

5. Page-by-Page Art Direction
5.1 Home (/)
Hero: warm paper background, left-aligned display headline ("Find your path at ULAB."), one supporting line, ONE accent CTA ("Discover courses") + one outline CTA ("Browse faculty"). Right side: a single strong campus/course image in a rounded frame with a small floating stat card (real numbers). No carousels in the hero, no auto-playing anything.
Section rhythm: alternate --background and white sections. Every section has an eyebrow label + title + max 2-line subtitle, then content. Sections: Why PeerPath (3–4 features, icons in tinted squares) → Courses preview (4 cards + "View all") → How it works (3 steps) → Testimonials (2–3 real quotes, large serif-free quote styling, avatar + name + role) → Alumni preview → FAQ (accordion, max 6 questions) → CTA band (navy bg, white text, one accent button) → Contact (simple form card).
Remove: fake stats band, repeated testimonials, generic SaaS copy, the "Book Your Service" form.
5.2 Discover (/discover)
Layout: sticky filter bar under the navbar (department pills + semester select), course grid below (3 cols desktop, 2 tablet, 1 mobile).
Selection panel: sticky right panel on desktop (320px) showing selected courses, total credits with a progress bar toward the 14-credit limit, and the Confirm Enrollment button. On mobile it becomes a fixed bottom bar ("3 courses · 9 credits" + View button → bottom sheet).
Recommendations: a distinct section with an amber left accent ("Recommended for you") — visually separated from the main grid so users understand these are suggestions, not the catalogue.
5.3 Courses (/courses) and Course Detail (/courses/[id])
List: search input with icon + filter pills row (department, difficulty). Grid of course cards (Section 4.2). Result count line ("Showing 12 courses").
Detail: hero band (image left or top, 16:9, correct image) → title + badges + rating → two-column body: main column (About, Syllabus week-by-week accordion, Reviews) + sticky sidebar card (credits, semester, seats with a seats-left progress bar, instructor mini-card, Enroll + Save buttons). The sidebar is the conversion zone — it must be visible without scrolling on desktop.
5.4 Faculty, Students, Alumni directories
Same directory pattern everywhere (consistency!): search + filters on top, card grid below, identical card anatomy (avatar, name, title/role, department badge, 1-line bio, 2 actions). A user who learns one directory knows all three.
Profile pages: header band with large avatar, name, title, department badge, key stats row (rating, experience, courses) → tabbed content (About / Courses / Reviews) → sidebar card with contact actions. Tabs, not one endless scroll.
5.5 Community (/community)
Layout: two columns on desktop — feed (left, max 640px) + right rail (groups list, trending topics, community guidelines card). Single column on mobile.
Composer: card at the top of the feed with avatar + "Share something with your campus…" placeholder → expands to full editor with group selector + Post button.
Post card: author row (avatar, name, time, group badge, ... menu) → content → action row (Like with count, Comment with count, Share, Report). Comments nest with a left border line and collapse after 3 with "View all N comments".
5.6 Auth pages (/signIn, /signUp, /forgot-password)
Kill the standalone yellow theme. Auth pages use the same system: split layout — left panel (navy bg, PeerPath wordmark, one inspiring line, small ULAB campus image, testimonial quote) + right panel (white, centered form card, max 400px). Mobile: logo + form only, no left panel.
Demo login buttons: a "Try a demo account" section with 6 role chips (Student, Faculty, Teacher, Moderator, Alumni, Admin) — one click each, clearly labeled as demo.
5.7 Dashboards (/dashboard/*)
Shell: dark navy sidebar (Section 4.7) + light content area (--background) + white topbar (page title, search, notifications bell with dot, avatar menu).
Overview pages: 4 stat cards in a row (desktop) → 2-column grid: chart card (enrollment/activity trend — Recharts styled with navy + amber, no default rainbow colors) + "Needs attention" card (pending items with quick actions) → recent activity table.
Charts: maximum 2 colors per chart (navy + amber), light grid lines, no 3D, no gradients, direct labels instead of legends where possible.
List pages (Users, Courses, Posts, Reports): search + filters + clean table (Section 4.6) + pagination. Bulk actions appear only when rows are selected.
Detail/drawer views: clicking a row opens a right-side drawer (480px) with full details and actions — do not navigate away for quick reviews.

6. Images and Media Rules
Aspect ratios (strict): course images 16:10, hero images 16:9, avatars 1:1, event images 16:9. Never stretch, never crop faces badly.
Every image needs a fallback: if an image fails to load, show a tinted placeholder with the course code or initials — never a broken-image icon, never an empty box.
Correct matching only: an image must depict its subject. Audit every image assignment (the Data Science page must not show a Bangla literature mural).
Optimization: use next/image everywhere with proper sizes. No image wider than 1200px in the repo. Compress before committing.
No stock-photo clichés: no handshakes, no random skyscrapers, no "diverse students laughing" filler. Use real ULAB campus photos (already in public/) and clean illustrated/typographic treatments where no real photo exists.

7. Motion and Micro-interactions
Duration: 150–250ms for UI transitions (hover, open, toggle). 300ms max for page-level transitions. Nothing slower — this is a tool, not a showcase.
Easing: ease-out for entrances, ease-in-out for state changes. No bounce, no elastic, no spring overshoot on functional UI.
Allowed: button hover states, card lift on hover, modal/drawer slide+fade, accordion expand, toast slide-up, skeleton shimmer, tab underline slide, sidebar collapse.
Remove or tame: the shine-border, marquee, and scroll-velocity effects — keep at most ONE subtle use (e.g. a gentle marquee on the home page logo strip, if any). Decorative motion must never distract from reading or delay an action.
Respect prefers-reduced-motion: disable all non-essential animation for users who prefer it.

8. Responsive Rules (mobile-first)
Breakpoint
Layout changes
<640px (mobile)
Single column everywhere. Navbar → hamburger panel. Dashboard sidebar → hidden behind hamburger. Grids → 1 column. Tables → horizontal scroll or stacked cards. Selection panel → fixed bottom bar. Modals → bottom sheets. Touch targets min 44px.
640–1024px (tablet)
2-column grids. Sidebar → icon-only rail. Detail pages → single column, sidebar card moves below content.
>1024px (desktop)
Full layouts as specified in Section 5. Max content width 1280px, centered, with 24px side padding.
Design every screen at 375px FIRST, then scale up. If it doesn't work on a phone, it doesn't ship.
Test: home, discover (with selection), one course detail, one dashboard overview, and community — at 375px, 768px, and 1440px.

9. Accessibility Checklist
Text contrast: body text ≥ 4.5:1, large text ≥ 3:1 (the navy/amber/ink palette is chosen to pass this — verify, don't assume).
Never use color alone to convey meaning: status always has an icon + label, not just a color dot.
All interactive elements keyboard-reachable with a visible focus ring (2px amber).
All images have meaningful alt text (or empty alt for pure decoration).
Forms have real <label> elements, error messages tied to fields, and required fields marked.
Touch targets minimum 44×44px on mobile.

10. What NOT to Do
No purple/blue gradients. No glassmorphism. No neon. No dark-mode-everything (the product is light-first; dark exists only in the dashboard sidebar).
No more than 2 font families, no more than 3 font sizes per screen.
No decorative stock photos, no emoji as UI icons (lucide only), no text in images.
No carousels that auto-play. No popups on page load. No fake urgency ("Only 2 seats left!!!" with red flashing text).
No redesigning the information architecture: page structure and flows come from PEERPATH-REBUILD-PROMPT.md. This prompt changes the presentation, not the product.

11. Execution Plan (do it in this order)
Phase D1 — Tokens: Implement Section 3 (colors, typography, spacing, radius, shadows) as CSS variables + Tailwind theme. Replace hard-coded colors across the codebase. Verify the app still builds and looks coherent.
Phase D2 — Primitives: Restyle components/ui (buttons, cards, inputs, badges, avatars, tables, modals, toasts, skeletons, empty states) per Section 4. Build the dashboard shell (sidebar + topbar) and the new footer.
Phase D3 — Public pages: Apply the art direction in Section 5.1–5.6 page by page (Home → Discover → Courses → Directories → Community → Auth). Fix all images per Section 6.
Phase D4 — Dashboards: Apply Section 5.7 to all six dashboards. Style charts (navy + amber only). Verify every dashboard at mobile width.
Phase D5 — Motion + responsive + a11y polish: Apply Sections 7–9. Remove or tame gimmicky effects. Run the verification checklist below.
After each phase, run npm run build, fix errors, and commit with a clear message (e.g. design D2: restyle primitives and dashboard shell).

12. Visual QA Checklist (verify every item before calling it complete)
npm run build passes. No functionality from the rebuild prompt is broken (spot-check: enroll, save, post, login as each role, one dashboard action per role).
Every screen uses only the Section 3 tokens — no hard-coded hex in components (search for #[0-9a-fA-F]{6} outside globals.css — must return zero results, except intentional image/brand values).
Exactly 2 font families in use (Plus Jakarta Sans + Inter).
Amber appears at most once as a primary CTA per screen.
All images load, match their subject, and have fallbacks (disable images in dev tools and confirm no broken icons).
Home, Discover, one course detail, Community, and one dashboard look correct at 375px, 768px, and 1440px.
The footer is the new PeerPath footer on every page (no JBAY text anywhere — search the codebase for "JBAY" and "drivers on the road", must return zero results).
Auth pages match the main design system (no standalone yellow theme).
Focus rings are visible on every interactive element via keyboard navigation.
No auto-playing carousels, no popups on load, no shine-border/marquee gimmicks on functional screens.
prefers-reduced-motion disables decorative animation.

End of design prompt. Pair with PEERPATH-REBUILD-PROMPT.md (functionality). Functionality first, design second — but design tokens (Phase D1) can start in parallel with the functionality rebuild.