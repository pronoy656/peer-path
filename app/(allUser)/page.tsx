import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AlumniSections } from "@/components/common/home/alumni-section/AlumniSections";
import ChoosePeerPath from "@/components/common/home/choose-peerpath/ChoosePeerPath";
import CourseMap from "@/components/common/home/courses/CourseMap";
import Cta from "@/components/common/home/cta/Cta";
import FaqSection from "@/components/common/home/faqSection/FaqSection";
import HeroSection from "@/components/common/home/heroSection/HeroSection";
import Review from "@/components/common/home/review/Review";

const steps = [
  {
    step: "01",
    title: "Filter your semester",
    description:
      "Pick your ULAB department and semester on Discover to see courses and track the 14-credit cap.",
  },
  {
    step: "02",
    title: "Check reviews & faculty",
    description:
      "Read verified senior feedback, weekly syllabi, and faculty office hours before registering.",
  },
  {
    step: "03",
    title: "Enroll & connect",
    description:
      "Confirm enrollment into your Student Dashboard, join department discussions, and message alumni mentors.",
  },
];

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ChoosePeerPath />
      <CourseMap />

      {/* How it works (3 steps) */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                How it works
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Plan your semester in three steps
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Open semester planner <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-border bg-card p-6 space-y-3"
              >
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-bold">
                  Step {item.step}
                </span>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Review />
      <AlumniSections />
      <FaqSection />
      <Cta />
    </div>
  );
}
