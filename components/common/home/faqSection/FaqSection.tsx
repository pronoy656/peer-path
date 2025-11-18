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
    question: "What makes your service unique?",
    answer:
      "Our service combines cutting-edge technology with exceptional customer support. We offer personalized solutions, 24/7 assistance, and continuous innovation to ensure you always stay ahead.",
  },
  {
    id: 2,
    question: "How do I get started?",
    answer:
      "Getting started is simple! Sign up for an account, choose your plan, and follow our onboarding guide. Within minutes, you'll have access to all our premium features and tools.",
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, bank transfers, and cryptocurrency. All transactions are secure and encrypted with industry-leading security protocols.",
  },
  {
    id: 4,
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, absolutely. You can cancel your subscription at any time without penalties or hidden fees. Your data remains yours, and we'll provide a smooth transition process.",
  },
  {
    id: 5,
    question: "Do you offer customer support?",
    answer:
      "We provide comprehensive customer support through multiple channels including email, live chat, and phone support. Our team is available 24/7 to assist you with any questions.",
  },
  {
    id: 6,
    question: "Is my data secure?",
    answer:
      "Security is our top priority. We use end-to-end encryption, regular security audits, and comply with GDPR and other international data protection standards.",
  },
];

export default function FaqSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-18 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            {`  Find answers to common questions about our service. Can't find what
            you're looking for?`}
          </p>
        </div>

        {/* FAQ Items */}
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
          ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/50 "
          : "bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/10"
      )}
    >
      {/* Question Button */}
      <button
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
            isExpanded ? " font-bold" : "text-foreground"
          )}
        >
          {item.question}
        </h3>
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform duration-300 ease-out",
            isExpanded ? "rotate-180" : ""
          )}
        >
          <ChevronDown className="w-4 h-4 text-white stroke-[2.5]" />
        </div>
      </button>

      {/* Answer */}
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
