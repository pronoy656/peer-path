import Image from "next/image";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthSplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-card">
      {/* Left Navy Brand Panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-sidebar text-white p-12">
        <Link href="/" className="inline-flex items-center gap-2.5 w-fit">
          <span className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </span>
          <span className="font-display font-bold text-xl text-white">
            PeerPath
          </span>
        </Link>

        <div className="space-y-6 max-w-md">
          <h2 className="text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            Find your path at ULAB.
          </h2>
          <p className="text-sm text-sidebar-foreground/80 leading-relaxed">
            One organized portal for semester course planning, senior reviews,
            faculty office hours, and alumni mentorship.
          </p>
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="/ulab-campus-2.jpg"
              alt="ULAB Permanent Campus"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
          <blockquote className="text-sm italic text-sidebar-foreground/85 border-l-2 border-accent pl-4">
            &ldquo;PeerPath helped me plan my CSE electives and connect directly
            with alumni working in Dhaka.&rdquo;
            <footer className="not-italic text-xs text-sidebar-foreground/60 mt-1">
              — Arif Rahman, CSE Batch 241
            </footer>
          </blockquote>
        </div>

        <p className="text-xs text-sidebar-foreground/50">
          University of Liberal Arts Bangladesh · PeerPath
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-background lg:bg-card">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
