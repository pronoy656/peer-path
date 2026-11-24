import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold">Terms of Use</h1>
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
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}
