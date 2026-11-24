"use client";

import React, { useEffect, useState } from "react";
import { X, UserPlus, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User as PeerUser } from "@/lib/types";
import { useAppStore } from "@/lib/store/AppStore";
import { sendConnectionRequest, sendDirectMessage } from "@/lib/services/people";

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Connect with ${student.name}`}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="bg-yellow-400 p-6 relative">
              <button
                type="button"
                aria-label="Close connect dialog"
                onClick={onClose}
                className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-bold text-black mb-1">
                Connect with {student.name}
              </h2>
              <p className="text-black/80 font-medium text-sm">
                {student.department} • Batch {student.batch}
              </p>
            </div>

            <div className="p-6 space-y-3">
              <button
                type="button"
                onClick={handleSendConnectRequest}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-amber-900 font-semibold transition-colors border border-yellow-200"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <UserPlus className="w-5 h-5 text-amber-600" />
                </div>
                <span>Send Connect Request</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMessageForm(!showMessageForm)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold transition-colors border border-blue-200"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <span>Message Directly</span>
              </button>

              {showMessageForm && (
                <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
                  <textarea
                    required
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Say hi to ${student.name}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              )}

              <Link
                href={`/students/${student.id}`}
                onClick={onClose}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold transition-colors border border-gray-200"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
                <span>View Full Student Profile</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
