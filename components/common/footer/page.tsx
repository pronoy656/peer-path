"use client";

import Link from "next/link";
import { ArrowUp, GraduationCap } from "lucide-react";

const footerSections = [
  {
    title: "Explore",
    links: [
      { title: "Discover courses", href: "/discover" },
      { title: "All courses", href: "/courses" },
      { title: "Faculty directory", href: "/faculty" },
      { title: "Community feed", href: "/community" },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "Students", href: "/students" },
      { title: "Alumni mentors", href: "/alumni" },
      { title: "Campus events", href: "/events" },
      { title: "Alumni job board", href: "/jobs" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Contact us", href: "/contact" },
      { title: "FAQ", href: "/#faq" },
      { title: "Privacy policy", href: "/privacy" },
      { title: "Terms of use", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-full lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="font-display font-bold text-xl text-white">
                PeerPath
              </span>
            </Link>
            <p className="text-sm font-medium text-white/90">
              Find your path at ULAB.
            </p>
            <p className="text-sm text-sidebar-foreground/70 max-w-sm leading-relaxed">
              Courses, peer reviews, faculty office hours, and alumni mentorship
              for University of Liberal Arts Bangladesh students.
            </p>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className="text-xs font-semibold uppercase tracking-wider text-white/90">
                {title}
              </h6>
              <ul className="mt-4 space-y-3 text-sm">
                {links.map(({ title: linkTitle, href }) => (
                  <li key={linkTitle}>
                    <Link
                      href={href}
                      className="text-sidebar-foreground/70 hover:text-white transition-colors duration-150"
                    >
                      {linkTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sidebar-foreground/65">
          <p>
            © {new Date().getFullYear()} PeerPath · Made for ULAB students
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-sidebar-foreground/80 hover:text-white transition-colors"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
