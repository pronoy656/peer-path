"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "Is PeerPath free for ULAB students?",
    answer:
      "Yes. PeerPath is completely free for all University of Liberal Arts Bangladesh students, faculty, class teachers, and alumni mentors.",
  },
  {
    id: 2,
    question: "How does semester course registration work?",
    answer:
      "Use Discover to filter by your department and semester, select courses within the 14-credit limit, and click Confirm Enrollment to save them to your Student Dashboard.",
  },
  {
    id: 3,
    question: "How can I reach faculty for office hours?",
    answer:
      "Open any professor's profile in the Faculty Directory to view office hours, room numbers, syllabi, and send a direct message to their dashboard inbox.",
  },
  {
    id: 4,
    question: "How does alumni mentorship work?",
    answer:
      "Browse ULAB graduates on the Alumni page, open a mentor profile, and send a mentorship request with your goals. Once accepted, you can message directly.",
  },
  {
    id: 5,
    question: "Can I see senior reviews before choosing an elective?",
    answer:
      "Yes. Every course detail page lists peer reviews from ULAB students, instructor replies, and weekly syllabus topics.",
  },
  {
    id: 6,
    question: "How is the campus community moderated?",
    answer:
      "Any post or comment can be reported in one click. ULAB moderators review reports, hide rule-breaking content, and issue warnings or suspensions when needed.",
  },
];

export default function FaqSection() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <section id="faq" className="py-16 lg:py-20 px-4 sm:px-6 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Frequently asked questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quick answers for ULAB students, faculty, and alumni.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-colors duration-150",
                  isExpanded
                    ? "border-primary/40 bg-background"
                    : "border-border bg-card hover:border-foreground/20"
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="text-base font-semibold text-foreground">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                      isExpanded ? "rotate-180 text-primary" : ""
                    )}
                  />
                </button>
                {isExpanded && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
