import Link from "next/link";
import { Compass, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-background to-muted/40">
      <div className="w-16 h-16 rounded-2xl bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center mb-6">
        <SearchX className="w-8 h-8 text-yellow-600" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
        PeerPath • ULAB
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
        Page not found
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for does not exist or may have moved. Explore
        courses or head back to the PeerPath home page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold shadow-md transition"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold transition"
        >
          <Compass className="w-4 h-4" />
          Discover Courses
        </Link>
      </div>
    </div>
  );
}
