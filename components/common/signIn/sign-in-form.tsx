"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import { ShineBorder } from "@/components/ui/shine-border";

const UlabLogo = () => (
  <svg
    viewBox="0 0 200 200"
    className="w-24 h-24 mx-auto mb-8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Yellow outer circle */}
    <circle
      cx="100"
      cy="100"
      r="95"
      fill="#FCD34D"
      stroke="#FCD34D"
      strokeWidth="2"
    />

    {/* Inner design with blue and gold */}
    <circle cx="100" cy="100" r="80" fill="white" />

    {/* Musical note-like design */}
    <ellipse cx="85" cy="75" rx="15" ry="20" fill="#3B82F6" />
    <rect x="82" y="95" width="6" height="35" fill="#3B82F6" />
    <path
      d="M 88 130 Q 100 135 120 130"
      stroke="#FCD34D"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Text arc */}
    <defs>
      <path id="circlePath" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
    </defs>
    <text fontSize="11" fill="#1F2937" fontWeight="bold" letterSpacing="2">
      <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
        ULABCAMPUS
      </textPath>
    </text>
  </svg>
);

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in attempt:", { email, password, rememberPassword });
  };
  return (
    <div className="w-full animate-fade-in">
      {/* <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} /> */}
      {/* Logo */}
      <div className="mb-8 animate-slide-down">
        <UlabLogo />
      </div>

      {/* Heading */}
      <div
        className="text-center mb-8 animate-slide-down"
        style={{ animationDelay: "0.1s" }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Login to your account</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 animate-slide-down"
        style={{ animationDelay: "0.2s" }}
      >
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember Password & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded cursor-pointer accent-yellow-400"
            />
            <span className="text-sm text-gray-700">Remember Password</span>
          </label>
          <a
            href="#"
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Forgot Password
          </a>
        </div>

        {/* Log In Button */}
        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md"
        >
          Log In
        </button>
      </form>

      {/* Sign Up Link */}
      <div
        className="text-center mt-6 animate-slide-down"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="text-gray-700">
          {` Don't have an account?`}
          <a
            href="#"
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Sign Up
          </a>
        </p>
      </div>

      {/* Google Button */}
      <button
        type="button"
        className="w-full mt-6 flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 animate-slide-down"
        style={{ animationDelay: "0.4s" }}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>
    </div>
  );
}
