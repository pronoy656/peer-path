"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { signUp } from "@/lib/services/auth";
import type { Department } from "@/lib/types";
import ImageCarousel from "@/components/common/signIn/image-carousel";

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/30 p-4 sm:p-6 lg:p-8 gap-6">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="w-full max-w-md space-y-6">
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
                <span className="text-slate-900 font-extrabold text-base">
                  P
                </span>
              </div>
              <span className="font-bold text-foreground">PeerPath</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Create Student Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join ULAB PeerPath to enroll in courses, post in Community, and
              message mentors.
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
                htmlFor="signup-name"
                className="block text-sm font-medium mb-1.5"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayesha Siddika"
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium mb-1.5"
              >
                ULAB Email
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ayesha@ulab.edu.bd"
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
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
                  className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
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
                  className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background pr-10"
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

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signIn"
              className="font-semibold text-foreground hover:text-primary underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-3xl min-h-[600px]">
        <ImageCarousel />
      </div>
    </div>
  );
}
