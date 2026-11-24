"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { forgotPassword } from "@/lib/services/auth";
import { useAppStore } from "@/lib/store/AppStore";
import AuthSplitLayout from "@/components/common/signIn/auth-split-layout";
import { Button } from "@/components/ui/button";

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
    <AuthSplitLayout>
      <div className="space-y-6">
        <Link
          href="/signIn"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your PeerPath or @ulab.edu.bd email address to receive reset
            instructions.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Reset link sent
            </div>
            <p className="text-sm text-green-900/80">{statusMessage}</p>
            <p className="text-xs text-muted-foreground">
              Demo accounts use <code>demo1234</code>.
            </p>
            <Link href="/signIn" className="block pt-1">
              <Button variant="default" size="md" className="w-full">
                Return to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium mb-1.5"
              >
                Email address
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
                  className="w-full h-10 pl-10 pr-4 border border-border rounded-lg bg-card text-sm"
                />
              </div>
            </div>
            <Button type="submit" variant="default" size="md" className="w-full">
              Send reset link
            </Button>
          </form>
        )}
      </div>
    </AuthSplitLayout>
  );
}
