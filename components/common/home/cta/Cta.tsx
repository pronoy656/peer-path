"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
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
    showToast("Message sent to PeerPath ULAB Support!");
  };

  return (
    <div
      className="relative bg-cover bg-center flex items-center justify-center rounded-3xl overflow-hidden"
      style={{
        backgroundImage: "url(/ulab-D1-building.png)",
      }}
    >
      <div className="absolute inset-0 bg-black/60 rounded-3xl" />

      <div className="relative z-10 w-full max-w-3xl px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-3">
            Contact ULAB PeerPath Support
          </h2>
          <p className="text-base sm:text-lg text-white/90">
            Have a question about course registration, advising, or mentorship?
            Reach our campus team directly.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-white px-4 py-3 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>
              Thank you! Your message has been saved and will appear in the
              Admin Support inbox.
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/20 border border-red-400/50 text-white px-4 py-2.5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="cta-name"
                className="block text-sm font-semibold text-white mb-2"
              >
                Your Name
              </label>
              <input
                id="cta-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arif Rahman"
                className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>
            <div>
              <label
                htmlFor="cta-email"
                className="block text-sm font-semibold text-white mb-2"
              >
                ULAB Email
              </label>
              <input
                id="cta-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ulab.edu.bd"
                className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="cta-message"
              className="block text-sm font-semibold text-white mb-2"
            >
              Message
            </label>
            <textarea
              id="cta-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about courses, department transfers, or mentor matching..."
              rows={4}
              className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              Send Message
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
