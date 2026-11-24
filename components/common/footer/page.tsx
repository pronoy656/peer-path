import Link from "next/link";
import { ScrollBasedVelocityDemo } from "./Velocity";

const footerSections = [
  {
    title: "Explore",
    links: [
      { title: "Discover Courses", href: "/discover" },
      { title: "All Courses", href: "/courses" },
      { title: "Faculty Directory", href: "/faculty" },
      { title: "Community Feed", href: "/community" },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "Students", href: "/students" },
      { title: "Alumni Mentors", href: "/alumni" },
      { title: "Campus Events", href: "/events" },
      { title: "Alumni Job Board", href: "/jobs" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Contact Us", href: "/contact" },
      { title: "FAQ", href: "/#faq" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Use", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="max-w-7xl mx-auto px-6 xl:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-10 z-20 relative">
          <div className="col-span-full lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-slate-900 font-extrabold text-xl">P</span>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  PeerPath
                </span>
                <span className="block text-xs font-medium text-muted-foreground">
                  ULAB Campus Learning Network
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
              PeerPath helps University of Liberal Arts Bangladesh (ULAB)
              students find the right semester courses, connect with peers and
              faculty, learn from alumni mentors, and grow together.
            </p>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className="font-semibold text-foreground md:text-right">
                {title}
              </h6>
              <ul className="mt-4 space-y-3 md:text-right text-sm">
                {links.map(({ title: linkTitle, href }) => (
                  <li key={linkTitle}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {linkTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground relative z-20">
          <p>
            © {new Date().getFullYear()} PeerPath — University of Liberal Arts
            Bangladesh (ULAB) Student Community.
          </p>
          <p>Built for CSE, BBA, MSJ, English &amp; Bangla learners.</p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden -mt-20 pointer-events-none select-none">
        <ScrollBasedVelocityDemo />
      </div>
    </footer>
  );
}
