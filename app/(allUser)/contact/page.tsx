import Cta from "@/components/common/home/cta/Cta";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Contact PeerPath</h1>
        <p className="text-muted-foreground">
          Questions about ULAB courses, faculty advising, or mentor onboarding?
          Send us a note below.
        </p>
      </div>
      <Cta />
    </div>
  );
}
