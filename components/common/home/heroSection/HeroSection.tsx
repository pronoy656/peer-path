"use client";

import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Users,
  Compass,
  Megaphone,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses } from "@/lib/services/courses";

export default function HeroSection() {
  const { state } = useAppStore();
  const approvedCourses = getCourses(state);
  const departmentCount = new Set(approvedCourses.map((c) => c.department)).size;
  const facultyCount = state.facultyProfiles.length;
  const alumniCount = state.alumniProfiles.length;
  const studentCount = state.users.filter((u) => u.role === "student").length;
  const activeCourseCount = approvedCourses.length;

  const platformBanner = state.announcements.find((a) => a.isPlatformWide);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-300/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-3xl" />
      </div>

      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-28 lg:pb-32">
          {platformBanner && (
            <div className="mb-8 rounded-2xl border border-yellow-400/60 bg-yellow-50/90 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3 text-sm text-slate-900">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400 text-slate-900 shrink-0">
                  <Megaphone className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold">{platformBanner.title}: </span>
                  <span className="text-slate-700">{platformBanner.content}</span>
                </div>
              </div>
              <Link
                href="/discover"
                className="text-xs font-bold text-amber-800 hover:underline shrink-0"
              >
                Explore Discover →
              </Link>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-yellow-50 via-yellow-100/50 to-amber-50 backdrop-blur-xl border border-yellow-400/40 rounded-full shadow-lg shadow-yellow-500/10">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-semibold text-amber-700">
                  ULAB Student Peer-Learning &amp; Mentorship Hub
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
                  <span className="block text-slate-900">Right Courses.</span>
                  <span className="block bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Right Peers.
                  </span>
                  <span className="block text-slate-900">Right Mentors.</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed">
                  PeerPath helps ULAB students plan semesters across{" "}
                  {departmentCount} departments, read honest senior course
                  reviews, reach faculty office hours, and connect with alumni
                  mentors — all in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/discover"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-slate-900 font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-yellow-500/25 hover:scale-105"
                >
                  <Compass className="w-5 h-5" />
                  <span>Discover Courses</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/signIn"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl"
                >
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span>Try 6 Role Demos</span>
                </Link>
              </div>

              {/* Computed Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  {
                    icon: GraduationCap,
                    value: `${activeCourseCount}+`,
                    label: "ULAB Courses",
                  },
                  {
                    icon: Building2,
                    value: `${departmentCount}`,
                    label: "Departments",
                  },
                  {
                    icon: Users,
                    value: `${facultyCount + alumniCount}+`,
                    label: "Faculty & Mentors",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-white border border-slate-200 rounded-2xl p-4 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold text-slate-900">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:h-[620px] flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2">
                  <Image
                    src="/students.jpg"
                    alt="ULAB students collaborating on PeerPath"
                    width={500}
                    height={640}
                    className="w-full h-auto aspect-[3/4] object-cover rounded-2xl"
                    priority
                  />
                </div>

                <div className="hidden sm:block absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-xl flex items-center justify-center shadow">
                      <BookOpen className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {studentCount} Peers
                      </div>
                      <p className="text-xs text-slate-600">
                        Active on Campus
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block absolute -top-4 -right-6 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl px-5 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-slate-900" />
                    <span className="font-semibold text-sm text-slate-900">
                      100% Free for ULAB
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block absolute -bottom-6 -right-6 bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800">
                  <div className="text-sm font-semibold text-white">
                    {alumniCount} Alumni Mentors
                  </div>
                  <p className="text-xs text-slate-400">
                    Dhaka Tech, Media &amp; Business
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
