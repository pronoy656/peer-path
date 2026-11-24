"use client";

import React, { useEffect, useState } from "react";
import { X, UserPlus, Send, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User as PeerUser } from "@/lib/types";
import { useAppStore } from "@/lib/store/AppStore";
import { sendConnectionRequest, sendDirectMessage } from "@/lib/services/people";
import { Button } from "@/components/ui/button";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: PeerUser;
}

export default function ConnectModal({
  isOpen,
  onClose,
  student,
}: ConnectModalProps) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const requireAuth = () => {
    if (!currentUser) {
      showToast("Please sign in to connect or message peers.", "info");
      onClose();
      router.push("/signIn");
      return false;
    }
    return true;
  };

  const handleSendConnectRequest = () => {
    if (!requireAuth() || !currentUser) return;
    if (currentUser.id === student.id) {
      showToast("This is your own PeerPath profile.", "info");
      return;
    }
    const res = sendConnectionRequest(state, dispatch, currentUser.id, student.id);
    showToast(res.message, res.ok ? "success" : "info");
    if (res.ok) onClose();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth() || !currentUser || !messageText.trim()) return;
    sendDirectMessage(state, dispatch, {
      senderId: currentUser.id,
      recipientId: student.id,
      content: messageText,
    });
    showToast(`Message sent to ${student.name}!`);
    setMessageText("");
    setShowMessageForm(false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Connect with ${student.name}`}
        className="bg-card border border-border rounded-2xl w-full max-w-md shadow-[var(--shadow-modal)] overflow-hidden"
      >
        <div className="bg-sidebar text-white p-6 relative">
          <button
            type="button"
            aria-label="Close connect dialog"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold font-display mb-1">
            Connect with {student.name}
          </h2>
          <p className="text-sidebar-foreground/80 text-sm">
            {student.department} · Batch {student.batch}
          </p>
        </div>

        <div className="p-6 space-y-3">
          <Button
            type="button"
            variant="accent"
            className="w-full justify-start"
            onClick={handleSendConnectRequest}
          >
            <UserPlus className="w-4 h-4" />
            Send connect request
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowMessageForm(!showMessageForm)}
          >
            <Send className="w-4 h-4" />
            Message directly
          </Button>

          {showMessageForm && (
            <form onSubmit={handleSendMessage} className="space-y-2.5 pt-2">
              <textarea
                required
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Say hi to ${student.name}...`}
                className="w-full p-3 border border-border rounded-lg text-sm resize-none"
              />
              <Button type="submit" size="sm" className="w-full">
                Send message
              </Button>
            </form>
          )}

          <Link href={`/students/${student.id}`} onClick={onClose} className="block">
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-4 h-4" />
              View full student profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
