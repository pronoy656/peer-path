"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getDemoAccounts,
  signIn,
  signInDemoRole,
} from "@/lib/services/auth";
import { Button } from "@/components/ui/button";

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
          Home
        </Link>
        <div className="inline-flex items-center gap-2 lg:hidden">
          <span className="w-7 h-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </span>
          <span className="font-display font-bold text-base text-primary">
            PeerPath
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
          Sign in to PeerPath
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your ULAB email or choose a demo role below.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 text-danger px-3.5 py-2.5 text-sm font-medium"
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
            placeholder="you@ulab.edu.bd"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3.5 border border-border rounded-lg bg-card text-sm"
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
              className="w-full h-10 px-3.5 border border-border rounded-lg bg-card text-sm pr-10"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <span className="text-muted-foreground text-xs">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="default" size="md" className="w-full">
          Sign in
        </Button>
      </form>

      {/* Try a demo account */}
      <div className="pt-4 border-t border-border space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-muted-foreground">
            Try a demo account
          </span>
          <span className="text-muted-foreground">
            pass: <code>demo1234</code>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {demoAccounts.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => handleDemoLogin(acc.role)}
              className="text-left px-3 py-2 rounded-lg border border-border bg-background hover:border-primary hover:bg-muted transition-colors"
            >
              <span className="block text-xs font-semibold text-foreground">
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
        New to PeerPath?{" "}
        <Link
          href="/signUp"
          className="font-semibold text-primary hover:underline"
        >
          Create student account
        </Link>
      </p>
    </div>
  );
}
