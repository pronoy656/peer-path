import Link from "next/link";
import { Compass, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
        <SearchX className="w-8 h-8" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        PeerPath · ULAB
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground mb-3">
        Page not found
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8">
        The page you are looking for does not exist or may have moved. Explore
        courses or head back to the PeerPath home page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="default" size="lg">
            <Home className="w-4 h-4" />
            Back to home
          </Button>
        </Link>
        <Link href="/discover">
          <Button variant="outline" size="lg">
            <Compass className="w-4 h-4" />
            Discover courses
          </Button>
        </Link>
      </div>
    </div>
  );
}
