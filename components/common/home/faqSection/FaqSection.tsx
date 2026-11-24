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
      "Yes. PeerPath is completely free for all University of Liberal Arts Bangladesh (ULAB) students, faculty, class teachers, and alumni mentors. There are no paid courses or subscription fees.",
  },
  {
    id: 2,
    question: "How does semester course enrollment work?",
    answer:
      "Use the Discover page to filter courses by your department (CSE, BBA, MSJ, English, or Bangla) and semester. Add courses up to the 14-credit limit, then click Confirm Enrollment to add them to your Student Dashboard.",
  },
  {
    id: 3,
    question: "How can I connect with faculty and check office hours?",
    answer:
      "Visit the Faculty Directory to browse professors by department. Each profile lists office hours, room numbers, research areas, syllabus courses, and a Contact Me button that delivers your message directly to the professor's dashboard inbox.",
  },
  {
    id: 4,
    question: "How does Alumni Mentorship work?",
    answer:
      "Browse ULAB graduates on the Alumni page, open any mentor profile, and click Request Mentorship with a short note about your goals. Once accepted, you can message your mentor and track guidance directly from your dashboard.",
  },
  {
    id: 5,
    question: "Can I see what seniors think before picking a course?",
    answer:
      "Yes! Every course detail page and faculty profile displays verified peer reviews from ULAB students, along with faculty replies and weekly syllabus topics.",
  },
  {
    id: 6,
    question: "How does PeerPath keep the community safe?",
    answer:
      "Every post and comment in the Community feed has a Report button. Dedicated ULAB moderators review reports, hide inappropriate content, and warn or suspend accounts that violate campus guidelines.",
  },
];

export default function FaqSection() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleItem = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Quick answers for ULAB students, faculty, and alumni getting started
            with PeerPath.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQItemProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQItem({ item, isExpanded, onToggle }: FAQItemProps) {
  return (
    <div
      className={cn(
        "group border-2 border-border rounded-xl overflow-hidden transition-all duration-300 ease-out",
        isExpanded
          ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/50"
          : "bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/10"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full px-6 py-4 md:px-8 md:py-5 flex items-center justify-between gap-4 text-left transition-all duration-300",
          isExpanded ? "bg-primary/5" : "hover:bg-accent/5"
        )}
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${item.id}`}
      >
        <h3
          className={cn(
            "text-lg md:text-xl font-semibold pr-4 text-balance",
            isExpanded ? "font-bold" : "text-foreground"
          )}
        >
          {item.question}
        </h3>
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center transition-transform duration-300 ease-out",
            isExpanded ? "rotate-180" : ""
          )}
        >
          <ChevronDown className="w-4 h-4 text-white stroke-[2.5]" />
        </div>
      </button>

      <div
        id={`faq-answer-${item.id}`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-6 py-4 md:px-8 md:py-5 border-t-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
          <p className="text-muted-foreground leading-relaxed text-balance">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
