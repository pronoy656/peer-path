"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { forgotPassword } from "@/lib/services/auth";
import { useAppStore } from "@/lib/store/AppStore";

export default function ForgotPasswordPage() {
  const { showToast } = useAppStore();
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = forgotPassword(email);
    if (!res.ok) {
      showToast(res.message, "error");
      return;
    }
    setSent(true);
    setStatusMessage(res.message);
    showToast("Password reset instructions prepared.", "info");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
        <Link
          href="/signIn"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your PeerPath or @ulab.edu.bd email address to receive reset
            instructions.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              Reset Link Sent
            </div>
            <p className="text-sm text-emerald-900/80">{statusMessage}</p>
            <p className="text-xs text-muted-foreground">
              Demo accounts always use <code>demo1234</code>.
            </p>
            <Link
              href="/signIn"
              className="inline-block w-full text-center py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-sm"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@peerpath.demo"
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
