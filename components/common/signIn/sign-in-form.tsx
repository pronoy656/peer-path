"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getDemoAccounts,
  signIn,
  signInDemoRole,
} from "@/lib/services/auth";

export default function SignInForm() {
  const { state, dispatch, showToast } = useAppStore();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const demoAccounts = getDemoAccounts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = signIn(state, dispatch, email, password);
    if (!result.ok) {
      setError(result.error);
      showToast(result.error, "error");
      return;
    }
    showToast(`Welcome back, ${result.user.name}!`);
    router.push(result.dashboardPath);
  };

  const handleDemoLogin = (role: (typeof demoAccounts)[number]["role"]) => {
    setError("");
    const result = signInDemoRole(state, dispatch, role);
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast(`Signed in as ${result.user.name} (${result.user.role})`);
    router.push(result.dashboardPath);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-slate-900 font-extrabold text-base">P</span>
          </div>
          <span className="font-bold text-foreground">PeerPath</span>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your ULAB PeerPath account
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-medium"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="signin-email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Email
          </label>
          <input
            type="email"
            id="signin-email"
            placeholder="you@ulab.edu.bd or demo email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            required
          />
        </div>

        <div>
          <label
            htmlFor="signin-password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="signin-password"
              placeholder="Enter password (demo1234)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background pr-10"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-yellow-400 cursor-pointer"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
        >
          Sign In
        </button>
      </form>

      {/* One-Click Demo Logins */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            One-Click Demo Logins
          </span>
          <span className="text-xs text-muted-foreground">
            Password: <code>demo1234</code>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {demoAccounts.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => handleDemoLogin(acc.role)}
              className="text-left p-2.5 rounded-xl border border-border bg-muted/40 hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            >
              <span className="block text-xs font-bold text-foreground">
                {acc.label}
              </span>
              <span className="block text-[11px] text-muted-foreground truncate">
                {acc.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signUp"
          className="font-semibold text-foreground hover:text-primary underline"
        >
          Create Student Account
        </Link>
      </p>
    </div>
  );
}
