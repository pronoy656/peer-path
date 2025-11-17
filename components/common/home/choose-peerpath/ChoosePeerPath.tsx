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
    title: "Course Discovery",
    description:
      "Find the perfect courses tailored to your learning goals and career aspirations.",
    icon: <Search className="w-7 h-7" />,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    id: "2",
    title: "Peer Reviews",
    description:
      "Read honest reviews from students who have already taken these courses.",
    icon: <MessageCircle className="w-7 h-7" />,
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    id: "3",
    title: "Alumni Network",
    description:
      "Connect with graduates and build valuable professional relationships.",
    icon: <Users className="w-7 h-7" />,
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
  },
  {
    id: "4",
    title: "Verified Ratings",
    description:
      "Trust authentic ratings verified by our community of real learners.",
    icon: <Star className="w-7 h-7" />,
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  {
    id: "5",
    title: "Recommendations",
    description:
      "Get personalized course recommendations based on your interests and goals.",
    icon: <Lightbulb className="w-7 h-7" />,
    iconBg: "bg-rose-500",
    iconColor: "text-white",
  },
  {
    id: "6",
    title: "Community Forums",
    description:
      "Join discussions, ask questions, and learn from the community.",
    icon: <MessageSquare className="w-7 h-7" />,
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
  },
];

export default function ChoosePeerPath() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-secondary/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl sm:text-6xl font-bold text-foreground mb-4 text-balance">
            Why Choose Peer-path?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Everything you need to make informed decisions about your education
            and career growth.
          </p>
        </div>

        {/* Features Grid */}
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

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
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
