import { Avatar } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Arif Rahman",
    role: "CSE · Batch 241",
    department: "CSE",
    quote:
      "PeerPath helped me pair Data Structures with the right 3-credit electives without crossing the 14-credit semester limit.",
  },
  {
    name: "Tasnim Tabassum",
    role: "BBA · Batch 241",
    department: "BBA",
    quote:
      "Reading senior reviews before advising saved me hours of guesswork, and I found two teammates for our case competition.",
  },
  {
    name: "Dr. Sarah Johnson",
    role: "Associate Professor · CSE",
    department: "CSE",
    quote:
      "Keeping office hours, lab sheets, and student questions in one workspace keeps my courses organized every semester.",
  },
];

export default function Review() {
  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Campus voices
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Trusted by ULAB students and faculty
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real feedback from peers and instructors across departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="rounded-2xl border border-border bg-background p-6 flex flex-col justify-between gap-6"
            >
              <blockquote className="text-base text-foreground leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-border">
                <Avatar
                  name={item.name}
                  size="md"
                  department={item.department}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
