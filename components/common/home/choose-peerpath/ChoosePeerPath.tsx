import { Card } from "@/components/ui/card";
import {
  Search,
  MessageCircle,
  Users,
  Star,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const features: FeatureCard[] = [
  {
    id: "1",
    title: "Semester Course Discovery",
    description:
      "Filter ULAB courses across CSE, BBA, MSJ, English, and Bangla by semester while tracking the 14-credit limit.",
    icon: <Search className="w-7 h-7" />,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    id: "2",
    title: "Honest Senior Reviews",
    description:
      "Read real feedback from ULAB peers who already completed the course, including instructor replies.",
    icon: <MessageCircle className="w-7 h-7" />,
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    id: "3",
    title: "ULAB Alumni Mentors",
    description:
      "Connect with graduates working at bKash, Pathao, Chaldal, The Daily Star, and BRAC for career guidance.",
    icon: <Users className="w-7 h-7" />,
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
  },
  {
    id: "4",
    title: "Faculty Office Hours",
    description:
      "Check faculty research areas, teaching methodology, current courses, and message professors directly.",
    icon: <Star className="w-7 h-7" />,
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  {
    id: "5",
    title: "Smart Recommendations",
    description:
      "Get rule-based semester recommendations tailored to your department, current semester, and difficulty level.",
    icon: <Lightbulb className="w-7 h-7" />,
    iconBg: "bg-rose-500",
    iconColor: "text-white",
  },
  {
    id: "6",
    title: "Department Community",
    description:
      "Ask seniors about midterms, form case-competition teams, and stay safe with active student moderation.",
    icon: <MessageSquare className="w-7 h-7" />,
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
  },
];

export default function ChoosePeerPath() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Choose PeerPath?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Replacing scattered PDFs and Facebook groups with one organized hub
            built for ULAB students, faculty, and alumni.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="group relative overflow-hidden border border-border bg-card transition-all duration-300 rounded-xl"
            >
              <div className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.iconBg} ${feature.iconColor} mb-4`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
