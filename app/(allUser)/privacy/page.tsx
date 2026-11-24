import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground leading-relaxed">
        PeerPath is an academic peer-learning prototype built for the ULAB
        community. In this local-first release, all session data, enrollments,
        saved courses, posts, and messages are stored strictly inside your own
        browser&apos;s localStorage under the key{" "}
        <code>peerpath-state-v1</code>.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        No personal data is transmitted to third-party servers. You can restore
        the initial seed data at any time using the Reset Demo Data action in
        your dashboard settings.
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
