import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold font-display">
        Privacy policy
      </h1>
      <p className="text-muted-foreground leading-relaxed">
        PeerPath is an academic peer-learning platform built for the ULAB
        community. In this local-first release, all session data, enrollments,
        saved courses, posts, and messages are stored strictly inside your
        browser&apos;s localStorage under <code>peerpath-state-v1</code>.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        No personal data is transmitted to third-party servers. You can restore
        the initial seed data at any time using Reset Demo Data in your
        dashboard settings.
      </p>
      <Link href="/" className="inline-block">
        <Button variant="default">Back to home</Button>
      </Link>
    </div>
  );
}
