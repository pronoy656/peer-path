import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Arif Rahman",
    role: "CSE • Batch 241",
    body: "PeerPath helped me pair CSE202 with the right 3-credit electives without crossing the 14-credit semester limit.",
    initials: "AR",
  },
  {
    name: "Tasnim Tabassum",
    role: "BBA • Batch 241",
    body: "Reading senior reviews before pre-registration saved me so much guesswork. I even found two teammates for our case competition.",
    initials: "TT",
  },
  {
    name: "Dr. Sarah Johnson",
    role: "Associate Professor • CSE",
    body: "Having office hours, lab sheets, and student questions in one workspace keeps my courses organized every semester.",
    initials: "SJ",
  },
  {
    name: "Maliha Chowdhury",
    role: "MSJ • Batch 241",
    body: "I connected with a Daily Star alumni producer through PeerPath and got direct feedback on my documentary storyboard.",
    initials: "MC",
  },
  {
    name: "Nabil Hossain",
    role: "English • Batch 232",
    body: "Discovering Creative Writing Workshop and messaging Dr. Nusrat about the reading list took less than two minutes.",
    initials: "NH",
  },
  {
    name: "Rahim Uddin",
    role: "Alumni Mentor • bKash",
    body: "Mentoring current ULAB CSE juniors and posting Dhaka internships directly to campus talent feels effortless.",
    initials: "RU",
  },
];

const firstRow = reviews.slice(0, 3);
const secondRow = reviews.slice(3);

const ReviewCard = ({
  initials,
  name,
  role,
  body,
}: {
  initials: string;
  name: string;
  role: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-72 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-yellow-400/30 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-foreground">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{role}</p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-foreground/80 leading-relaxed">
        {body}
      </blockquote>
    </figure>
  );
};

export default function Review() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-12">
      <div className="mb-10 px-4">
        <p className="text-4xl sm:text-5xl font-bold text-center mb-4">
          ULAB Student, Faculty &amp; Alumni Voices
        </p>
        <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto text-balance">
          Hear how students, professors, and graduates use PeerPath every
          semester.
        </p>
      </div>
      <Marquee pauseOnHover className="[--duration:24s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:24s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-linear-to-r" />
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-linear-to-l" />
    </div>
  );
}
