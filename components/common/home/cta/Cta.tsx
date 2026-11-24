"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/AppStore";

export default function Cta() {
  const { dispatch, showToast } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    dispatch({
      type: "ADD_SUPPORT_MESSAGE",
      message: {
        id: `sup-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        handled: false,
        createdAt: new Date().toISOString(),
      },
    });
    setName("");
    setEmail("");
    setMessage("");
    setSubmitted(true);
    showToast("Message sent to PeerPath support!");
  };

  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-[var(--shadow-card)] space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Support
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Questions for the PeerPath team?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Reach out about course listings, department transfers, or mentor
            onboarding.
          </p>
        </div>

        {submitted && (
          <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Thank you! Your message has been delivered to the Admin Support
              inbox.
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-danger px-4 py-2.5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cta-name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Your name
              </label>
              <input
                id="cta-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arif Rahman"
                className="w-full h-10 px-3.5 rounded-lg border border-border bg-card text-sm text-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="cta-email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                ULAB email
              </label>
              <input
                id="cta-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ulab.edu.bd"
                className="w-full h-10 px-3.5 rounded-lg border border-border bg-card text-sm text-foreground"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="cta-message"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Message
            </label>
            <textarea
              id="cta-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about courses, advising, or mentor matching..."
              rows={4}
              className="w-full p-3.5 rounded-lg border border-border bg-card text-sm text-foreground resize-none"
            />
          </div>

          <Button type="submit" variant="default" size="md">
            <Send className="w-4 h-4" />
            Send message
          </Button>
        </form>
      </div>
    </section>
  );
}
