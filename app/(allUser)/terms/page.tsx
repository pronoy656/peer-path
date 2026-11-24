import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold font-display">
        Terms of use
      </h1>
      <p className="text-muted-foreground leading-relaxed">
        PeerPath exists to help ULAB students, faculty, class teachers, and
        alumni collaborate respectfully. By posting in the Community feed or
        submitting course reviews, you agree to keep feedback constructive,
        accurate, and free of harassment.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Moderators reserve the right to hide posts or suspend accounts that
        violate ULAB academic integrity or community guidelines.
      </p>
      <Link href="/" className="inline-block">
        <Button variant="default">Back to home</Button>
      </Link>
    </div>
  );
}
