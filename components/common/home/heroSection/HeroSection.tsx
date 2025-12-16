// import React from "react";

// export default function HeroSection() {
//   return <div>HeroSection</div>;
// }

import {
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  GraduationCap,
  Star,
  Clock,
} from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Dynamic Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-300/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-32 lg:pb-40 ">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-10 relative z-10">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-yellow-50 via-yellow-100/50 to-amber-50 backdrop-blur-xl border border-yellow-400/40 rounded-full shadow-lg shadow-yellow-500/10">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-sm bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  #1 Course Management Platform 2024
                </span>
              </div>

              {/* Main Headline with Gradient */}
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none">
                  <span className="block text-slate-900">Empower</span>
                  <span className="block bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Education
                  </span>
                  <span className="block text-slate-900">Excellence</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                  Revolutionary course management platform that combines
                  AI-powered insights with intuitive design to transform how you
                  teach and learn.
                </p>
              </div>

              {/* CTA Buttons with Enhanced Design */}
              <div className="flex flex-wrap gap-4">
                <button className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-slate-900 rounded-2xl transition-all duration-300 shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <Zap className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                </button>
                <button className="group inline-flex items-center gap-3 px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-300 border border-slate-900 shadow-xl hover:shadow-2xl">
                  <Play className="w-5 h-5 text-yellow-400" />
                  <span>See It In Action</span>
                </button>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  {
                    icon: TrendingUp,
                    value: "10M+",
                    label: "Active Users",
                    color: "from-yellow-500 to-amber-500",
                  },
                  {
                    icon: GraduationCap,
                    value: "50K+",
                    label: "Courses",
                    color: "from-amber-500 to-orange-500",
                  },
                  {
                    icon: Star,
                    value: "4.9/5",
                    label: "Rating",
                    color: "from-yellow-400 to-yellow-600",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-white border border-slate-200 rounded-2xl p-4 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-semibold text-slate-900">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Enhanced Image Section */}
            <div className="relative lg:h-[700px] flex items-center justify-center">
              {/* Floating Cards Background */}
              <div className="absolute inset-0">
                {/* Main Image with Glass Effect */}
                <div className="relative h-full flex items-center justify-center">
                  <div className="relative w-full max-w-lg">
                    {/* Main Card */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2">
                      <Image
                        src="/students.jpg"
                        alt="Modern education technology"
                        width={300}
                        height={400}
                        className="w-full h-auto aspect-[3/4] object-cover rounded-2xl"
                      />
                    </div>

                    {/* Floating Card 1 - Top Left */}
                    <div
                      className="absolute -top-8 -left-8 bg-white backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-slate-200 animate-float"
                      style={{
                        animation: "float 6s ease-in-out infinite",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                          <BookOpen className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                          <div className="text-slate-900">2,847</div>
                          <p className="text-xs text-slate-600">
                            New Students Today
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Floating Card 2 - Top Right */}
                    <div
                      className="absolute -top-4 -right-12 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl px-6 py-4 shadow-2xl animate-float"
                      style={{
                        animation: "float 5s ease-in-out infinite",
                        animationDelay: "1s",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-slate-900" />
                        <span className="text-slate-900">98% Success Rate</span>
                      </div>
                    </div>

                    {/* Floating Card 3 - Bottom Right */}
                    <div
                      className="absolute -bottom-6 -right-8 bg-slate-900 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-slate-800 animate-float"
                      style={{
                        animation: "float 7s ease-in-out infinite",
                        animationDelay: "2s",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-slate-900" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-white">Live Now</span>
                          </div>
                          <p className="text-xs text-slate-400">
                            324 Active Classes
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Floating Card 4 - Bottom Left */}
                    <div
                      className="absolute -bottom-8 -left-10 bg-white backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200 animate-float"
                      style={{
                        animation: "float 6s ease-in-out infinite",
                        animationDelay: "0.5s",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-400 border-2 border-white"></div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 border-2 border-white"></div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-white"></div>
                        </div>
                        <div>
                          <div className="text-slate-900 text-sm">+12K</div>
                          <p className="text-xs text-slate-600">Instructors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/4 -right-12 w-24 h-24 border-4 border-yellow-400/40 rounded-3xl rotate-12 animate-spin-slow"></div>
              <div
                className="absolute bottom-1/4 -left-12 w-32 h-32 border-4 border-amber-400/30 rounded-3xl -rotate-12 animate-spin-slow"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "20s",
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
