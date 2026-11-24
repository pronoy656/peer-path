"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { signUp } from "@/lib/services/auth";
import type { Department } from "@/lib/types";
import AuthSplitLayout from "@/components/common/signIn/auth-split-layout";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const { state, dispatch, showToast } = useAppStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState<Department>("CSE");
  const [batch, setBatch] = useState("241");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = signUp(state, dispatch, {
      name,
      email,
      password,
      department,
      batch,
    });
    if (!res.ok) {
      setError(res.error);
      showToast(res.error, "error");
      return;
    }
    showToast(`Account created! Welcome to PeerPath, ${res.user.name}.`);
    router.push(res.dashboardPath);
  };

  return (
    <AuthSplitLayout>
      <div className="space-y-6">
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
            Create student account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join ULAB PeerPath to enroll in courses and connect with peers.
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
              htmlFor="signup-name"
              className="block text-sm font-medium mb-1.5"
            >
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ayesha Siddika"
              className="w-full h-10 px-3.5 border border-border rounded-lg bg-card text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium mb-1.5"
            >
              ULAB email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ayesha@ulab.edu.bd"
              className="w-full h-10 px-3.5 border border-border rounded-lg bg-card text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="signup-dept"
                className="block text-sm font-medium mb-1.5"
              >
                Department
              </label>
              <select
                id="signup-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full h-10 px-3 border border-border rounded-lg bg-card text-sm"
              >
                <option value="CSE">CSE</option>
                <option value="BBA">BBA</option>
                <option value="MSJ">MSJ</option>
                <option value="English">English</option>
                <option value="Bangla">Bangla</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="signup-batch"
                className="block text-sm font-medium mb-1.5"
              >
                Batch
              </label>
              <input
                id="signup-batch"
                type="text"
                required
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="241"
                className="w-full h-10 px-3.5 border border-border rounded-lg bg-card text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium mb-1.5"
            >
              Password (min 6 characters)
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full h-10 px-3.5 border border-border rounded-lg bg-card text-sm pr-10"
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

          <Button type="submit" variant="default" size="md" className="w-full">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signIn"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
