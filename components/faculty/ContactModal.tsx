"use client";

import React, { useEffect, useState } from "react";
import { X, Send, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/AppStore";
import { sendDirectMessage } from "@/lib/services/people";
import { Button } from "@/components/ui/button";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  facultyId,
  facultyName,
  facultyEmail,
}: ContactModalProps) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in to send a message to faculty.", "info");
      onClose();
      router.push("/signIn");
      return;
    }
    sendDirectMessage(state, dispatch, {
      senderId: currentUser.id,
      recipientId: facultyId,
      subject,
      content: message,
    });
    setSent(true);
    showToast(`Message sent to ${facultyName}!`);
    setTimeout(() => {
      setSent(false);
      setSubject("");
      setMessage("");
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Contact ${facultyName}`}
        className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-[var(--shadow-modal)] overflow-hidden"
      >
        <div className="bg-sidebar text-white p-6 relative">
          <button
            type="button"
            aria-label="Close contact dialog"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold font-display mb-1 flex items-center gap-2">
            <Mail className="w-5 h-5 text-accent" />
            Contact faculty
          </h2>
          <p className="text-sidebar-foreground/80 text-sm truncate">
            To: {facultyName} ({facultyEmail})
          </p>
        </div>

        <div className="p-6">
          {sent ? (
            <div className="text-center py-6 space-y-2">
              <div className="mx-auto w-12 h-12 bg-green-50 text-success rounded-full flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Message delivered</h3>
              <p className="text-muted-foreground text-sm">
                Your note is now in {facultyName}&apos;s PeerPath inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="faculty-subject"
                  className="block text-sm font-medium mb-1.5"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="faculty-subject"
                  required
                  autoFocus
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3.5 border border-border rounded-lg text-sm"
                  placeholder="e.g. Question about CSE101 office hours"
                />
              </div>
              <div>
                <label
                  htmlFor="faculty-message"
                  className="block text-sm font-medium mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="faculty-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 border border-border rounded-lg text-sm resize-none"
                  placeholder="Write your message here..."
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent">
                  <Send className="w-4 h-4" />
                  Send message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
