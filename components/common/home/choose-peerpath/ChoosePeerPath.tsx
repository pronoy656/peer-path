import { BookOpen, MessageCircle, Users, Compass } from "lucide-react";

const features = [
  {
    id: "1",
    title: "Semester planner",
    description:
      "Filter CSE, BBA, MSJ, English, and Bangla courses by semester within the 14-credit cap.",
    icon: <Compass className="w-5 h-5" />,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    id: "2",
    title: "Honest senior reviews",
    description:
      "Read verified peer ratings and instructor replies before pre-registration opens.",
    icon: <MessageCircle className="w-5 h-5" />,
    tone: "bg-amber-50 text-amber-800",
  },
  {
    id: "3",
    title: "Faculty office hours",
    description:
      "Check room schedules, weekly syllabi, and message ULAB professors directly.",
    icon: <BookOpen className="w-5 h-5" />,
    tone: "bg-green-50 text-green-700",
  },
  {
    id: "4",
    title: "Alumni mentorship",
    description:
      "Request 1-on-1 guidance and apply to Dhaka internships posted by ULAB graduates.",
    icon: <Users className="w-5 h-5" />,
    tone: "bg-purple-50 text-purple-700",
  },
];

export default function ChoosePeerPath() {
  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Why PeerPath
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Everything ULAB students need in one place
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            No more scattered PDFs or buried group posts when planning your
            semester.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-2xl border border-border bg-background p-6 space-y-3"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.tone}`}
              >
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
